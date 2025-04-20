import React from 'react';

export function WishlistItem() {
  // This would typically come from your backend
  const wishlistItems = [
    {
      id: '1',
      name: 'Wireless Earbuds',
      price: 199.99,
      inStock: true
    },
    {
      id: '2',
      name: 'Smart Speaker',
      price: 299.99,
      inStock: false
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wishlistItems.map((item) => (
        <div key={item.id} className="border border-orange-200 rounded-lg p-6 flex flex-col justify-between">
          <div>
            <div className="w-full h-48 bg-gray-100 rounded-lg mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
            <p className="text-gray-600 mb-4">${item.price.toFixed(2)}</p>
            <p className={`text-sm ${item.inStock ? 'text-green-600' : 'text-red-600'}`}>
              {item.inStock ? 'In Stock' : 'Out of Stock'}
            </p>
          </div>
          <div className="mt-4 space-y-2">
            <button className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition-colors">
              Add to Cart
            </button>
            <button className="w-full border border-red-500 text-red-500 py-2 px-4 rounded hover:bg-red-50 transition-colors">
              Remove from Wishlist
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}