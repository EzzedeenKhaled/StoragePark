import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";
import Item from "../models/item.model.js";
import jwt from "jsonwebtoken";
import sendVerificationEmail from "../lib/mail.js";
import crypto from "crypto";
import { imagekit } from "../lib/imageKit.js";
import multer from "multer";
// import path from "path";
// import fs from "fs";
// import { fileURLToPath } from "url";
// import mime from "mime";

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

// export const getLogo = async (req, res) => { 
// 	const __filename = fileURLToPath(import.meta.url);
// 	const __dirname = path.dirname(__filename);
// 	const imagePath = path.join(__dirname, '../images/logo_d.png'); // Adjust the path as needed
//   // Check if the file exists
//   if (!fs.existsSync(imagePath)) {
//     return res.status(404).send('Image not found');
//   }
//   // Get the MIME type of the image
//   const mimeType = mime.lookup(imagePath);

//   // Set the appropriate headers and send the file
//   res.setHeader('Content-Type', mimeType);
//   res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
//   res.sendFile(imagePath);
// }
export const partnetInfoSignup = async (req, res) => {
	try {
		// Step 1: Query all admin documents
		const admins = await Admin.find().select("partners"); // Only retrieve the "partners" field

		// Step 2: Extract and flatten the partners array
		const allPartnerRequests = admins.flatMap((admin) => admin.partners);

		// Step 3: Return the list of partner requests to the frontend
		res.status(200).json(allPartnerRequests);
	} catch (error) {
		console.error("Error fetching partner requests:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
export const createProduct = async (req, res) => {
	try {
		// Extract the product data from the request
		const { category, productName, weight, quantity, pricePerUnit, description, brand, storageCondition, packagingType, packageWidth, packageHeight } = req.body;

		// Ensure the image is available
		if (!req.file) {
			return res.status(400).json({ message: 'Image is required.' });
		}

		// Convert the image file to base64
		const base64Img = req.file.buffer.toString('base64');
		const imgName = req.file.originalname; // Use a timestamp to ensure unique filenames
		//   console.log("Image name:", imgName);
		// Upload image to ImageKit
		const uploadResult = await UploadImage(base64Img, imgName);

		// Get the URL of the uploaded image
		const imageUrl = uploadResult.url;

		// Create a new product document
		const newProduct = new Item({
			category,
			productName,
			weight,
			quantity,
			pricePerUnit,
			description,
			brand,
			storageCondition,
			packagingType,
			packageWidth,
			packageHeight,
			imageProduct: imageUrl,
			// partner: "1841471"
		});

		// Save the product to the database
		await newProduct.save();

		// Return success response
		return res.status(201).json({ message: 'Product created successfully!', product: newProduct });
	} catch (error) {
		console.error('Error creating product:', error);
		return res.status(500).json({ message: 'Failed to create product. Please try again.' });
	}
};
export const acceptedPartners = async (req, res) => {
	try {
		// Step 1: Query all admin documents
		const admins = await Admin.find().select("partners"); // Only retrieve the "partners" field

		// Step 2: Extract and flatten the partners array
		const allAcceptedPartners = admins.flatMap((admin) => admin.partners.filter((partner) => partner.status === "approved"));

		// Step 3: Return the list of partner requests to the frontend
		res.status(200).json(allAcceptedPartners);
	} catch (error) {
		console.error("Error fetching partner requests:", error);
		res.status(500).json({ error: "Internal Server Error" });
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
export const signup_Partner = async (req, res) => {
	const { firstName, lastName, email, phoneNumber, address, websiteURL, role, companyName, companyEmail } = req.body;

	try {
		const userExists = await User.findOne({ email });
		if (userExists) {
			return res.status(400).json({ message: "User already exists", email: userExists.email });
		}
		const buffer = crypto.randomBytes(3); // Generate 3 random bytes (24 bits)
		const numericToken = parseInt(buffer.toString("hex"), 16) % 1000000; // Convert to a number and limit to 6 digits
		const verificationToken = String(numericToken).padStart(6, "0");


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
			},
			verificationToken
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
				const img = await UploadImage(certificateFile[0].buffer.toString("base64"), certificateFile[0].originalname);
				partner.partner.certificateFile = img.url;
			}

			if (businessLicenseFile) {
				const img = await UploadImage(businessLicenseFile[0].buffer.toString("base64"), businessLicenseFile[0].originalname);
				partner.partner.businessLicenseFile = img.url;
			}

			if (taxComplianceFile) {
				const img = await UploadImage(taxComplianceFile[0].buffer.toString("base64"), taxComplianceFile[0].originalname);
				partner.partner.taxComplianceFile = img.url;
			}

			await partner.save();

			await sendVerificationEmail(partner.email, partner.verificationToken);

			return res.status(200).json({
				message: "Files uploaded and partner updated successfully",
				partner
			});
		});
	} catch (error) {
		return res.status(500).json({ message: "Internal server error", error: error.message });
	}
};
const UploadImage = async (base64Img, imgName) => {
	try {
		const result = await imagekit.upload({
			file: base64Img,      // Can be base64 or buffer
			fileName: imgName,    // Required
			tags: ["tag1", "tag2"]
		});
		console.log(result);
		return result;
	} catch (error) {
		console.error(error);
		throw error;
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
				name: user.firstName + " " + user.lastName,
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

export const updateCustomer = async (req, res) => {
	try {
		const { email, firstName, lastName, phoneNumber } = req.body;
		console.log("updateCustomer", req.body)
		const updatedCustomer = await User.findOneAndUpdate(
			{ email }, // filter
			{ firstName, lastName, phoneNumber }, // update fields
			{ new: true, runValidators: true } // return updated doc, validate fields
		);

		if (!updatedCustomer) {
			return res.status(404).json({ message: "Customer not found with this email" });
		}

		res.status(200).json({ message: "Customer updated", data: updatedCustomer });
	} catch (error) {
		console.error("Error updating customer:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};
export const getProfile = async (req, res) => {
	try {
		res.json(req.user);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};