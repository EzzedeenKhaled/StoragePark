import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Jan', Purchase: 55000, Sales: 48000 },
  { name: 'Feb', Purchase: 45000, Sales: 46000 },
  { name: 'Mar', Purchase: 47000, Sales: 52000 },
  { name: 'Apr', Purchase: 38000, Sales: 42000 },
  { name: 'May', Purchase: 43000, Sales: 47000 },
  { name: 'Jun', Purchase: 32000, Sales: 40000 },
  { name: 'Jul', Purchase: 55000, Sales: 48000 },
  { name: 'Aug', Purchase: 42000, Sales: 43000 },
  { name: 'Sep', Purchase: 43000, Sales: 44000 },
  { name: 'Oct', Purchase: 35000, Sales: 38000 }
];

const SalesPurchaseChart = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Purchase" fill="#60A5FA" radius={[5, 5, 0, 0]} />
        <Bar dataKey="Sales" fill="#4ADE80" radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SalesPurchaseChart; 