import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";
import Item from "../models/item.model.js";
import sendVerificationEmail from "../lib/mail.js";
import crypto from "crypto";
import multer from "multer";
import { imagekit } from "../lib/imageKit.js";
import mongoose from "mongoose";

export const getPartnerProfile = async (req, res) => {
    try {
        const email = req.query.email || req.user.email;
        console.log(req.query.email)
        const partner = await User.findOne({ email, role: "partner" });
        res.status(200).json(partner);
    } catch (error) {
        console.error("Error fetching partner profile:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getMonthlySalesAndPurchases = async (req, res) => {
  try {
    const partnerId = new mongoose.Types.ObjectId(req.query.partnerId || req.user._id);
 // Ensure authentication middleware sets req.user
    const monthlyData = [];

    for (let month = 1; month <= 12; month++) {
      const startOfMonth = new Date(2025, month - 1, 1);
      const endOfMonth = new Date(2025, month, 0);

      // Sales: from orders of the partner
      const salesData = await User.aggregate([
        { $match: { _id: partnerId } },
        { $unwind: "$orders" },
        {
          $match: {
            "orders.orderDate": { $gte: startOfMonth, $lte: endOfMonth }
          }
        },
        {
          $group: {
            _id: null,
            totalSales: { $sum: "$orders.totalAmount" }
          }//680f8e0d1ffc35b4d134c82f
        }
      ]);

      // Purchases: items created by the partner within the month
      const purchaseData = await Item.aggregate([
        {
          $match: {
            partner: partnerId, // assumes `Item` has a `partner` field (ObjectId)
            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
          }
        },
        {
          $group: {
            _id: null,
            totalPurchases: { $sum: "$timesBought" }
          }
        }
      ]);

      monthlyData.push({
        name: startOfMonth.toLocaleString("default", { month: "short" }),
        Purchase: purchaseData[0]?.totalPurchases || 0,
        Sales: salesData[0]?.totalSales || 0
      });
    }

    return res.status(200).json({ data: monthlyData });
  } catch (error) {
    console.error("Error fetching monthly sales and purchases:", error);
    return res.status(500).json({ error: "An error occurred while fetching monthly data." });
  }
};
  

export const getStats = async (req, res) => {
    try {
      const partnerId = req.query.partnerId || req.user._id;
      const objectId = new mongoose.Types.ObjectId(partnerId);
  
      const result = await User.aggregate([
        { $unwind: "$orders" },
        { $unwind: "$orders.items" },
        {
          $lookup: {
            from: "items",
            localField: "orders.items.item",
            foreignField: "_id",
            as: "itemDetails",
          },
        },
        { $unwind: "$itemDetails" },
        {
          $match: {
            "itemDetails.partner": objectId,
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: {
                $multiply: ["$orders.items.quantity", "$orders.items.price"],
              },
            },
            totalCost: {
              $sum: {
                $multiply: [
                  "$orders.items.quantity",
                  { $multiply: ["$orders.items.price", 0.7] }, // 70% cost of the item price
                ],
              },
            },
            totalProfit: {
              $sum: {
                $subtract: [
                  {
                    $multiply: ["$orders.items.quantity", "$orders.items.price"], // Revenue
                  },
                  {
                    $multiply: [
                      "$orders.items.quantity",
                      { $multiply: ["$orders.items.price", 0.7] }, // Cost
                    ],
                  },
                ],
              },
            },
            totalSales: {
              $sum: "$orders.items.quantity",
            },
          },
        },
      ]);
  
      const stats = result[0] || { totalRevenue: 0, totalCost: 0, totalProfit: 0, totalSales: 0 };
      res.status(200).json(stats);
    } catch (error) {
      console.error("Error fetching partner stats:", error);
      res.status(500).json({ message: "Failed to fetch stats", error: error.message });
    }
  };
  


// Function to get top selling categories for a specific partner
export const getTopSellingCategoriesByPartner = async (req, res) => {
    try {
        const partnerId = new mongoose.Types.ObjectId(req.query.partnerId || req.user._id);
      const topCategories = await Item.aggregate([
        // Match items belonging to the specified partner
        { $match: { partner: new mongoose.Types.ObjectId(partnerId) } },
        
        // Group items by category and sum up their timesBought
        { $group: {
            _id: "$category",
            totalTimesBought: { $sum: "$timesBought" },
            itemsCount: { $sum: 1 },
            // Optional: get the top selling item in each category
            topSellingItem: { $max: { 
              productName: "$productName", 
              timesBought: "$timesBought" 
            }}
        }},
        
        // Sort by totalTimesBought in descending order
        { $sort: { totalTimesBought: -1 } },
        
        // Rename _id to category for clarity
        { $project: {
            category: "$_id",
            totalTimesBought: 1,
            itemsCount: 1,
            topSellingItem: 1,
            _id: 0
        }}
      ]);
      
      res.status(200).json(topCategories)
    } catch (error) {
        console.error("Error fetching partner top categories:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  }

// Function to get top selling items for a specific partner
export const getTopSellingItemsByPartner = async (req, res) => {
    try {
        const limit = 3;
        const partnerId  = new mongoose.Types.ObjectId(req.query.partnerId || req.user._id);
      // Query items with the specified partner ID
      const topItems = await Item.find({ 
        partner: partnerId, 
        timesBought: { $gt: 0 } // Exclude items with 0 purchases
    })
    .sort({ timesBought: -1 })
    .limit(limit)
    .select('productName imageProduct pricePerUnit timesBought category quantity');
      
      res.status(200).json(topItems)
    } catch (error) {
        console.error("Error fetching partner top items:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  }

export const changeIsActive = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ success: false, message: "Product ID is required" });
        }

        // Find the item in the database
        const item = await Item.findById(productId);

        if (!item) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Toggle the isActive status
        item.isActive = !item.isActive;

        // Save the updated item
        await item.save();

        return res.status(200).json({
            success: true,
            message: `Product ${item.isActive ? 'activated' : 'deactivated'} successfully`,
            isActive: item.isActive
        });

    } catch (error) {
        console.error("Error toggling product status:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update product status",
            error: error.message
        });
    }
};

export const getPartnerOrders = async (req, res) => {
    try {
        // Check if user is a partner
        if (req.user.role !== 'partner' && req.user.role !== "admin") {
            return res.status(403).json({ message: 'Access denied. Partner role required.' });
        }
        
        const partnerId = new mongoose.Types.ObjectId(req.query.partnerId || req.user._id);

        // Find all items belonging to this partner
        const partnerItems = await Item.find({ partner: partnerId }).select('_id');
        // Extract just the item IDs into an array
        const partnerItemIds = partnerItems.map(item => item._id);
        
        // Find all users who have orders containing any of these items
        const users = await User.find({
            'orders.items.item': { $in: partnerItemIds }
        }).select('firstName lastName email orders');
        
        console.log("items: ",users)
        // Process users to extract only relevant orders 
        const relevantOrders = [];

        for (const user of users) {
            // For each user, filter their orders to include only those with partner's items
            for (const order of user.orders) {
                // Check if this order contains any of the partner's items
                const relevantItems = order.items.filter(item =>
                    partnerItemIds.some(partnerItem =>
                        partnerItem.equals(item.item)
                    )
                );

                if (relevantItems.length > 0) {
                    // Clone the order
                    const orderData = order.toObject();

                    // Replace the items array with only relevant items
                    orderData.items = relevantItems;

                    // Recalculate the total (only for partner's items)
                    orderData.totalAmount = relevantItems.reduce(
                        (sum, item) => sum + (item.price * item.quantity), 0
                    );

                    // Add user information
                    orderData.user = {
                        id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email
                    };

                    relevantOrders.push(orderData);
                }
            }
        }

        // Sort orders by date (newest first)
        relevantOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

        res.json(relevantOrders);
    } catch (error) {
        console.error('Error fetching partner orders:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getPartnerItems = async (req, res) => {
    try {
        const partnerId = new mongoose.Types.ObjectId(req.query.partnerId || req.user._id);

        const items = await Item.find({ partner: partnerId }).sort({ createdAt: -1 });

        res.json(items);
    } catch (err) {
        console.error("Failed to fetch partner items:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updatePartner = async (req, res) => {
    try {
        const { email } = req.body;
        const file = req.file;
        const updateFields = {};
        // If image is provided, upload to ImageKit
        if (file) {
            const base64Img = file.buffer.toString("base64");
            const imgName = file.originalname;
            const uploadResult = await UploadImage(base64Img, imgName);
            updateFields.profileImage = uploadResult.url;
        }

        const updatedPartner = await User.findOneAndUpdate(
            { email },
            updateFields,
            { new: true, runValidators: true }
        );

        if (!updatedPartner) {
            return res.status(404).json({ message: "Partner not found with this email" });
        }

        res.status(200).json({ message: "Partner updated", data: updatedPartner });
    } catch (error) {
        console.error("Error updating Partner:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const signup_Partner = async (req, res) => {
    const { firstName, lastName, email, phoneNumber, address, websiteURL, companyName, companyEmail } = req.body;
    try {
        const userExists = await User.findOne({
            $or: [{ email }, { phoneNumber }]
        });
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
            role: "partner",
            partner: {
                companyName,
                companyEmail,
                address,
                phoneNumber,
                websiteURL,
            },
            phoneNumber,
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

            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ message: "Email is required" });
            }

            const partner = await User.findOne({ email, role: "partner" });

            if (!partner) {
                return res.status(404).json({ message: "Partner not found with provided email" });
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

            await sendVerificationEmail(partner.email, partner.verificationToken, false, false);

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