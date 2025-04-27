import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const PaymentForm = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [ccv, setCcv] = useState('');
  
  // Get the state passed from the Cart page
  const location = useLocation();
  const { cartItems, subtotal, total } = location.state || {
    cartItems: [],
    subtotal: 0,
    total: 0
  };

  // Calculate discount if needed
  const discount = 0; // You can modify this if you want to apply discounts
  const finalTotal = parseFloat(total) - discount;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ... rest of your PaymentForm JSX ... */}
      
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-semibold mb-6">Order summary</h2>
        <div className="space-y-4">
          {cartItems.map((product, index) => (
            <div key={index} className="flex items-center gap-4">
              <img src={product.image} alt={product.name} className="w-16 h-16 rounded object-cover" />
              <div className="flex-1">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.category}</p>
              </div>
              <div className="text-right">
                <div className="font-medium">${product.price.toFixed(2)}</div>
                <div className="flex items-center gap-2">
                  <span>Qty: {product.quantity}</span>
                </div>
              </div>
            </div>
          ))}

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Product total</span>
              <span className="font-medium">${parseFloat(subtotal).toFixed(2)}</span>
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
              <span className="text-orange-500">${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <button className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors">
            Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;