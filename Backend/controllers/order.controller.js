import Item from '../models/item.model.js'; 
import User from '../models/user.model.js'; // Adjust path if needed
import base62 from 'base62';
import { v4 as uuidv4 } from "uuid";
export const newOrder = async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      deliveryAddress,
      userLocation,
      mapLink = null,
      shippingDate = null,
      deliveryDate = null,
      status = 'pending',
    } = req.body;

    // Find the user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item.' });
    }

    // Format items
    const formattedItems = items.map(item => ({
      item: item._id,
      quantity: item.quantity,
      price: item.price,
      name: item.name,
    }));

    // Generate orderId explicitly 
    const uuid = uuidv4().replace(/-/g, '');
    const orderId = uuid;
    // Create a new order object
    const newOrder = {
      orderId,  // Set the orderId explicitly
      items: formattedItems,
      totalAmount,
      deliveryAddress,
      userLocation, // Save user's location
      deliveryGuyLocation: {
        latitude: userLocation.latitude + 0.05, // Example: Place delivery guy close to the user
        longitude: userLocation.longitude + 0.05,
      },
      mapLink,
      shippingDate,
      deliveryDate,
      status,
    };

    // Push the new order into the user's orders array
    user.orders.push(newOrder);

    // Clear the user's cart
    user.cartItems = [];

    // Save the user
    await user.save();

    // Increment timesBought for each purchased item
    for (const item of items) {
      await Item.findByIdAndUpdate(item._id, {
        $inc: {
          quantity: -item.quantity, // Subtract purchased quantity
          timesBought: item.quantity, // Increment purchase counter
        },
      });
    }

    // Return the response with the generated orderId
    const createdOrder = user.orders[user.orders.length - 1]; // Access the last pushed order
    res.status(201).json({
      message: 'Order placed successfully',
      order: createdOrder,
      orderId: createdOrder.orderId,
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Failed to place order', error: error.message });
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

export const checkOrderIdExists = async (req, res) => {
  const { orderId } = req.params;
  const { userId } = req.query;

  try {
    let order = null;

    // If userId is provided
    if (userId) {
      const user = await User.findById(userId).populate("orders.items.item", "name price");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      order = user.orders.find((o) => o.orderId === orderId);

      if (!order) {
        return res.status(404).json({ message: "Order ID does not exist" });
      }

      if (order.status === "delivered") {
        return res.status(200).json({ message: "Order has already been delivered" });
      }

      return res.status(200).json({ exists: true });
    }

    // If no userId is provided (guest)
    const userWithOrder = await User.findOne(
      { "orders.orderId": orderId },
      { "orders.$": 1 }
    );

    if (!userWithOrder || !userWithOrder.orders.length) {
      return res.status(404).json({ message: "Order ID does not exist" });
    }

    const [foundOrder] = userWithOrder.orders;

    // Prevent guest from knowing if the delivered order exists
    if (foundOrder.status === "delivered") {
      return res.status(404).json({ message: "Order ID does not exist" });
    }

    return res.status(200).json({ exists: true });
  } catch (error) {
    console.error("Error checking order ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getOrderStatus = async (req, res) => {
  const { orderId } = req.params;

  try {
    const user = await User.findOne({ 'orders.orderId': orderId })
      .populate('orders.items.item', 'name imageProduct price discount') // populate specific fields
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = user.orders.find(order => order.orderId === orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found in user' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const updateDeliveryGuyLocation = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find user with the specific order
    const user = await User.findOne({ "orders.orderId": orderId }, { "orders.$": 1 });

    if (!user || !user.orders || user.orders.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = user.orders[0];

    const { latitude, longitude } = order.deliveryGuyLocation;
    const { latitude: userLat, longitude: userLng } = order.userLocation;

    const MOVE_FACTOR =  0.005;
    const newLatitude = latitude + (userLat - latitude) * MOVE_FACTOR;
    const newLongitude = longitude + (userLng - longitude) * MOVE_FACTOR;

    // Use updateOne to modify the nested array directly
    await User.updateOne(
      { "orders.orderId": orderId },
      {
        $set: {
          "orders.$.deliveryGuyLocation": {
            latitude: newLatitude,
            longitude: newLongitude,
          },
        },
      }
    );

    res.status(200).json({
      message: "Delivery guy location updated",
      data: {
        deliveryGuyLocation: { latitude: newLatitude, longitude: newLongitude },
      },
    });
  } catch (error) {
    console.error("Error updating delivery guy location:", error);
    res.status(500).json({ message: "Failed to update delivery guy location", error: error.message });
  }
};

export const markOrderAsDelivered = async (req, res) => {
  const { orderId } = req.params;

  try {
    // Find the user with the specified orderId
    const user = await User.findOne({ "orders.orderId": orderId });
    if (!user) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Find the specific order and update its status
    const order = user.orders.find(order => order.orderId === orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found in user's orders" });
    }

    order.status = "delivered"; // Update the status to "delivered"
    await user.save(); // Save the updated user document

    res.status(200).json({ message: "Order marked as delivered", order });
  } catch (error) {
    console.error("Error marking order as delivered:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

