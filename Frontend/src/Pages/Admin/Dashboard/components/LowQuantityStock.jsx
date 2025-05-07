import React, { useEffect, useState } from 'react';
import axios from '../../../../../lib/axios';

const LowQuantityStock = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLowQuantityStock = async () => {
      try {
        const response = await axios.get('/admins/lowQuantity');
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching low quantity stock:', err);
        setError('Failed to fetch low quantity stock');
      } finally {
        setLoading(false);
      }
    };

    fetchLowQuantityStock();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="w-8 h-8 border-4 border-[#ff9800] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Low Quantity Stock</h2>
      </div>
      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <img
                  src={product.imageProduct}
                  alt={product.productName}
                  className="w-8 h-8 rounded"
                />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-800">{product.productName}</h3>
                <p className="text-xs text-gray-500">Remaining Quantity: {product.quantity}</p>
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