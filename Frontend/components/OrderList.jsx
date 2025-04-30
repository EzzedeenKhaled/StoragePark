import React, { useEffect, useState } from 'react';
import axios from '../lib/axios';
import {LoadingSpinner} from './LoadingSpinner';
export function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('/orders/user-orders');
        setOrders(res.data.orders);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (orders.length === 0) return <p>No orders found.</p>;
  return (
    <div className="space-y-6">
      {orders.map((order, i) => (
        <div key={i} className="border border-orange-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">Order #{i+1}</h3>
              <p className="text-gray-600">{new Date(order.orderDate).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-sm ${
                order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {order.status}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center border-t border-gray-100 pt-4">
                <div>
                  <p className="font-medium">{item.name || 'Item'}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <p className="font-medium">${item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
            <span className="font-semibold">Total</span>
            <span className="font-semibold">${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
