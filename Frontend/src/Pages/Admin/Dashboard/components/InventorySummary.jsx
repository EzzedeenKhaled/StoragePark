import React, { useEffect, useState } from 'react';
import axios from '../../../../../lib/axios';

const MetricCard = ({ icon, value, label }) => (
  <div className="flex items-center gap-4">
    <div className={`p-3 rounded-lg ${icon.bg}`}>
      {icon.component}
    </div>
    <div>
      <p className="text-xl font-semibold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

const InventorySummary = () => {
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTotalQuantity = async () => {
      try {
        const response = await axios.get('/admins/getAllQuantity');
        setTotalQuantity(response.data.totalQuantity);
      } catch (err) {
        console.error('Error fetching total quantity:', err);
        setError('Failed to fetch total quantity');
      } finally {
        setLoading(false);
      }
    };

    fetchTotalQuantity();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
<div className="w-8 h-8 border-4 border-[#ff9800] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  const metrics = [
    {
      icon: {
        component: (
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        ),
        bg: 'bg-blue-100',
      },
      value: totalQuantity,
      label: 'Total Quantity',
    },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Inventory Summary</h2>
      <div className="space-y-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
    </div>
  );
};

export default InventorySummary;