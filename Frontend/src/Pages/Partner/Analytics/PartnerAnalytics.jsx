import PropTypes from 'prop-types';
import Sidebar from '../components/Sidebar';
import { BarChart, Bar, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const StatCard = ({ title, value, change, lastWeekValue }) => {
  const isPositive = change.includes('+');
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-600">{title}</h3>
        <button className="text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>
      </div>
      <div className="flex items-baseline">
        <h2 className="text-3xl font-semibold">{value}</h2>
        <span className={`ml-2 text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {change}
        </span>
      </div>
      <p className="text-gray-500 text-sm mt-2">Last week {lastWeekValue}</p>
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  change: PropTypes.string.isRequired,
  lastWeekValue: PropTypes.string.isRequired
};
const UserActivityChart = () => {
  const data = [
    { name: 'S', value: 9000 },
    { name: 'M', value: 3000 },
    { name: 'T', value: 5000 },
    { name: 'W', value: 5500 },
    { name: 'T', value: 4000 },
    { name: 'F', value: 2000 },
    { name: 'S', value: 6000 }
  ];
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-gray-600">User Activity</h3>
          <div className="flex items-center">
            <span className="text-2xl font-semibold">10,320</span>
            <span className="ml-2 text-red-500 text-sm">-20%</span>
          </div>
        </div>
        <select className="bg-gray-50 border border-gray-200 rounded px-3 py-1 text-sm">
          <option>This Week</option>
          <option>Last Week</option>
          <option>Last Month</option>
        </select>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={index === 0 ? '#f97316' : '#1f2937'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const CustomerRating = () => {
  const total = 2574;
  const positive = 274;
  const negative = 2300;
  
  const data = [
    { name: 'Positive', value: positive },
    { name: 'Negative', value: negative }
  ];
  
  const COLORS = ['#22c55e', '#ef4444'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-gray-600">Customer Rating</h3>
        <select className="bg-gray-50 border border-gray-200 rounded px-3 py-1 text-sm">
          <option>This Week</option>
          <option>Last Week</option>
          <option>Last Month</option>
        </select>
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
            <div className="text-3xl font-bold">{total}</div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <span className="text-sm">Negative: {negative}</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span className="text-sm">Positive: {positive}</span>
        </div>
      </div>
    </div>
  );
};

const PartnerAnalytics = () => {
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
            <button className="bg-orange-400 p-2 rounded-lg shadow-sm hover:bg-orange-400/80 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-8 ml-[250px]">
          <div className="grid grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="Total Orders" 
              value="837" 
              change="-59%" 
              lastWeekValue="2041"
            />
            <StatCard 
              title="Stock Turnover Rate" 
              value="%7.5" 
              change="-0.5%" 
              lastWeekValue="%15"
            />
            <StatCard 
              title="Total Returns" 
              value="200" 
              change="+1.0%" 
              lastWeekValue="100"
            />
            <StatCard 
              title="Products Sold" 
              value="531" 
              change="-30%" 
              lastWeekValue="707"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <UserActivityChart />
            <CustomerRating />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerAnalytics;
