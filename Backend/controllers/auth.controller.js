import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

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
	const { email, password, firstName, lastName, role } = req.body;
	try {
		const userExists = await User.findOne({ email });

		if (userExists) {
			return res.status(400).json({ message: "User already exists" });
		}
		const user = await User.create({ firstName, lastName, email, password, role });

		// authenticate
		const { accessToken, refreshToken } = generateTokens(user._id);
		await storeRefreshToken(user._id, refreshToken);

		setCookies(res, accessToken, refreshToken);

		res.status(201).json({
			_id: user._id,
			name: user.firstName + " " + user.lastName,
			email: user.email,
			role: user.role,
		});
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
	  upload.fields([
		{ name: "certificateFile", maxCount: 1 },
		{ name: "businessLicenseFile", maxCount: 1 },
		{ name: "taxComplianceFile", maxCount: 1 }
	  ])(req, res, async (err) => {
		if (err) {
		  return res.status(400).json({ message: "Error uploading files", error: err.message });
		}
  
		// Find the most recent partner
		const partner = await User.findOne({ role: "partner" })
		  .sort({ createdAt: -1 })
		  .exec();
  
		if (!partner) {
		  return res.status(404).json({ message: "No partner found" });
		}
  
		const { certificateFile, businessLicenseFile, taxComplianceFile } = req.files;
  
		// Convert files to Base64
		if (certificateFile) {
		  partner.partner.certificateFile = certificateFile[0].buffer.toString("base64");
		}
		if (businessLicenseFile) {
		  partner.partner.businessLicenseFile = businessLicenseFile[0].buffer.toString("base64");
		}
		if (taxComplianceFile) {
		  partner.partner.taxComplianceFile = taxComplianceFile[0].buffer.toString("base64");
		}
  
		await partner.save();
  
		return res.status(200).json({
		  message: "Files uploaded and partner updated successfully",
		  partner
		});
	  });
	} catch (error) {
	  return res.status(500).json({ message: "Internal server error", error: error.message });
	}
  };
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if(user?.role === "partner" && !user.partner.isVerified){
			return res.status(401).json({ message: "Partner account is not verified yet" });
		}
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