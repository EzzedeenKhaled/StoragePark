import { useState } from 'react';
import Sidebar from '../components/Sidebar';

const ProductList = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('Best sellers');
  const [products, setProducts] = useState([
    {
      id: 1,
      image: 'https://via.placeholder.com/40',
      name: 'Watch Nike Series 7',
      brand: 'Apple',
      stock: 100,
      sales: 1234,
      price: 399.00,
      warePrice: 299.00,
      status: true
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/40',
      name: 'iPhone 13 Pro',
      brand: 'Apple',
      stock: 2,
      sales: 500,
      price: 2999.00,
      warePrice: 2499.00,
      status: true
    },
    {
      id: 3,
      image: 'https://via.placeholder.com/40',
      name: 'iPhone 12 Mini',
      brand: 'Apple',
      stock: 110,
      sales: 789,
      price: 2699.00,
      warePrice: 2199.00,
      status: false
    },
    {
      id: 4,
      image: 'https://via.placeholder.com/40',
      name: 'AirPods 3 Generation',
      brand: 'Apple',
      stock: 10,
      sales: 2342,
      price: 179.00,
      warePrice: 129.00,
      status: false
    },
    {
      id: 5,
      image: 'https://via.placeholder.com/40',
      name: 'Galaxy Z Flip 5G',
      brand: 'Samsung',
      stock: 245,
      sales: 90,
      price: 399.00,
      warePrice: 299.00,
      status: true
    },
    {
      id: 6,
      image: 'https://via.placeholder.com/40',
      name: 'Samsung Galaxy A52 5G',
      brand: 'Samsung',
      stock: 100,
      sales: 1234,
      price: 399.99,
      warePrice: 299.99,
      status: false
    },
    {
      id: 7,
      image: 'https://via.placeholder.com/40',
      name: 'MacBook Pro 14"',
      brand: 'Apple',
      stock: 50,
      sales: 890,
      price: 1999.00,
      warePrice: 1699.00,
      status: true
    },
    {
      id: 8,
      image: 'https://via.placeholder.com/40',
      name: 'iPad Pro 12.9"',
      brand: 'Apple',
      stock: 75,
      sales: 567,
      price: 1099.00,
      warePrice: 899.00,
      status: true
    },
    {
      id: 9,
      image: 'https://via.placeholder.com/40',
      name: 'Galaxy S22 Ultra',
      brand: 'Samsung',
      stock: 150,
      sales: 1567,
      price: 1199.00,
      warePrice: 999.00,
      status: true
    },
    {
      id: 10,
      image: 'https://via.placeholder.com/40',
      name: 'Galaxy Buds Pro',
      brand: 'Samsung',
      stock: 200,
      sales: 2100,
      price: 199.00,
      warePrice: 149.00,
      status: false
    },
    {
      id: 11,
      image: 'https://via.placeholder.com/40',
      name: 'Sony WH-1000XM4',
      brand: 'Sony',
      stock: 80,
      sales: 1345,
      price: 349.00,
      warePrice: 279.00,
      status: true
    },
    {
      id: 12,
      image: 'https://via.placeholder.com/40',
      name: 'PlayStation 5',
      brand: 'Sony',
      stock: 25,
      sales: 3456,
      price: 499.00,
      warePrice: 449.00,
      status: true
    },
    {
      id: 13,
      image: 'https://via.placeholder.com/40',
      name: 'Xbox Series X',
      brand: 'Microsoft',
      stock: 30,
      sales: 2789,
      price: 499.00,
      warePrice: 449.00,
      status: false
    },
    {
      id: 14,
      image: 'https://via.placeholder.com/40',
      name: 'Surface Laptop 4',
      brand: 'Microsoft',
      stock: 60,
      sales: 890,
      price: 1299.00,
      warePrice: 1099.00,
      status: true
    },
    {
      id: 15,
      image: 'https://via.placeholder.com/40',
      name: 'Google Pixel 6 Pro',
      brand: 'Google',
      stock: 90,
      sales: 1234,
      price: 899.00,
      warePrice: 799.00,
      status: true
    },
    {
      id: 16,
      image: 'https://via.placeholder.com/40',
      name: 'Nest Hub Max',
      brand: 'Google',
      stock: 120,
      sales: 678,
      price: 229.00,
      warePrice: 179.00,
      status: false
    }
  ]);

  const handleCheckboxChange = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(products.map(product => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1">
        {/* Header */}
        <div className="bg-orange-500 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Product List</h1>
              <p className="text-sm opacity-90">Detailed information about your products</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 px-4 py-2 pl-10 text-gray-900 rounded-lg bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 placeholder-white/70"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <button className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-black/90">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Product
              </button>
              <button className="p-2 rounded-lg hover:bg-white/10 relative">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-white" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                  />
                </svg>
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  2
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs and Table */}
        <div className="p-6">
          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button 
              onClick={() => setSelectedTab('Best sellers')}
              className={`px-4 py-2 rounded-lg ${selectedTab === 'Best sellers' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Best sellers
            </button>
            <button 
              onClick={() => setSelectedTab('All Categories')}
              className={`px-4 py-2 rounded-lg ${selectedTab === 'All Categories' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              All Categories
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-4 px-6 text-left">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === products.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                    />
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Product name</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Brand</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Stock</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Sales</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Price</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Ware Price</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-500"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b last:border-b-0">
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleCheckboxChange(product.id)}
                        className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-500">{product.brand}</td>
                    <td className="py-4 px-6 text-gray-500">{product.stock}</td>
                    <td className="py-4 px-6 text-gray-500">{product.sales}</td>
                    <td className="py-4 px-6 text-gray-500">${product.price.toFixed(2)}</td>
                    <td className="py-4 px-6 text-gray-500">${product.warePrice.toFixed(2)}</td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => {
                          const updatedProducts = products.map(p => 
                            p.id === product.id ? {...p, status: !p.status} : p
                          );
                          setProducts(updatedProducts);
                        }}
                        className={`w-12 h-6 rounded-full ${product.status ? 'bg-orange-500' : 'bg-gray-200'} relative transition-colors duration-300`}
                      >
                        <div 
                          className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-all duration-300 shadow-sm ${product.status ? 'left-6' : 'left-0.5'}`}
                        />
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
