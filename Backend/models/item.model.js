import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
	{
		productName: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		imageProduct: {
			type: String,
			required: true,
		},
		pricePerUnit: {
			type: Number,
			required: true,
		},
		weight: {
			type: Number,
			required: false,
		},
		quantity: {
			type: Number,
			required: false,
		},
		brand: {
			type: String,
			required: false,
		},
		// storageCondition: {
		// 	type: String,
		// 	required: false,
		// },
		packagingType: {
			type: String,
			required: false,
		},
		packageWidth: {
			type: Number,
			required: false,
		},
		packageHeight: {
			type: Number,
			required: false,
		},
		category: {
			type: String,
			required: true,
		},
		partner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: false,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	}
);

const Item = mongoose.model("Item", itemSchema);

export default Item;