import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../../../components/Admin/Header';
import { Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useUserStore } from '../../../stores/useUserStore';
import PropTypes from 'prop-types';
import axios from '../../../../lib/axios';

const Rows = () => {
  const { aisleId, side } = useParams();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [warehouse, setWarehouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUserStore();
  const [reservationModal, setReservationModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    fetchWarehouseData();
  }, [aisleId]);

  const fetchWarehouseData = async () => {
    try {
      const response = await axios.get(`/warehouse/${aisleId}`);
      if (response.data.statusCode === 200) {
        setWarehouse(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch warehouse data');
      }
    } catch (error) {
      console.error('Error fetching warehouse data:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch warehouse data');
    } finally {
      setLoading(false);
    }
  };

  const filteredRows = warehouse?.rows
    .filter(row => row.side === side.toLowerCase())
    .filter(row => {
      const matchesSearch = `Row ${row.rowNumber}`.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = 
        filter === 'all' ? true :
        filter === 'reserved' ? row.isReserved :
        filter === 'available' ? !row.isReserved : true;
      
      return matchesSearch && matchesFilter;
    }) || [];

  const calculateArea = (dimensions) => {
    return ((dimensions.width * dimensions.depth) / 10000).toFixed(2);
  };

  const calculateCost = (dimensions) => {
    const area = calculateArea(dimensions);
    return {
      monthly: (area * warehouse.costPerSquareMeter.monthly).toFixed(2),
      daily: (area * warehouse.costPerSquareMeter.daily).toFixed(2)
    };
  };

  const handleReservation = async (row) => {
    setSelectedRow(row);
    setReservationModal(true);
  };

  const confirmReservation = async (startDate, endDate) => {
    try {
      const response = await axios.patch(`/warehouse/${warehouse.aisleNumber}/rows/${selectedRow._id}`, {
        isReserved: true,
        reservedBy: user._id,
        startDate,
        endDate,
      });

      if (response.data.statusCode === 200) {
        await fetchWarehouseData();
        setReservationModal(false);
        toast.success('Row reserved successfully');
      } else {
        throw new Error(response.data.message || 'Failed to reserve row');
      }
    } catch (error) {
      console.error('Error reserving row:', error);
      toast.error(error.response?.data?.message || 'Failed to reserve row');
    }
  };

  const ReservationModal = ({ isOpen, onClose, onConfirm, row }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Reserve Row {row?.rowNumber}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => onConfirm(startDate, endDate)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                disabled={!startDate || !endDate}
              >
                Confirm Reservation
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  ReservationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    row: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      rowNumber: PropTypes.number.isRequired,
      isReserved: PropTypes.bool.isRequired,
    }).isRequired,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-orange-600 font-semibold text-lg hover:underline hover:text-orange-700 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Aisle {warehouse.aisleNumber}, {side?.charAt(0).toUpperCase() + side?.slice(1)}
            </h2>
            <p className="text-gray-600 mt-1">
              {warehouse.storageType.charAt(0).toUpperCase() + warehouse.storageType.slice(1)} Storage
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <input
                type="text"
                placeholder="Search rows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            >
              <option value="all">All Rows</option>
              <option value="reserved">Reserved</option>
              <option value="available">Available</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRows.map((row) => {
            const costs = calculateCost(row.dimensions);
            return (
              <div
                key={row._id}
                className={`bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${
                  row.isReserved ? 'border-l-4 border-red-500' : 'border-l-4 border-green-500'
                }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Row {row.rowNumber}</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {row.dimensions.width}cm × {row.dimensions.depth}cm
                      </p>
                      <p className="text-gray-600 text-sm">
                        Area: {calculateArea(row.dimensions)} m²
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      row.isReserved 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {row.isReserved ? 'Reserved' : 'Available'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      <p>${costs.monthly}/month</p>
                      <p>${costs.daily}/day</p>
                    </div>
                    <button
                      onClick={() => handleReservation(row)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        row.isReserved
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {row.isReserved ? 'View Details' : 'Reserve'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <ReservationModal
          isOpen={reservationModal}
          onClose={() => setReservationModal(false)}
          onConfirm={confirmReservation}
          row={selectedRow}
        />
      </div>
    </div>
  );
};

export default Rows; 