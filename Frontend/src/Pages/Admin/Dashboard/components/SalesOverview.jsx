import { useState, useEffect } from 'react';
import axios from '../../../../../lib/axios';

const MetricCard = ({ icon, value, label, textColor = 'text-gray-600' }) => (
  <div className="flex items-center gap-4">
    <div className={`p-3 rounded-lg ${icon.bg}`}>
      {icon.component}
    </div>
    <div>
      <p className={`text-xl font-semibold ${textColor}`}>{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

const SalesOverview = () => {
  const [metrics, setMetrics] = useState([
    {
      icon: {
        component: (
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        ),
        bg: 'bg-green-100'
      },
      value: '0',
      label: 'Reserved Rows',
      textColor: 'text-green-600'
    },
    {
      icon: {
        component: (
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
        bg: 'bg-purple-100'
      },
      value: '$0',
      label: 'Revenue',
      textColor: 'text-purple-600'
    },
    {
      icon: {
        component: (
          <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
        ),
        bg: 'bg-yellow-100'
      },
      value: '$0',
      label: 'Profit',
      textColor: 'text-yellow-600'
    },
    {
      icon: {
        component: (
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        ),
        bg: 'bg-blue-100'
      },
      value: '0',
      label: 'Purchase',
      textColor: 'text-blue-600'
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [financialData, orderStats] = await Promise.all([
          axios.get('/admins/financial-overview'),
          axios.get('/admins/order-statistics')
        ]);

        const newMetrics = [...metrics];
        // Reserved Rows
        newMetrics[0].value = financialData.data.totalReservedRows;
        // Revenue
        newMetrics[1].value = `$${financialData.data.totalRevenue.toFixed(2)}`;
        // Profit
        newMetrics[2].value = `$${financialData.data.totalProfit.toFixed(2)}`;
        // Purchase (total orders)
        newMetrics[3].value = orderStats.data.totalOrders;

        setMetrics(newMetrics);
      } catch (error) {
        console.error('Error fetching sales overview data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Overview</h2>
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Overview</h2>
        <div className="text-red-500 text-center p-4">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
    </div>
  );
};

export default SalesOverview; 