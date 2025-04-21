import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";
import sendVerificationEmail from "../lib/mail.js";
import crypto from "crypto";
import multer from "multer";
import { imagekit } from "../lib/imageKit.js";


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

const upload = multer({ storage: multer.memoryStorage() });
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