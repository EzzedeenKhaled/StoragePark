import { useState, useEffect } from 'react';
import { Bell, TrendingUp, DollarSign, CheckCircle, Warehouse } from 'lucide-react';
import StatCard from './components/StatCard';
import BestSelling from './components/BestSelling';
import SalesPurchaseChart from './components/SalesPurchaseChart';
import axios from '../../../lib/axios';
// import { LoadingSpinner } from '../../../components/LoadingSpinner';
const PartnerDashboard = () => {

  const partnerId = localStorage.getItem('partnerId');
  const [year] = useState('This Year');
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalProfit: 0,
    storageInfo: null
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        let res;
        if (!partnerId)
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

  }, [partnerId]);
  // if (loading) return <LoadingSpinner />;
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* <Sidebar /> */}

      <div className="flex-1">
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

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <StatCard
              title="Units Sold"
              value={loading ? "Loading..." : stats.totalSales}
              // percentChange={12} 
              icon={<TrendingUp size={24} className="text-yellow-500" />}
            />

            <StatCard
              title="Total Revenue"
              value={loading ? "Loading..." : `$${stats.totalRevenue.toFixed(2)}`}
              icon={<DollarSign size={24} className="text-blue-500" />}
            />

            <StatCard
              title="Profit" // Change 'Return' to 'Profit'
              value={loading ? "Loading..." : `$${stats.totalProfit.toFixed(2)}`} // Use totalProfit
              icon={<CheckCircle size={24} className="text-pink-500" />}
            />

            <StatCard
              title="Storage Cost"
              value={loading ? "Loading..." : stats.storageInfo ? `$${stats.storageInfo.monthlyCost.toFixed(2)}/month` : "$0.00/month"}
              icon={<Warehouse size={24} className="text-green-500" />}
            />
          </div>

          {stats.storageInfo && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Storage Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Total Storage Area</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.storageInfo.totalArea.toFixed(2)} m²</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Monthly Storage Cost</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.storageInfo.monthlyCost.toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-md font-semibold text-gray-700 mb-3">Storage Breakdown</h3>
                <div className="space-y-4">
                  {Object.entries(stats.storageInfo.storageBreakdown).map(([type, info]) => (
                    <div key={type} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800 capitalize">{type} Storage</p>
                        <p className="text-sm text-gray-600">{info.area.toFixed(2)} m²</p>
                      </div>
                      <p className="font-semibold text-gray-900">${info.cost.toFixed(2)}/month</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-gray-500 text-sm">Sales & Purchase</p>
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
            <SalesPurchaseChart />
          </div>

          <div className="">
            <BestSelling />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;

          