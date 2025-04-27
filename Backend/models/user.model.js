import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: [true, "First name is required"],
		},
		lastName: {
			type: String,
			required: [true, "Last name is required"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: function () {
				// Only require password if the role is not "partner"
				return this.role !== "partner";
			},
			minlength: [6, "Password must be at least 6 characters long"],
		},
		role: {
			type: String,
			enum: ["customer", "admin", "partner", "worker"],
			default: "customer",
		},
		partner: {
			companyName: { type: String },
			companyEmail: { type: String },
			phoneNumber: { type: String },
			address: { type: String },
			websiteURL: { type: String },
			certificateFile: { type: String, default: null },
			businessLicenseFile: { type: String, default: null },
			taxComplianceFile: { type: String, default: null },
			profileImage: { type: String, default: null },
		},
		phoneNumber: {
			type: String,
			required: [true, "Phone number is required"],
		},
		profileImage: {
			type: String,
			default: null,
		},
		cartItems: [
			{
			  quantity: {
				type: Number,
				default: 1,
			  },
			  item: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Item",
			  },
			}
		  ],	  
		isVerified: { type: Boolean, default: false },
		verificationToken: { type: String },
		wishlist: [
			{
			  type: mongoose.Schema.Types.ObjectId,
			  ref: "Item"
			}
		  ],		  
	},
	{
		timestamps: true,
	}
);

userSchema.pre("save", function (next) {
	if (this.role === "customer") {
		this.partner = undefined; // Remove partner field for customers
	}
	next();
});
// Pre-save hook to hash password before saving to the database
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error);
	}
});

// Method to compare password
userSchema.methods.comparePassword = async function (password) {
	return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;