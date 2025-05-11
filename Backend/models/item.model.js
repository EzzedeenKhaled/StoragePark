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

// Add method to handle stock updates and notifications
Item.prototype.updateStock = async function(newQuantity) {
	const previousQuantity = this.quantity;
	this.quantity = newQuantity;

	// If stock reaches zero, deactivate the item
	if (newQuantity === 0 && this.isActive) {
		this.isActive = false;
		
		// If there's a partner, send them a notification
		if (this.partner) {
			try {
				const partner = await mongoose.model('User').findById(this.partner);
				if (partner && partner.email) {
					const emailSubject = "Product Out of Stock";
					const emailMessage = `Dear Partner,\n\nThis email is to inform you that your product "${this.productName}" is now out of stock and has been automatically deactivated.\n\nPlease update the stock quantity to reactivate the product.\n\nBest regards,\nStoragePark Team`;
					
					// Import and use the sendNotificationEmail function
					const { sendNotificationEmail } = await import('../lib/mail.js');
					await sendNotificationEmail(partner.email, emailSubject, emailMessage);
				}
			} catch (error) {
				console.error('Error sending out of stock notification:', error);
			}
		}
	}

	await this.save();
	return this;
};

export default Item;