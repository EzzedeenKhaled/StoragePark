import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Jun', value: 30000 },
  { name: 'Jul', value: 40567.88 },
  { name: 'Aug', value: 25000 },
  { name: 'Sep', value: 35000 },
  { name: 'Oct', value: 45000 },
  { name: 'Nov', value: 35000 },
  { name: 'Dec', value: 30000 }
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg">
        <p className="text-sm font-normal">{`${label}, 15`}</p>
        <p className="text-base font-semibold">{`$${payload[0].value.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};

const RevenueChart = () => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e2e8f0"
          />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            tickFormatter={(value) => `${value/1000}K`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#f97316"
            strokeWidth={2}
            fill="url(#colorRevenue)"
            dot={{ fill: '#fff', stroke: '#f97316', strokeWidth: 2, r: 4 }}
            activeDot={{ fill: '#f97316', stroke: '#fff', strokeWidth: 2, r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart; 