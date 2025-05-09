import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from '../lib/axios';
import { useUserStore } from '../src/stores/useUserStore';
const TrackOrder = () => {
  const [showInput, setShowInput] = useState(false); // State to toggle input form
  const [orderId, setOrderId] = useState(''); // State to store the entered order ID
  const navigate = useNavigate();
  const {user} = useUserStore();
  const handleTrackOrder = async () => {
    if (!orderId.trim()) {
      toast.error("Please enter a valid Order ID");
      return;
    }
  
    try {
      const userId = user?._id || ""; 
      const response = await axios.get(`/orders/orderIdCheck/${orderId}`, {
        params: { userId },
      });
  
      if (response.data.message === "Order has already been delivered") {
        toast.success("Order has already been delivered");
      } else if (response.data.exists) {
        navigate(`/order-status/${orderId}`);
      } else {
        toast.error("Order ID does not exist");
      }
    } catch (error) {
      if (error.response.status === 404) {
        toast.error("Order ID does not exist");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="relative mt-5">
      <img
        src="/hero-image.png"
        alt="Order Tracking Hero Image"
        className="w-full"
      />
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center bg-black/50">
        <h1 className="text-4xl font-bold mb-2">Order Tracking Made Simple</h1>
        <p className="text-xl mb-5">Real-Time Updates at Your Fingertips</p>
        {!showInput ? (
          <button
            onClick={() => setShowInput(true)} // Show the input form when clicked
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded cursor-pointer"
          >
            Track Your Order
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter Order ID"
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleTrackOrder}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 cursor-pointer"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;