import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../../../components/Admin/Header';
import PropTypes from 'prop-types';

const rowsData = [
  { id: 1, label: 'Row 1', reserved: false },
  { id: 2, label: 'Row 2', reserved: true },
  { id: 3, label: 'Row 3', reserved: true },
  { id: 4, label: 'Row 4', reserved: false },
  { id: 5, label: 'Row 5', reserved: false },
  { id: 6, label: 'Row 6', reserved: true },
  { id: 7, label: 'Row 7', reserved: false },
  { id: 8, label: 'Row 8', reserved: true },
  { id: 9, label: 'Row 9', reserved: false },
  { id: 10, label: 'Row 10', reserved: true },
  { id: 11, label: 'Row 11', reserved: false },
  { id: 12, label: 'Row 12', reserved: true },
];

const ShelfIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 32 32">
    <rect x="4" y="8" width="24" height="16" rx="2" />
    <path d="M4 16h24M12 8v16M20 8v16" />
  </svg>
);

ShelfIcon.propTypes = {
  className: PropTypes.string,
};

const Rows = () => {
  const { aisleId, side } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-orange-600 font-semibold text-lg hover:underline hover:text-orange-700 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Aisle {aisleId}, {side?.charAt(0).toUpperCase() + side?.slice(1)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rowsData.map((row) => (
            <div
              key={row.id}
              className={`flex items-center px-8 py-6 rounded-xl shadow transition-colors cursor-pointer ${
                row.reserved ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
              }`}
            >
              <ShelfIcon className="w-8 h-8 mr-4 text-black opacity-80" />
              <span className="text-lg font-bold">{row.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rows; 