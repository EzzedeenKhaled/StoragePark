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

const ProductSummary = () => {
  const [numberOfPartners, setNumberOfPartners] = useState(0);
  const [numberOfCategories, setNumberOfCategories] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/admins/partnersAndCategories');
        setNumberOfPartners(response.data.numberOfPartners);
        setNumberOfCategories(response.data.numberOfCategories);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
        bg: 'bg-blue-100',
      },
      value: numberOfPartners,
      label: 'Number of Partners',
    },
    {
      icon: {
        component: (
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        ),
        bg: 'bg-purple-100',
      },
      value: numberOfCategories,
      label: 'Number of Categories',
    },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Product Summary</h2>
      <div className="space-y-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
    </div>
  );
};

export default ProductSummary;