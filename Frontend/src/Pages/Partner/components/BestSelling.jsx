import { useState } from 'react';
import { EllipsisVertical } from 'lucide-react';

const BestSelling = () => {
  const [dateRange] = useState('Dec 20 - Dec 31');
  
  // Mock product data
  const products = [
    {
      id: 1,
      name: 'The Chronos',
      image: '/product-1.jpg',
      stock: 100,
      sales: 1234,
      price: '$199.99'
    },
    {
      id: 2,
      name: 'Power Bank',
      image: '/product-2.jpg',
      stock: 2,
      sales: 500,
      price: '$39.99'
    },
    {
      id: 3,
      name: 'Denim Drawstring Pants',
      image: '/product-3.jpg',
      stock: 110,
      sales: 789,
      price: '$29.99'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Best Selling</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{dateRange}</span>
            <button className="text-gray-400 hover:text-gray-600">
              <EllipsisVertical size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-12 text-sm text-gray-500 mb-4">
          <div className="col-span-5">Product name</div>
          <div className="col-span-2 text-center">Stock</div>
          <div className="col-span-2 text-center">Sales</div>
          <div className="col-span-2 text-center">Price</div>
          <div className="col-span-1"></div>
        </div>
        
        <div className="space-y-4">
          {products.map(product => (
            <div key={product.id} className="grid grid-cols-12 items-center text-sm">
              <div className="col-span-5 flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-8 h-8 object-cover rounded"
                  />
                </div>
                <span className="font-medium text-gray-700">{product.name}</span>
              </div>
              <div className={`col-span-2 text-center ${product.stock <= 5 ? 'text-pink-500' : 'text-gray-700'}`}>
                {product.stock}
              </div>
              <div className="col-span-2 text-center text-gray-700">{product.sales}</div>
              <div className="col-span-2 text-center text-gray-700">{product.price}</div>
              <div className="col-span-1 flex justify-end">
                <button className="text-gray-400 hover:text-gray-600">
                  <EllipsisVertical size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestSelling; 