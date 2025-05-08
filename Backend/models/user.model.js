import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import base62 from 'base62';
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
			enum: ["customer", "admin", "partner", "employee"],
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
		  orders: [
			{
			  orderId: {
				type: String,
				default: () => base62.encode(Buffer.from(uuidv4().replace(/-/g, ''), 'hex')), // Generates a unique order ID for each order
				unique: true, // Ensure each order ID is unique
			  },
			  orderDate: { type: Date, default: Date.now },
			  items: [
				{
				  item: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Item", // Assuming an Item model exists
				  },
				  name: { type: String },
				  quantity: { type: Number, required: true },
				  price: { type: Number, required: true }, // Price of each item
				},
			  ],
			  totalAmount: { type: Number, required: true }, // Total price for the order
			  status: {
				type: String,
				enum: ["pending", "shipped", "delivered", "cancelled"],
				default: "pending",
			  },
			  deliveryAddress: { type: String }, // Address where the order was delivered
			  shippingDate: { type: Date },
			  deliveryDate: { type: Date },
			  timeOfBuy: { type: Date, default: Date.now }, // Time when the order was placed
			  mapLink: { type: String, default: null }, // Link to the delivery map (e.g., Google Maps)
			  userLocation: {
				latitude: { type: Number, required: false }, // Latitude of the user's location
				longitude: { type: Number, required: false }, // Longitude of the user's location
			  },
			  deliveryGuyLocation: {
				latitude: { type: Number, required: false }, // Latitude of the delivery guy's location
				longitude: { type: Number, required: false }, // Longitude of the delivery guy's location
			  },
			},
		  ], 
		resetPasswordCode: {
			type: String,
		},
		resetPasswordExpires: {
			type: Date,
		},
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