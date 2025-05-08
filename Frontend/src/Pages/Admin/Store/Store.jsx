import { useState, useEffect } from 'react';
import Header from '../../../../components/Admin/Header';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import axios from '../../../../lib/axios';

const Store = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const response = await axios.get('/warehouse/structure');
      console.log('Warehouse response:', response.data);
      if (response.data.statusCode === 200) {
        setWarehouses(response.data.data);
        console.log('Warehouses state:', response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch warehouse data');
      }
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch warehouse data');
    } finally {
      setLoading(false);
    }
  };

  const filteredWarehouses = warehouses.filter(warehouse => {
    console.log('Filtering warehouse:', warehouse);
    const matchesSearch = `Aisle ${warehouse.aisleNumber}`.toLowerCase().includes(searchQuery.toLowerCase());
    const hasReservedRows = warehouse.rows.some(row => row.isReserved);
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'reserved' ? hasReservedRows :
      filter === 'available' ? !hasReservedRows : true;
    
    return matchesSearch && matchesFilter;
  });

  console.log('Filtered warehouses:', filteredWarehouses);

  const handleSectionClick = (aisleId, side) => {
    navigate(`/admin/store/aisle/${aisleId}/${side.toLowerCase()}`);
  };

  const AisleSection = ({ warehouse }) => {
    console.log('Rendering AisleSection for warehouse:', warehouse);
    const leftRows = warehouse.rows.filter(row => row.side === 'left');
    const rightRows = warehouse.rows.filter(row => row.side === 'right');
    const leftReserved = leftRows.some(row => row.isReserved);
    const rightReserved = rightRows.some(row => row.isReserved);

    return (
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Aisle {warehouse.aisleNumber}</h3>
            <span className={`px-3 py-1 rounded-full text-sm ${
              warehouse.storageType === 'standard' ? 'bg-green-100 text-green-800' :
              warehouse.storageType === 'fragile' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {warehouse.storageType.charAt(0).toUpperCase() + warehouse.storageType.slice(1)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                leftReserved 
                  ? 'bg-red-500/90 text-white hover:bg-red-600' 
                  : 'bg-green-500/90 text-white hover:bg-green-600'
              }`}
              onClick={() => handleSectionClick(warehouse.aisleNumber, 'Left')}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">Left Side</span>
                <div className="text-sm opacity-80">
                  <p>{leftRows.length} Rows</p>
                  <p>{leftReserved ? 'Partially Reserved' : 'Available'}</p>
                </div>
              </div>
            </div>
            <div
              className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                rightReserved 
                  ? 'bg-red-500/90 text-white hover:bg-red-600' 
                  : 'bg-green-500/90 text-white hover:bg-green-600'
              }`}
              onClick={() => handleSectionClick(warehouse.aisleNumber, 'Right')}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">Right Side</span>
                <div className="text-sm opacity-80">
                  <p>{rightRows.length} Rows</p>
                  <p>{rightReserved ? 'Partially Reserved' : 'Available'}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>Cost: ${warehouse.costPerSquareMeter.monthly}/m²/month</p>
            <p>or ${warehouse.costPerSquareMeter.daily}/m²/day</p>
          </div>
        </div>
      </div>
    );
  };

  AisleSection.propTypes = {
    warehouse: PropTypes.shape({
      aisleNumber: PropTypes.number.isRequired,
      storageType: PropTypes.string.isRequired,
      rows: PropTypes.array.isRequired,
      costPerSquareMeter: PropTypes.shape({
        monthly: PropTypes.number.isRequired,
        daily: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  console.log('Rendering Store component with warehouses:', warehouses);
  console.log('Filtered warehouses for rendering:', filteredWarehouses);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-10 pt-28">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Warehouse Management</h2>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <input
                type="text"
                placeholder="Search aisles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm"
            >
              <option value="all">All Aisles</option>
              <option value="reserved">Reserved</option>
              <option value="available">Available</option>
            </select>
          </div>
        </div>
        <div className="flex justify-center items-center min-h-[40vh]">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWarehouses.length > 0 ? (
              filteredWarehouses.map((warehouse) => (
                <AisleSection key={warehouse._id} warehouse={warehouse} />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16">
                <img src="/empty-box.svg" alt="No warehouses" className="w-32 h-32 mb-4 opacity-60" />
                <p className="text-gray-500 text-lg">No warehouses found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Store; 