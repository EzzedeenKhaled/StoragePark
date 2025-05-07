import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import User from "./user.model.js"; // adjust path if needed

dotenv.config({ path: path.resolve("../../.env") }); // adjust path if .env is outside /backend

// Connect to MongoDB
const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("MongoDB connected");
	} catch (error) {
		console.error("MongoDB connection failed:", error.message);
		process.exit(1);
	}
};

const createPartner = async () => {
	await connectDB();

	try {
		const partner = new User({
			firstName: "Adhan",
			lastName: "Saoudi",
			email: "3ezo.kh@gmail.com",
			password: "partner123", // will be hashed automatically
			phoneNumber: "81543712",
			role: "partner",
			isVerified: false,
			partner: {
				companyName: "Fearless Corp",
				companyEmail: "contact@fearless.com",
				phoneNumber: "81543712",
				address: "Saida, Lebanon",
				websiteURL: "https://fearless.com",
				certificateFile: "https://ik.imagekit.io/e1zxhqymp/cert.jpg?updatedAt=1746563049218",
				businessLicenseFile: "https://ik.imagekit.io/e1zxhqymp/buss.jpg?updatedAt=1746563048902",
				taxComplianceFile: "https://ik.imagekit.io/e1zxhqymp/tax.webp?updatedAt=1746563048836",
				profileImage: "https://ik.imagekit.io/e1zxhqymp/m.jpg?updatedAt=1746563251799",
			},
		});

		await partner.save();
		console.log("Partner user created successfully!");
	} catch (error) {
		console.error("Failed to create partner user:", error.message);
	} finally {
		mongoose.disconnect();
	}
};

createPartner();
