import { useState } from 'react';
import Sidebar from '../components/Sidebar';

const Orders = () => {
  const [selectedTab, setSelectedTab] = useState('All Orders');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const orders = [
    {
      orderId: 'SKN1200',
      product: 'Watch Nike Series 7',
      customer: 'Robert Fox',
      date: '01.01.2022',
      status: 'Continuing',
      price: 399.00
    },
    {
      orderId: 'SKN1233',
      product: 'iPhone 13 Pro',
      customer: 'Brooklyn Simmons',
      date: '01.01.2022',
      status: 'Continuing',
      price: 2999.00
    },
    {
      orderId: 'KBN1243',
      product: 'iPhone 12 Mini',
      customer: 'Jacob Jones',
      date: '02.01.2022',
      status: 'Continuing',
      price: 2699.00
    },
    {
      orderId: 'APG3456',
      product: 'AirPods 3 Generation',
      customer: 'Marvin McKinney',
      date: '02.01.2022',
      status: 'Completed',
      price: 179.00
    },
    {
      orderId: 'SKN2456',
      product: 'Galaxy Z Flip 5G',
      customer: 'Bessie Cooper',
      date: '02.01.2022',
      status: 'Canceled',
      price: 399.00
    },
    {
      orderId: 'SGA5255',
      product: 'Samsung Galaxy A52 5G',
      customer: 'Arlene McCoy',
      date: '03.01.2022',
      status: 'Continuing',
      price: 399.99
    }
  ];

  const handleCheckboxChange = (orderId) => {
    setSelectedOrders(prev => {
      if (prev.includes(orderId)) {
        return prev.filter(id => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrders(orders.map(order => order.orderId));
    } else {
      setSelectedOrders([]);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Continuing':
        return 'bg-blue-100 text-blue-600';
      case 'Completed':
        return 'bg-green-100 text-green-600';
      case 'Canceled':
        return 'bg-red-100 text-red-500';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = selectedTab === 'All Orders' || order.status === selectedTab;
    
    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1">
        {/* Header */}
        <div className="bg-orange-500 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Orders</h1>
              <p className="text-sm opacity-90">Detailed information about your orders</p>
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
              <button className="p-2 rounded-lg hover:bg-orange-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs and Filters */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-1 border-b">
              {['All Orders', 'Continuing', 'Completed', 'Canceled'].map((tab) => (
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
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white rounded-lg border border-gray-200 hover:bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                Filters
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white rounded-lg border border-gray-200 hover:bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                  <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                </svg>
                Exports
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="p-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        onChange={handleSelectAll}
                        checked={selectedOrders.length === filteredOrders.length}
                      />
                    </th>
                    <th className="p-4 text-sm font-medium text-gray-500">Order ID</th>
                    <th className="p-4 text-sm font-medium text-gray-500">Product</th>
                    <th className="p-4 text-sm font-medium text-gray-500">Customer</th>
                    <th className="p-4 text-sm font-medium text-gray-500">Date</th>
                    <th className="p-4 text-sm font-medium text-gray-500">Status</th>
                    <th className="p-4 text-sm font-medium text-gray-500">Total Price</th>
                    <th className="p-4 text-sm font-medium text-gray-500"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.orderId} className="border-b last:border-b-0">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={selectedOrders.includes(order.orderId)}
                          onChange={() => handleCheckboxChange(order.orderId)}
                        />
                      </td>
                      <td className="p-4 font-medium">{order.orderId}</td>
                      <td className="p-4">{order.product}</td>
                      <td className="p-4">{order.customer}</td>
                      <td className="p-4">{order.date}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4">${order.price.toFixed(2)}</td>
                      <td className="p-4">
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
    </div>
  );
};

export default Orders;
