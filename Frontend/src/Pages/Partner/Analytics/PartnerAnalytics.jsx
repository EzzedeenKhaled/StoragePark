import PropTypes from 'prop-types';
import Sidebar from '../components/Sidebar';
import { PieChart, Pie, Cell } from 'recharts';
import axios from '../../../../lib/axios';
import { useState, useEffect } from 'react';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
const StatCard = ({ title, value, image }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-600">{title}</h3>
      </div>
      <div className="flex items-center space-x-4">
        {image && (
          <img src={image} alt="item" className="w-12 h-12 object-cover rounded-md" />
        )}
        <h2 className="text-xl font-semibold">{value}</h2>
      </div>
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  image: PropTypes.string,
};

const CustomerRating = ({ totalRating, positiveR, negativeR }) => {
  const data = [
    { name: 'Positive', value: positiveR },
    { name: 'Negative', value: negativeR },
  ];

  const COLORS = ['#22c55e', '#ef4444'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-gray-600">Customer Rating</h3>
      </div>
      <div className="flex justify-center">
        <div className="relative w-48 h-48">
          <PieChart width={192} height={192}>
            <Pie
              data={data}
              cx={96}
              cy={96}
              innerRadius={60}
              outerRadius={80}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-2xl font-semibold">Total</div>
            <div className="text-3xl font-bold">{totalRating}</div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <span className="text-sm">Negative: {negativeR}</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span className="text-sm">Positive: {positiveR}</span>
        </div>
      </div>
    </div>
  );
};

const PartnerAnalytics = () => {
  const partnerId = localStorage.getItem('partnerId');
  const [totalRating, setTotalRating] = useState(0);
  const [positiveR, setPositiveR] = useState(0);
  const [negativeR, setNegativeR] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [topSelling, setTopSelling] = useState({ data: [] });
  const [topCategory, setTopCategory] = useState('');
  const [totalProductsSold, setTotalProductsSold] = useState(0);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchOrderStats = async () => {
      try {
        setLoading(true); // Start loading
        const response = await axios.get('/partners/orders', {
          params: { partnerId },
        });
        const totalOrders = response.data.length;

        const totalProductsSold = response.data.reduce((sum, order) => {
          const orderTotal = order.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
          return sum + orderTotal;
        }, 0);

        setTotalOrders(totalOrders);
        setTotalProductsSold(totalProductsSold);

        const res = await axios.get('/reviews/partner-rating', {
          params: { partnerId },
        });
        const { total, positive, negative } = res.data;
        setTotalRating(total);
        setPositiveR(positive);
        setNegativeR(negative);

        const topS = await axios.get('/partners/topSelling', {
          params: { partnerId },
        });
        setTopSelling(topS);

        const topC = await axios.get('/partners/topCategory', {
          params: { partnerId },
        });
        setTopCategory(topC.data[0]?.category);
      } catch (err) {
        console.error('Error fetching order stats:', err);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchOrderStats();
  }, []);

  if (loading) {
    return <LoadingSpinner/>
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="bg-orange-500 p-8 sticky top-0 z-10 ml-[256px]">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-white">Analytics</h1>
              <p className="text-orange-50">Monitor progress regularly to increase sales</p>
            </div>
          </div>
        </div>

        <div className="p-8 ml-[250px]">
          <div className="grid grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Orders" value={totalOrders} />
            <StatCard
              title="Top Selling Item"
              value={topSelling.data[0]?.productName || 'No data'}
              image={topSelling.data[0]?.imageProduct}
            />
            <StatCard title="Top Category" value={topCategory || "No data"} />
            <StatCard title="Products Sold" value={totalProductsSold} />
          </div>

          <div>
            <CustomerRating
              totalRating={totalRating}
              positiveR={positiveR}
              negativeR={negativeR}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerAnalytics;