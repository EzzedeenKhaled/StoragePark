const StatCard = ({ title, value, percentChange, icon }) => {
  const isPositive = percentChange >= 0;
  
  return (
    <div className="bg-white rounded-lg p-6 flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-sm mb-1">{title}</p>
        <p className="text-xl font-semibold mb-1">{value}</p>
        <div className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? '+' : ''}{percentChange}%
        </div>
      </div>
      <div className="bg-gray-50 p-3 rounded-lg">
        {icon}
      </div>
    </div>
  );
};

export default StatCard; 