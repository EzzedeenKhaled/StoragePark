import React, { useEffect, useState } from 'react';
import axios from '../../../../../lib/axios';
import './spinner.css'; // Import the spinner CSS

const TopSellingStock = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHighestSellingProducts = async () => {
      try {
        const response = await axios.get('/admins/highestSelling');
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching highest-selling products:', err);
        setError('Failed to fetch highest-selling products');
      } finally {
        setLoading(false);
      }
    };

    fetchHighestSellingProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Top Selling Stock</h2>
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
                    <img
                      src={product.imageProduct}
                      alt={product.productName}
                      className="w-8 h-8 rounded-lg bg-gray-100 mr-3"
                    />
                    <span className="text-sm text-gray-800">{product.productName}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">{product.timesBought}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{product.quantity}</td>
                <td className="py-3 px-4 text-sm text-gray-600">${product.pricePerUnit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopSellingStock;