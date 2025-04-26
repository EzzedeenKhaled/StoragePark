import User from "../models/user.model.js";

// Add an item to the user's wishlist
export const addToWishlist = async (req, res) => {
    console.log("Adding to wishlist:", req.body);
  const { itemId } = req.body;
  const userId = req.user._id; // assuming you get the user from auth middleware

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if product already in wishlist
    if (user.wishlist.includes(itemId)) {
      return res.status(400).json({ message: "Item already in wishlist" });
    }

    user.wishlist.push(itemId);
    await user.save();

    res.status(200).json({ message: "Item added to wishlist", wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Remove an item from the user's wishlist
export const removeFromWishlist = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user._id;
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Convert both IDs to string for consistent comparison
      const initialLength = user.wishlist.length;
      user.wishlist = user.wishlist.filter(id => id.toString() !== productId.toString());
      // console.log("Removing from wishlist:", productId, user.wishlist);
      // Check if item was actually removed
      if (user.wishlist.length === initialLength) {
        return res.status(400).json({ message: "Item not found in wishlist" });
      }
  
      await user.save();
  
      res.status(200).json({ 
        message: "Item removed from wishlist", 
        wishlist: user.wishlist 
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

// Get the user's wishlist (populated with item details)
export const getWishlist = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId).populate('wishlist');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
