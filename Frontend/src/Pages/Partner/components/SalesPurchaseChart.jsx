import { useState, useEffect } from 'react';
import axios from '../../../../lib/axios';
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

const SalesPurchaseChart = () => {
  const partnerId = localStorage.getItem('partnerId');
  const [data, setData] = useState([]); // Store the fetched data
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track error state

  useEffect(() => {
    // Fetch sales and purchase data from the API
    const fetchData = async () => {
      try {
        const response = await axios.get('/partners/salesAndPurchase', {
          params: { partnerId }
        }); // Assuming the API is running locally
        setData(response.data.data); // Set the fetched data into state
        setLoading(false); // Set loading to false once data is fetched
      } catch (err) {
        setError('Failed to fetch data'); // Set error message if the fetch fails
        setLoading(false); // Set loading to false
      }
    };

    fetchData(); // Call the fetch function when component mounts
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    ); // Show loading message until data is fetched
  }

  if (error) {
    return <div>{error}</div>; // Show error message if fetch fails
  }

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
        <Tooltip
          formatter={(value) => value.toFixed(2)} // Format values to 2 decimal places
        />
        <Legend />
        <Bar dataKey="Purchase" fill="#60A5FA" radius={[5, 5, 0, 0]} />
        <Bar dataKey="Sales" fill="#4ADE80" radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SalesPurchaseChart;
