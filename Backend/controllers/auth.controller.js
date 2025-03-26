import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import upload from "../lib/multer.js"; 
import sendVerificationEmail  from "../lib/mail.js";
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
	const { email, password, firstName, lastName, role } = req.body;
	try {
		const userExists = await User.findOne({ email });
		
		if (userExists) {
			return res.status(400).json({ message: "User already exists" });
		}
		const buffer = crypto.randomBytes(3); // Generate 3 random bytes (24 bits)
		const numericToken = parseInt(buffer.toString("hex"), 16) % 1000000; // Convert to a number and limit to 6 digits
		const verificationToken = String(numericToken).padStart(6, "0");
		const user = await User.create({ firstName, lastName, email, password, role, verificationToken });

		// authenticate
		// const { accessToken, refreshToken } = generateTokens(user._id);
		// await storeRefreshToken(user._id, refreshToken);

		// setCookies(res, accessToken, refreshToken);
		await sendVerificationEmail(email, verificationToken);

		res.status(201).json({ message: "User registered. Please verify your email." });
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ message: error.message });
	}
};
export const signup_Partner = async (req, res) => {
    const { firstName, lastName, email, phoneNumber, address, websiteURL, googleBusinessProfile, role, companyName, companyEmail } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists", email: userExists.email });
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            role: role || "partner",
            partner: {
                companyName,
                companyEmail,
                phoneNumber,
                address,
                websiteURL,
                googleBusinessProfile
            }
        });

        res.status(201).json({
            _id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: user.role,
            partner: user.partner
        });
    } catch (error) {
        console.error("Error in signup controller:", error.message);
        res.status(500).json({ message: error.message });
    }
};

export const uploadDocument = async (req, res) => {
	try {
	  // Handle file upload with multer
	  upload.fields([
		{ name: 'certificateFile', maxCount: 1 },
		{ name: 'businessLicenseFile', maxCount: 1 },
		{ name: 'taxComplianceFile', maxCount: 1 }
	  ])(req, res, async (err) => {
		if (err) {
		  return res.status(400).json({ message: 'Error uploading files', error: err.message });
		}
  
		// Find the most recently created partner
		const partner = await User.findOne({ role: 'partner' })
		  .sort({ createdAt: -1 }) // Sort by creation date in descending order (newest first)
		  .exec();
  
		if (!partner) {
		  return res.status(404).json({ message: 'No partner found' });
		}
  
		// Extract the files from the request
		const { certificateFile, businessLicenseFile, taxComplianceFile } = req.files;
  
		// Update the partner information in the database with the new file paths
		if (certificateFile) partner.partner.certificateFile = certificateFile[0].path;
		if (businessLicenseFile) partner.partner.businessLicenseFile = businessLicenseFile[0].path;
		if (taxComplianceFile) partner.partner.taxComplianceFile = taxComplianceFile[0].path;
  
		// Save the updated partner document to the database
		await partner.save();
  
		return res.status(200).json({ message: 'Files uploaded and partner updated successfully' });
	  });
	} catch (error) {
	  console.error('Error in uploadDocument controller:', error.message);
	  res.status(500).json({ message: 'Internal server error', error: error.message });
	}
};
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (user && (await user.comparePassword(password))) {
			const { accessToken, refreshToken } = generateTokens(user._id);
			await storeRefreshToken(user._id, refreshToken);
			setCookies(res, accessToken, refreshToken);

			res.json({
				_id: user._id,
				name: user.firstName + " " + user.lastName,
				email: user.email,
				role: user.role,
			});
		} else {
			res.status(400).json({ message: "Invalid email or password" });
		}
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ message: error.message });
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
	const { token } = req.body;
  
	try {
	  // Find the user with the given token
	  const user = await User.findOne({ verificationToken: token });
  
	  if (!user) {
		return res.status(400).json({ message: "Invalid or expired token." });
	  }
  
	  // Mark the user as verified and clear the token
	  console.log(user+"weeee");
	  user.isVerified = true;
	  user.verificationToken = undefined; // Clear the token after verification
	  await user.save();
  
	  res.status(200).json({ message: "Email verified successfully!" });
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ message: "Internal server error" });
	}
  };

