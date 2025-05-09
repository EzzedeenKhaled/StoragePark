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
		// Location fields
		aisleNumber: {
			type: Number,
			required: false,
		},
		rowNumber: {
			type: Number,
			required: false,
		},
		side: {
			type: String,
			required: false,
		},
		reservedRowId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Warehouse.rows",
			required: false,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		discount: {
			type: Number,
			default: 0,
		},
		timesBought: {
			type: Number,
			default: 0,
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