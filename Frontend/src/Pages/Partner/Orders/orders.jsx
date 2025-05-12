import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import axios from '../../../../lib/axios';

const Orders = () => {
  const partnerId = localStorage.getItem('partnerId');
  const [selectedTab, setSelectedTab] = useState('All Orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPartnerOrders = async () => {
      try {
        setLoading(true);
        setOrders([]); // Clear existing orders
        
        const response = await axios.get('/partners/orders', {
          params: { partnerId }
        });
        
        if (response?.data) {
          // Create a Map to store unique orders by orderId
          const uniqueOrdersMap = new Map();
          
          response.data.forEach(order => {
            // Only add the order if we haven't seen this orderId before
            if (!uniqueOrdersMap.has(order.orderId)) {
              uniqueOrdersMap.set(order.orderId, {
                orderId: order.orderId,
                product: order.items.map(item => `${item.name} (x${item.quantity})`).join(', '),
                customer: `${order.user.firstName} ${order.user.lastName}`,
                date: new Date(order.orderDate).toLocaleDateString(),
                status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
                price: order.totalAmount
              });
            }
          });
          
          // Convert Map values back to array
          const formattedOrders = Array.from(uniqueOrdersMap.values());
          setOrders(formattedOrders);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching partner orders:', err);
        setError('Failed to load orders. Please try again later.');
        setOrders([]);
        setLoading(false);
      }
    };

    fetchPartnerOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-600';
      case 'Delivered':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (selectedTab !== 'All Orders' && order.status !== selectedTab) {
      return false;
    }

    if (searchQuery) {
      return (
        order.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return true;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* <Sidebar />s */}
      
      <div className="flex-1">
        {/* Header */}
        <div className="bg-orange-500 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Partner Orders</h1>
              <p className="text-sm opacity-90">Manage all orders for your products</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search orders..."
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
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-1 border-b">
              {['All Orders', 'Pending', 'Delivered'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-4 py-2 -mb-px ${
                    selectedTab === tab
                      ? 'border-b-2 border-orange-500 text-orange-500 font-medium'
                      : 'text-gray-500'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
              <p>{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredOrders.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500">There are no orders matching your filters.</p>
            </div>
          )}

          {/* Table */}
          {!loading && !error && filteredOrders.length > 0 && (
            <div className="bg-white rounded-lg shadow">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="p-4 text-sm font-medium text-gray-500">Product(s)</th>
                      <th className="p-4 text-sm font-medium text-gray-500">Customer</th>
                      <th className="p-4 text-sm font-medium text-gray-500">Date</th>
                      <th className="p-4 text-sm font-medium text-gray-500">Status</th>
                      <th className="p-4 text-sm font-medium text-gray-500">Total Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.orderId} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="p-4">{order.product}</td>
                        <td className="p-4">{order.customer}</td>
                        <td className="p-4">{order.date}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4">${order.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;