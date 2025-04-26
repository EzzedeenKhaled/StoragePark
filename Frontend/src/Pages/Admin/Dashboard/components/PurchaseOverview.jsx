import React from 'react';

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

const PurchaseOverview = () => {
  const metrics = [
    {
      icon: {
        component: (
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        ),
        bg: 'bg-blue-100'
      },
      value: '82',
      label: 'Purchase',
      textColor: 'text-blue-600'
    },
    {
      icon: {
        component: (
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        bg: 'bg-green-100'
      },
      value: '$ 13,573',
      label: 'Cost',
      textColor: 'text-green-600'
    },
    {
      icon: {
        component: (
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        bg: 'bg-red-100'
      },
      value: '5',
      label: 'Cancel',
      textColor: 'text-red-600'
    },
    {
      icon: {
        component: (
          <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        ),
        bg: 'bg-yellow-100'
      },
      value: '$ 3,432',
      label: 'Return',
      textColor: 'text-yellow-600'
    }
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Purchase Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
    </div>
  );
};

export default PurchaseOverview; 