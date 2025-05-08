import mongoose from "mongoose";

// Storage costs per square meter
const STORAGE_COSTS = {
	standard: {
		monthly: 10,    // $10 per m² per month
		daily: 0.40     // $0.40 per m² per day (approximately $10/30 days)
	},
	fragile: {
		monthly: 15,    // $15 per m² per month
		daily: 0.60     // $0.60 per m² per day
	},
	temperature: {
		monthly: 20,    // $20 per m² per month
		daily: 0.80     // $0.80 per m² per day
	}
};

const warehouseSchema = new mongoose.Schema(
	{
		aisleNumber: {
			type: Number,
			required: [true, "Aisle number is required"],
			unique: true,
		},
		storageType: {
			type: String,
			enum: ["standard", "fragile", "temperature"],
			required: true,
		},
		costPerSquareMeter: {
			monthly: {
				type: Number,
				required: true,
				default: function() {
					return STORAGE_COSTS[this.storageType].monthly;
				}
			},
			daily: {
				type: Number,
				required: true,
				default: function() {
					return STORAGE_COSTS[this.storageType].daily;
				}
			}
		},
		rows: [
			{
				rowNumber: {
					type: Number,
					required: true,
				},
				side: {
					type: String,
					enum: ["left", "right"],
					required: true,
				},
				dimensions: {
					width: { type: Number, required: true },
					height: { type: Number, required: true },
					depth: { type: Number, required: true },
				},
				isReserved: {
					type: Boolean,
					default: false,
				},
				reservedBy: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					default: null,
				},
				reservationStartDate: {
					type: Date,
					default: null,
				},
				reservationEndDate: {
					type: Date,
					default: null,
				},
				status: {
					type: String,
					enum: ["available", "reserved", "maintenance"],
					default: "available",
				},
				spaceUsage: [{
					date: { type: Date, required: true },
					usedSpace: { type: Number, required: true },
					itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
					action: { type: String, enum: ["add", "remove"] }
				}]
			},
		],
	},
	{
		timestamps: true,
	}
);

// Method to calculate storage cost
warehouseSchema.methods.calculateStorageCost = function(dimensions, startDate, endDate) {
	const areaInSquareMeters = (dimensions.width * dimensions.depth) / 10000; // Convert cm² to m²
	const durationInDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
	
	// Calculate both daily and monthly costs
	const dailyCost = areaInSquareMeters * this.costPerSquareMeter.daily * durationInDays;
	const monthlyCost = areaInSquareMeters * this.costPerSquareMeter.monthly * (durationInDays / 30);
	
	return {
		dailyCost,
		monthlyCost,
		totalCost: Math.min(dailyCost, monthlyCost) // Use the cheaper option
	};
};

const Warehouse = mongoose.model("Warehouse", warehouseSchema);

export default Warehouse; 