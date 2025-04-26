import React from 'react';

const TopSellingStock = () => {
  const products = [
    {
      name: 'Surf Excel',
      soldQuantity: 30,
      remainingQuantity: 12,
      price: '$ 100'
    },
    {
      name: 'Rin',
      soldQuantity: 21,
      remainingQuantity: 15,
      price: '$ 207'
    },
    {
      name: 'Parle G',
      soldQuantity: 19,
      remainingQuantity: 17,
      price: '$ 105'
    }
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Top Selling Stock</h2>
        <button className="text-blue-600 hover:text-blue-700 font-medium">See All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Name</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Sold Quantity</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Remaining Quantity</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index} className="border-b border-gray-100 last:border-0">
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 mr-3"></div>
                    <span className="text-sm text-gray-800">{product.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">{product.soldQuantity}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{product.remainingQuantity}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{product.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopSellingStock; 