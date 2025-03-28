import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    partners: [
        {
            companyName: { type: String },
            companyEmail: { type: String },
            phoneNumber: { type: String },
            address: { type: String },
            websiteURL: { type: String },
            certificateFile: { type: String, default: null },
            businessLicenseFile: { type: String, default: null },
            taxComplianceFile: { type: String, default: null },
            status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
            isVerified: { type: Boolean, default: false },
            profileImage: { type: String, default: null },
        },
    ],
});

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;