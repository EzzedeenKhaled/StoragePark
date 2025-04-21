import User from "../models/user.model.js";

export const updateCustomer = async (req, res) => {
	try {
		const { email, firstName, lastName, phoneNumber } = req.body;
		console.log("updateCustomer", req.body)
		const updatedCustomer = await User.findOneAndUpdate(
			{ email }, // filter
			{ firstName, lastName, phoneNumber }, // update fields
			{ new: true, runValidators: true } // return updated doc, validate fields
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