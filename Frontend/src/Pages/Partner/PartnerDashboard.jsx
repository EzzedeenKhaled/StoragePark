import { useState, useEffect } from 'react';
import { Bell, TrendingUp, DollarSign, CheckCircle  } from 'lucide-react';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import BestSelling from './components/BestSelling';
import SalesPurchaseChart from './components/SalesPurchaseChart';
// import TransactionHistory from './components/TransactionHistory';
import axios from '../../../lib/axios';

const PartnerDashboard = () => {
  const partnerId = localStorage.getItem('partnerId');
  const [year] = useState('This Year');
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalProfit: 0, // Add totalProfit to state
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        let res;
        if(!partnerId)
        res = await axios.get('/partners/stats');
        else
        res = await axios.get('/partners/stats', {
          params: { partnerId }
        });
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar/>

      <div className="flex-1">
        <div className="bg-orange-500 text-white p-6 ml-[250px]">
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

        <div className="p-6 ml-[260px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <StatCard 
              title="Units Sold" 
              value={loading ? "Loading..." : stats.totalSales} 
              // percentChange={12} 
              icon={<TrendingUp size={24} className="text-yellow-500" />}
            />
            
            <StatCard 
              title="Total Revenue" 
              value={loading ? "Loading..." : `$${stats.totalRevenue.toFixed(2)}`} 
              // percentChange={35} 
              icon={<DollarSign size={24} className="text-blue-500" />}
            />

            <StatCard 
              title="Profit" // Change 'Return' to 'Profit'
              value={loading ? "Loading..." : `$${stats.totalProfit.toFixed(2)}`} // Use totalProfit
              // percentChange={-5} 
              icon={<CheckCircle  size={24} className="text-pink-500" />}
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-gray-500 text-sm">Sales & Purchase</p>
                {/* <h2 className="text-xl font-semibold flex items-center gap-2">
                  $48,574.21 
                  <span className="text-sm text-green-500">+20%</span>
                </h2> */}
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
            <SalesPurchaseChart/>
          </div>

          <div className="">
            <BestSelling />
            {/* <TransactionHistory /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
