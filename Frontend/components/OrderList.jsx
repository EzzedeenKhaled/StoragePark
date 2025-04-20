import React from 'react';

export function OrderList() {
  // This would typically come from your backend
  const orders = [
    {
      id: '1',
      date: '2024-04-15',
      status: 'Delivered',
      total: 299.99,
      items: [
        { name: 'Wireless Headphones', quantity: 1, price: 299.99 }
      ]
    },
    {
      id: '2',
      date: '2024-04-10',
      status: 'In Transit',
      total: 549.98,
      items: [
        { name: 'Smart Watch', quantity: 2, price: 274.99 }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="border border-orange-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">Order #{order.id}</h3>
              <p className="text-gray-600">{order.date}</p>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-sm ${
                order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {order.status}
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center border-t border-gray-100 pt-4">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <p className="font-medium">${item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
            <span className="font-semibold">Total</span>
            <span className="font-semibold">${order.total.toFixed(2)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
