import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../../lib/axios';
import Header from '../../../../components/Admin/Header';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const OutgoingOrders = () => {
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({
    totalOrders: 0,
    deliveredOrders: 0,
    pendingOrders: 0,
    totalAmount: '$0'
  });
  const [loading, setLoading] = useState(true);
  const [dataOrders, setDataOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/admins/order-stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching order statistics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderStats();
  }, []);

  useEffect(() => {
    const fetchDataOrders = async () => {
      try {
        const response = await axios.get("/admins/getDataOrders");
        setDataOrders(response.data);
      } catch (error) {
        console.error("Error fetching data orders:", error);
      }
    };
    fetchDataOrders();
  }, []);

  const filteredOrders = dataOrders.filter(order =>
    order.company?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-30">
        <Header />
      </div>
      <div className="min-h-screen flex flex-col mt-16 bg-gray-50">
        {/* Title Section */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Outgoing Orders</h1>
              <p className="text-sm text-gray-500">Manage and track your outgoing orders</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Search by company name"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="flex items-center bg-white rounded-lg shadow border border-gray-200 p-4 gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Total Orders</div>
                  <div className="text-lg font-semibold text-gray-900">{loading ? 'Loading...' : stats.totalOrders}</div>
                </div>
              </div>
              <div className="flex items-center bg-white rounded-lg shadow border border-gray-200 p-4 gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Delivered</div>
                  <div className="text-lg font-semibold text-gray-900">{loading ? 'Loading...' : stats.deliveredOrders}</div>
                </div>
              </div>
              <div className="flex items-center bg-white rounded-lg shadow border border-gray-200 p-4 gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100">
                  <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Pending</div>
                  <div className="text-lg font-semibold text-gray-900">{loading ? 'Loading...' : stats.pendingOrders}</div>
                </div>
              </div>
              <div className="flex items-center bg-white rounded-lg shadow border border-gray-200 p-4 gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Total Amount</div>
                  <div className="text-lg font-semibold text-gray-900">{loading ? 'Loading...' : stats.totalAmount}</div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">ORDER ID</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">USER NAME</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">USER PHONE</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">TOTAL PRICE</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">STATUS</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">DATE</th>
                  </tr>
                </thead>
<tbody>
  {loading ? (
    <tr>
      <td colSpan={6} className="text-center py-8 text-gray-500">
        Loading...
      </td>
    </tr>
  ) : filteredOrders.length === 0 ? (
    <tr>
      <td colSpan={6} className="text-center py-8 text-gray-500">
        No outgoing orders found
      </td>
    </tr>
  ) : (
    filteredOrders.map((order) => (
      <tr key={order.orderId} className="border-b last:border-b-0 hover:bg-gray-50">
        <td className="py-4 px-6">
          {order.status.trim().toLowerCase() === 'delivered' ? (
            <span className="text-gray-400 cursor-not-allowed">#{order.orderId}</span>
          ) : (
            <button
              className="text-orange-500 hover:underlin cursor-pointer"
              onClick={() => navigate(`/order-status/${order.orderId}`)}
            >
              #{order.orderId}
            </button>
          )}
        </td>
        <td className="py-4 px-6">
          {order.company} {order.role === 'customer' ? '(c)' : order.role === 'partner' ? '(p)' : ''}
        </td>
        <td className="py-4 px-6">
          <svg
            className="w-4 h-4 inline-block mr-2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          {order.phone}
        </td>
        <td className="py-4 px-6">${order.price}</td>
        <td className="py-4 px-6">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              order.status.toLowerCase() === 'delivered'
                ? 'bg-green-100 text-green-800'
                : order.status.toLowerCase() === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {order.status}
          </span>
        </td>
        <td className="py-4 px-6">{order.date}</td>
      </tr>
    ))
  )}
</tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default OutgoingOrders;