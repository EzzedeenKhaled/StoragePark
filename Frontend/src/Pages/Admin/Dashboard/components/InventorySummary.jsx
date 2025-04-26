import React from 'react';

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
  const metrics = [
    {
      icon: {
        component: (
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        ),
        bg: 'bg-blue-100'
      },
      value: '868',
      label: 'Quantity in Hand'
    },
    {
      icon: {
        component: (
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        ),
        bg: 'bg-purple-100'
      },
      value: '200',
      label: 'To be received'
    }
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