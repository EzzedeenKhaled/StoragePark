import Item from "../models/item.model.js";

export const createProduct = async (req, res) => {
	try {
		// Extract the product data from the request
		const { category, productName, weight, quantity, pricePerUnit, description, brand, storageCondition, packagingType, packageWidth, packageHeight } = req.body;

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
			storageCondition,
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