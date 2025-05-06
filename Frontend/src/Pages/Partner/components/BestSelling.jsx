import { useState, useEffect } from 'react';
import { EllipsisVertical } from 'lucide-react';
import axios from '../../../../lib/axios';

const BestSelling = () => {
  // const [dateRange] = useState('Dec 20 - Dec 31');
  const [products, setProducts] = useState([]); // Store the fetched products
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch top-selling products on mount
  useEffect(() => {
    const fetchTopSelling = async () => {
      try {
        const response = await axios.get('/partners/topSelling'); // Fetch data from API
        setProducts(response.data); // Set the fetched data to the products state
      } catch (error) {
        console.error('Error fetching top-selling products:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching is done
      }
    };

    fetchTopSelling();
  }, []); // Empty dependency array to fetch only once on component mount
  console.log("oudhaoifa: ",products)
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Best Selling</h2>
          <div className="flex items-center gap-2">
            {/* <span className="text-sm text-gray-500">{dateRange}</span> */}
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
          {loading ? (
            <div>Loading...</div> // Display loading text while fetching data
          ) : (
            products.map(product => (
              <div key={product.id} className="grid grid-cols-12 items-center text-sm">
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <img 
                      src={product.imageProduct} 
                      alt={product.productName}
                      className="w-8 h-8 object-cover rounded"
                    />
                  </div>
                  <span className="font-medium text-gray-700">{product.productName}</span>
                </div>
                <div className={`col-span-2 text-center ${product.quantity <= 5 ? 'text-pink-500' : 'text-gray-700'}`}>
                  {product.quantity}
                </div>
                <div className="col-span-2 text-center text-gray-700">{product.timesBought}</div>
                <div className="col-span-2 text-center text-gray-700">{product.pricePerUnit}</div>
                <div className="col-span-1 flex justify-end">
                  <button className="text-gray-400 hover:text-gray-600">
                    <EllipsisVertical size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BestSelling;
