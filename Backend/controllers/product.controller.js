import Item from "../models/item.model.js";
import { imagekit } from "../lib/imageKit.js";
import mongoose from "mongoose";

export const setDiscount = async (req, res) => {
  try {
    const { itemId, discount } = req.body;
    const item = await Item.findByIdAndUpdate(itemId, { discount }, { new: true });
    if (!item) return res.status(404).json({ message: "Item not found" });
res.status(200).json({ message: "Discount updated" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update discount" });
  }
};

export const createProduct = async (req, res) => {
	try {
		 // Extract the product data from the request
		const { category, productName, weight, quantity, pricePerUnit, description, brand, packagingType, packageWidth, packageHeight, aisleNumber, rowNumber, side, reservedRowId, partner } = req.body;
		// Ensure the image is available
		if (!req.file) {
			return res.status(400).json({ message: 'Image is required.' });
	 	}
	 	// Convert the image file to base64
	 	const base64Img = req.file.buffer.toString('base64');
	 	const imgName = req.file.originalname; // Use a timestamp to ensure unique filenames
	 	// Upload image to ImageKit
	  	const uploadResult = await UploadImage(base64Img, imgName);
 
	 	// Get the URL of the uploaded image
	 	const imageUrl = uploadResult.url;
  
		// Create a new product document
		const newProduct = new Item({
			category,
			productName,
			weight,
			quantity,
			pricePerUnit,
	 		description,
			brand,
			// storageCondition,
			packagingType,
	 		packageWidth,
			packageHeight,
			imageProduct: imageUrl,
			// Add location fields if provided
			aisleNumber,
			rowNumber,
			side,
			reservedRowId,
			partner: partner ? new mongoose.Types.ObjectId(partner) :  new mongoose.Types.ObjectId(req.user?._id),
		});

		// Save the product to the database
		await newProduct.save();

		// Return success response
		return res.status(201).json({ message: 'Product created successfully!', product: newProduct });
	} catch (error) {
		console.error('Error creating product:', error);
		return res.status(500).json({ message: 'Failed to create product. Please try again.' });
	}
};

const UploadImage = async (base64Img, imgName) => {
	try {
		const result = await imagekit.upload({
			file: base64Img,      // Can be base64 or buffer
			fileName: imgName,    // Required
			tags: ["tag1", "tag2"]
		});
		return result;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

// Public route: Get all active items for customers
export const getActiveItems = async (req, res) => {
	try {
		const items = await Item.find({ isActive: true })
      .populate({
        path: 'partner',
        select: 'firstName lastName email partner.companyName',
      });
		res.json(items);
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

export const getOnSaleItems = async (req, res) => {
	try {
		const { cartItemIds, limit = 4 } = req.body; // Receive cart item IDs and limit from the frontend

		// Fetch items that are active, on sale, and not in the cart
		const onSaleItems = await Item.find({
			isActive: true,
			discount: { $gt: 0 }, // Items with a discount greater than 0
			_id: { $nin: cartItemIds }, // Exclude items already in the cart
		})
			.limit(parseInt(limit)) // Limit the number of items returned
			.exec();

		res.status(200).json(onSaleItems);
	} catch (error) {
		console.error("Error fetching on-sale items:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getProductById = async (req, res) => {
	try {
		const { productId } = req.params;

		const isValidObjectId = (id) =>
			mongoose.Types.ObjectId.isValid(id)

		if (!isValidObjectId(productId)) {
			return res.status(400).json({ message: 'Invalid product ID' });
		}

		const item = await Item.findById(productId);

		if (!item) {
			return res.status(404).json({ message: 'Product not found' });
		}

		res.status(200).json({
			_id: item._id,
			name: item.productName,
			price: item.pricePerUnit,
			description: item.description,
			image: item.imageProduct,
			discount: item.discount,
			category: item.category
		});
	} catch (error) {
		console.error("Error fetching product:", error);
		res.status(500).json({ message: 'Server error' });
	}
};

export const getItemsByCategory = async (req, res) => {
	try {
		const { category } = req.params;

		const items = await Item.find({ category, isActive: true });

		if (items.length === 0) {
			return res.status(404).json({ message: 'No items found in this category' });
		}

		res.status(200).json(items);
	} catch (error) {
		console.error('Error fetching items by category:', error);
		res.status(500).json({ message: 'Server error' });
	}
};

export const getRelatedItems = async (req, res) => {
    try {
        const { category, itemId } = req.body.params;

        // Check if category is provided
        if (!category) {
            return res.status(400).json({
                success: false,
                message: 'Category is required',
            });
        }

        // Build the query
        const query = {
            category,
            isActive: true, // Ensure the item is active
            quantity: { $gt: 0 }, // Ensure the quantity is greater than 0
        };

        // Exclude the current item from the results
        if (itemId) {
            if (!mongoose.Types.ObjectId.isValid(itemId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid product ID',
                });
            }
            query._id = { $ne: new mongoose.Types.ObjectId(itemId) };
        }

        // Fetch related items
        const relatedItems = await Item.find(query).limit(4);

        return res.status(200).json({
            success: true,
            count: relatedItems.length,
            items: relatedItems,
        });
    } catch (error) {
        console.error('Error fetching related items:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

export const searchProducts = async (req, res) => {
	try {
		const { q } = req.query;

		if (!q) {
			return res.status(400).json({ message: 'Search query is required' });
		}

		// Escape special characters to prevent RegExp errors
		const escapeRegExp = (string) =>
			string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

		const safeQuery = escapeRegExp(q);
		const searchRegex = new RegExp(safeQuery, 'i');

		const products = await Item.find({
			productName: searchRegex,
			isActive: true
		}).select('_id productName pricePerUnit imageProduct');

		res.status(200).json(products);
	} catch (error) {
		console.error('Error searching products:', error);
		res.status(500).json({ message: 'Server error' });
	}
};
