import Item from "../models/item.model.js";
export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        const item = await Item.findById(productId);
        if (!item || !item.isActive) {
            return res.status(404).json({ message: 'Item not available' });
        }
        const existingItem = user.cartItems.find((item) => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cartItems.push(productId);
        }

        await user.save();
        res.json({ cartItems: user.cartItems, item });
    } catch (error) {
        console.log("Error in addToCart controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};