import Item from "../models/item.model.js";
import { imagekit } from "../lib/imageKit.js";
import mongoose from "mongoose";
export const createProduct = async (req, res) => {
	try {
		// Extract the product data from the request
		const { category, productName, weight, quantity, pricePerUnit, description, brand, packagingType, packageWidth, packageHeight } = req.body;

		// Ensure the image is available
		if (!req.file) {
			return res.status(400).json({ message: 'Image is required.' });
		}

		// Convert the image file to base64
		const base64Img = req.file.buffer.toString('base64');
		const imgName = req.file.originalname; // Use a timestamp to ensure unique filenames
		//   console.log("Image name:", imgName);
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
			// partner: "1841471"
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
		console.log(result);
		return result;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

// Public route: Get all active items for customers
export const getActiveItems = async (req, res) => {
	try {
		const items = await Item.find({ isActive: true }).populate('partner', 'name');
		res.json(items);
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
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
			name: item.productName,
			price: item.pricePerUnit,
			description: item.description,
			image: item.imageProduct,
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
		console.log(req.body)
	  if (!category) {
		return res.status(400).json({
		  success: false,
		  message: 'Category is required'
		});
	  }
	  const query = { category };
	  if (itemId) {
		if (!mongoose.Types.ObjectId.isValid(itemId)) {
		  return res.status(400).json({
			success: false,
			message: 'Invalid product ID1'
		  });
		}
		query._id = { $ne: new mongoose.Types.ObjectId(itemId) };
	  }
	  const relatedItems = await Item.find(query).limit(4);
  
	  return res.status(200).json({
		success: true,
		count: relatedItems.length,
		items: relatedItems
	  });
  
	} catch (error) {
	  console.error('Error fetching related items:', error);
	  res.status(500).json({
		success: false,
		message: 'Server error'
	  });
	}
  };