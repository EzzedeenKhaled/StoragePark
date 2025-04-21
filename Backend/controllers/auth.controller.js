import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import sendVerificationEmail from "../lib/mail.js";
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

		await sendVerificationEmail(email, verificationToken);

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

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (user?.role === "partner" || user?.role === "customer" && !user.isVerified) {
			return res.status(401).json({ message: "Account is not verified yet" });
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
		user.isVerified = true;
		user.verificationToken = undefined; // Clear the token after verification
		await user.save();

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
		});
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};