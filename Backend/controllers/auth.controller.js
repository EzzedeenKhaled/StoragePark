import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import {sendVerificationEmail} from "../lib/mail.js";
import crypto from "crypto";

const generateTokens = (userId) => {
	const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "15m",
	});

	const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "7d",
	});

	return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
	await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60); // 7days
};

const setCookies = (res, accessToken, refreshToken) => {
	res.cookie("accessToken", accessToken, {
		httpOnly: true, // prevent XSS attacks, cross site scripting attack
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
		maxAge: 15 * 60 * 1000, // 15 minutes
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true, // prevent XSS attacks, cross site scripting attack
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	});
};

export const forgotPassword = async (req, res) => {
	const { email } = req.body;

	try {
		const user = await User.findOne({ email: email });

		if (!user) {
			return res.status(404).json({ message: "Email not found." });
		}

		// Generate a random 6-digit code
		// const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

		// Alternatively, if you want something even more secure (optional):
		const resetCode = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6-char hex string

		// Save the code to the user document
		user.resetPasswordCode = resetCode;
		user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // Code valid for 10 minutes
		await user.save();
		await sendVerificationEmail(email, resetCode, true,false);
		// TODO: Send the code via email to the user here
		// For now, just send it back in the response for testing
		return res.status(200).json({
			message: "Reset code generated.",
			success: true,
			code: resetCode // (only for testing; don't send codes in production responses)
		});

	} catch (error) {
		console.error('Error generating reset code:', error);
		return res.status(500).json({ message: "Server error." });
	}
};


export const signup = async (req, res) => {
	console.log("backend")
	const { email, password, firstName, lastName, role, phone: phoneNumber } = req.body;
	try {
		const userExists = await User.findOne({ email });

		if (userExists) {
			return res.status(400).json({ message: "User already exists" });
		}
		const buffer = crypto.randomBytes(3); // Generate 3 random bytes (24 bits)
		const numericToken = parseInt(buffer.toString("hex"), 16) % 1000000; // Convert to a number and limit to 6 digits
		const verificationToken = String(numericToken).padStart(6, "0");
		const user = await User.create({ firstName, lastName, email, password, role, verificationToken, phoneNumber });

		await sendVerificationEmail(email, verificationToken, false, false);

		res.status(201).json({
			message: "User registered. Please verify your email.",
			data: {
				_id: user._id,
				name: user.firstName + " " + user.lastName,
				email: user.email,
				role: user.role,
				isVerified: user.isVerified,
				phoneNumber: user.phoneNumber,
			}
		});
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ message: error.message });
	}
};
export const resetPassword = async (req, res) => {
	const { password, email } = req.body;

	if (!password || !email) {
		return res.status(400).json({ message: 'Password and email are required' });
	}

	try {
		// Find the user by email
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ message: 'User not found' });
		}

		// Set the user's password to the new plain-text password (no need to hash it here)
		user.password = password;

		// Save the user with the updated password
		await user.save();

		res.status(200).json({ message: 'Password reset successfully' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server error' });
	}
};
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if ((user?.role === "partner" || user?.role === "customer") && !user.isVerified) {
			console.log("old: ",user.verificationToken)
			user.verificationToken = undefined;
			const buffer = crypto.randomBytes(3); // Generate 3 random bytes (24 bits)
			const numericToken = parseInt(buffer.toString("hex"), 16) % 1000000; // Convert to a number and limit to 6 digits
			const verificationToken = String(numericToken).padStart(6, "0");
			user.verificationToken = verificationToken;
			await user.save();
			console.log("new: ",user.verificationToken)
			await sendVerificationEmail(email, verificationToken, false, false);
			return res.status(403).json({ message: "Account is not verified yet" });
		}
		if (user && (await user.comparePassword(password))) {
			const { accessToken, refreshToken } = generateTokens(user._id);
			await storeRefreshToken(user._id, refreshToken);
			setCookies(res, accessToken, refreshToken);
			res.json({
				_id: user._id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				role: user.role,
				isVerified: user.isVerified,
				profileImage: user.profileImage,
				phoneNumber: user.phoneNumber,
			});
		} else {
			res.status(400).json({ message: "Invalid email or password" });
		}
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ message: "An error occurred" });
	}
};

export const logout = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;
		if (refreshToken) {
			const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
			await redis.del(`refresh_token:${decoded.userId}`);
		}

		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");
		res.json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// this will refresh the access token
export const refreshToken = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;

		if (!refreshToken) {
			return res.status(401).json({ message: "No refresh token provided" });
		}

		const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
		const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

		if (storedToken !== refreshToken) {
			return res.status(401).json({ message: "Invalid refresh token" });
		}

		const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 15 * 60 * 1000,
		});

		res.json({ message: "Token refreshed successfully" });
	} catch (error) {
		console.log("Error in refreshToken controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Verify email
export const verifyEmail = async (req, res) => {
	console.log("backend verify email")
	const { token } = req.body; // Extract the 'token' property from the request body

	try {
		// Log the token for debugging
		console.log("Received token:", token);

		// Validate the token
		if (!token) {
			return res.status(400).json({ message: "Token is required." });
		}

		// Find the user with the given token
		const user = await User.findOne({ verificationToken: token });

		if (!user) {
			return res.status(400).json({ message: "Invalid or expired token." });
		}

		// Mark the user as verified
		// if(user.role !== "partner")
		user.isVerified = true;
		user.verificationToken = undefined; // Clear the token after verification
		await user.save();
		const { accessToken, refreshToken } = generateTokens(user._id);
		await storeRefreshToken(user._id, refreshToken);
		setCookies(res, accessToken, refreshToken);
		// Respond with success
		res.status(200).json({
			message: "Email verified successfully!",
			data: {
				_id: user._id,
				name: user.firstName + " " + user.lastName,
				email: user.email,
				role: user.role,
				isVerified: user.isVerified,
			}
		});
	} catch (error) {
		console.error("Error verifying email:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const verifyCode = async (req, res) => {
	const { token, email } = req.body;

	try {
		if (!token) {
			return res.status(400).json({ message: "Token is required." });
		}

		if (!email) {
			return res.status(400).json({ message: "Email is required." });
		}

		// Find the user by email
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({ message: "User not found." });
		}

		// Check if token matches
		if (user.resetPasswordCode !== token) {
			return res.status(400).json({ message: "Invalid verification code." });
		}

		// Check if token has expired
		if (user.resetPasswordExpires && user.resetPasswordExpires < Date.now()) {
			return res.status(400).json({ message: "Verification code has expired." });
		}

		// Clear the token and expiration
		user.resetPasswordCode = undefined;
		user.resetPasswordExpires = undefined;
		await user.save();

		// Success response
		res.status(200).json({
			message: "Code verified successfully!",
			data: {
				_id: user._id,
				name: user.firstName + " " + user.lastName,
				email: user.email,
				code: true,
			},
		});
	} catch (error) {
		console.error("Error verifying code:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};


export const getProfile = async (req, res) => {
	try {
		res.json({
			_id: req.user._id,
			firstName: req.user.firstName,
			lastName: req.user.lastName,
			email: req.user.email,
			role: req.user.role,
			isVerified: req.user.isVerified,
			phoneNumber: req.user.phoneNumber,
			profileImage: req.user.profileImage,
		});
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};