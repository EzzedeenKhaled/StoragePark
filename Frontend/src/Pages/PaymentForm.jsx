import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from "react-hot-toast";
import { Loader } from "lucide-react";
import { useUserStore } from '../stores/useUserStore';
const PaymentForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    ccv: ''
  });
  const { loading } = useUserStore();
  // Get the state passed from the Cart page
  const location = useLocation();
  const { cartItems = [], subtotal = 0, total = 0 } = location.state || {};

  // Calculate discount if needed
  const discount = 0;
  const finalTotal = parseFloat(total) - discount;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.ccv) {
      toast.error('Please fill in all payment details');
      return;
    }

    try {
      // Get user's location (you'll need proper geolocation implementation)
      let userLocation = {};
      if (navigator.geolocation) {
        userLocation = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }),
            (error) => reject(error)
          );
        });
      }

      // Prepare order data
      const orderData = {
        paymentDetails: formData,
        orderSummary: {
          items: cartItems.map(item => ({
            productId: item._id || item.id,
            name: item.name || item.productName,
            price: item.price || item.pricePerUnit,
            quantity: item.quantity,
            image: item.image || item.imageProduct
          })),
          subtotal: parseFloat(subtotal),
          shipping: 3.00,
          discount,
          total: finalTotal
        },
        userLocation,
        timestamp: new Date().toISOString()
      };

      // Send to backend
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // if using auth
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      const result = await response.json();
      navigate('/order-confirmation', { state: { orderId: result.orderId } });
    } catch (err) { 
      console.error('Order submission error:', err);
      toast.error(err.message || 'Failed to process payment. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-8">
          <button
            className="text-gray-600 hover:text-gray-800 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1 flex justify-center pr-8">
            <div className="flex items-center gap-4">
              <div className="text-orange-500">Cart</div>
              <div className="h-[2px] w-32 bg-orange-500"></div>
              <div className="text-orange-500 font-semibold">Payment</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Form Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-6">Payment</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Name on card:</label>
                  <input
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="Esther Howard"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Card number:</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Expiry date:</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">CCV:</label>
                    <input
                      type="text"
                      name="ccv"
                      value={formData.ccv}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                      placeholder="***"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-6">Order summary</h2>
              <div className="space-y-4">
                {cartItems.map((product, index) => (
                  <div key={index} className="flex items-center gap-4">
                    {product.image ? (
                      <img src={product.image} alt={product.name || 'Product'} className="w-16 h-16 rounded object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded bg-gray-200 flex items-center justify-center">
                        <span>No Image</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium">{product.name || 'Unnamed Product'}</h3>
                      <p className="text-sm text-gray-500">{product.category || 'No category'}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${(product.price || 0).toFixed(2)}</div>
                      <div className="flex items-center gap-2">
                        <span>Qty: {product.quantity || 1}</span>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Product total</span>
                    <span className="font-medium">${parseFloat(subtotal || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">$3.00</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Discount</span>
                      <span className="text-red-500">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-4 text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-orange-500">${(finalTotal || 0).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 cursor-pointer"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
                      Loading...
                    </>
                  ) : (
                    <>

                      Place Order
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;