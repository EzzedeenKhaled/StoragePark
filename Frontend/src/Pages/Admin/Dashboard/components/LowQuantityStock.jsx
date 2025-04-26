import React from 'react';

const LowQuantityStock = () => {
  const products = [
    {
      name: 'Tata Salt',
      image: '/images/products/tata-salt.png',
      remainingQuantity: '10 Packet',
    },
    {
      name: 'Takis',
      image: '/images/products/takis.png',
      remainingQuantity: '7 Packet',
    },
    {
      name: 'Lays',
      image: '/images/products/lays.png',
      remainingQuantity: '15 Packet',
    }
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Low Quantity Stock</h2>
        <button className="text-blue-600 hover:text-blue-700 font-medium">See All</button>
      </div>
      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-800">{product.name}</h3>
                <p className="text-xs text-gray-500">Remaining Quantity : {product.remainingQuantity}</p>
              </div>
            </div>
            <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded">Low</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LowQuantityStock; 