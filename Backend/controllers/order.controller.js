import Item from '../models/item.model.js'; 
import User from '../models/user.model.js'; // Adjust path if needed
export const newOrder = async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      deliveryAddress,
      mapLink = null,
      shippingDate = null,
      deliveryDate = null,
      status = 'pending',
      name
    } = req.body;
    const userId = req.user.id; // Make sure auth middleware sets req.user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item.' });
    }
    const formattedItems = items.map(item => ({
      item: item._id,
      quantity: item.quantity,
      price: item.price,
      name: item.name
    }));

    const newOrder = {
      orderDate: new Date(),
      timeOfBuy: new Date(),
      items: formattedItems,
      totalAmount,
      deliveryAddress,
      mapLink,
      shippingDate,
      deliveryDate,
      status
    };

    user.orders.push(user.orders.create(newOrder));
    user.cartItems = [];
    await user.save();
    // Increment timesBought for each purchased item
    for (const item of items) {
      // Reduce available quantity by the amount bought
      await Item.findByIdAndUpdate(item._id, {
        $inc: {
          quantity: -item.quantity,       // subtract purchased quantity
          timesBought: item.quantity      // increment purchase counter
        }
      });
    }
    res.status(201).json({
      message: 'Order placed successfully',
      order: newOrder,
      orderId: user.orders[user.orders.length - 1].orderId // Access the last pushed order
    });
  } catch (err) {
    console.error('Error in makeOrder:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


export const getUserOrders = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('orders.items.item'); // if you want item names
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ orders: user.orders });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};