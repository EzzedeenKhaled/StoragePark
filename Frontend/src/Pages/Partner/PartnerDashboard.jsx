import { useState } from 'react';
import { Bell, TrendingUp, DollarSign, Clock } from 'lucide-react';

// Components
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import RevenueChart from './components/RevenueChart';
import BestSelling from './components/BestSelling';
import TransactionHistory from './components/TransactionHistory';

const PartnerDashboard = () => {
  const [year] = useState('This Year');

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-orange-500 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Overview</h1>
              <p className="text-sm opacity-90">Detailed information about your store</p>
            </div>
            <div className="relative">
              <button className="p-2 rounded-lg hover:bg-orange-600 transition-colors">
                <Bell size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <StatCard 
              title="Sales" 
              value="$1,234.00" 
              percentChange={12} 
              icon={<TrendingUp size={24} className="text-yellow-500" />}
            />
            
            <StatCard 
              title="Total Revenue" 
              value="$10,566.01" 
              percentChange={35} 
              icon={<DollarSign size={24} className="text-blue-500" />}
            />
            
            <StatCard 
              title="Return" 
              value="$956.00" 
              percentChange={-5} 
              icon={<Clock size={24} className="text-pink-500" />}
            />
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-gray-500 text-sm">Overall revenue</p>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  $48,574.21 
                  <span className="text-sm text-green-500">+20%</span>
                </h2>
              </div>
              <div>
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors">
                  {year}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
            <RevenueChart />
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BestSelling />
            <TransactionHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
