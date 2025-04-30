import User from "../models/user.model.js";
import {imagekit} from "../lib/imageKit.js"; // Ensure correct path to imagekit instance

const UploadImage = async (base64Img, imgName) => {
	try {
		const result = await imagekit.upload({
			file: base64Img,
			fileName: imgName,
			tags: ["profile", "customer"]
		});
		return result;
	} catch (error) {
		console.error("ImageKit Upload Error:", error);
		throw error;
	}
};

export const updateCustomer = async (req, res) => {
	try {
		const { email, firstName, lastName, phoneNumber } = req.body;
		const file = req.file;

		const updateFields = {
			firstName,
			lastName,
			phoneNumber
		};

		// If image is provided, upload to ImageKit
		if (file) {
			const base64Img = file.buffer.toString("base64");
			const imgName =file.originalname;
			const uploadResult = await UploadImage(base64Img, imgName);
			updateFields.profileImage = uploadResult.url;
		}

		const updatedCustomer = await User.findOneAndUpdate(
			{ email },
			updateFields,
			{ new: true, runValidators: true }
		);

		if (!updatedCustomer) {
			return res.status(404).json({ message: "Customer not found with this email" });
		}

		res.status(200).json({ message: "Customer updated", data: updatedCustomer });
	} catch (error) {
		console.error("Error updating customer:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const addToWishlist = async (req, res) => {
	const { itemId } = req.body;
  
	try {
	  const user = await User.findById(req.user._id);
	  if (!user) return res.status(404).json({ message: "User not found" });
  
	  // Prevent duplicates
	  if (!user.wishlist.includes(itemId)) {
		user.wishlist.push(itemId);
		await user.save();
	  }
  
	  res.status(200).json({ message: "Item added to wishlist" });
	} catch (error) {
	  res.status(500).json({ message: "Error adding to wishlist", error: error.message });
	}
  };
  
  export const getWishlist = async (req, res) => {
	try {
	  const user = await User.findById(req.user._id).populate("wishlist");
	  if (!user) return res.status(404).json({ message: "User not found" });
  
	  res.status(200).json(user.wishlist);
	} catch (error) {
	  res.status(500).json({ message: "Error fetching wishlist", error: error.message });
	}
  };