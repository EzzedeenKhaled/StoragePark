import Header from '../../../../components/Admin/Header';
import PropTypes from 'prop-types';

const ShelfIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 32 32">
    <rect x="4" y="8" width="24" height="16" rx="2" />
    <path d="M4 16h24M12 8v16M20 8v16" />
  </svg>
);

const AisleSection = ({ aisle, side, rows, onBack }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
    <Header />
    <div className="max-w-5xl mx-auto px-4 py-10">
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-orange-600 font-semibold text-lg hover:underline hover:text-orange-700 transition"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Back
      </button>
      <div className="flex items-center justify-between mb-10 gap-4">
        <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">Store</h2>
        <input
          type="text"
          placeholder="Search rows..."
          className="rounded-xl border border-gray-300 px-5 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 w-full sm:w-80 transition"
        />
      </div>
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-8">Aisle {aisle}, {side}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {rows.map((row) => (
            <div
              key={row.id}
              className={`flex items-center px-8 py-7 rounded-2xl shadow-md border border-gray-200 transition-all duration-200 hover:scale-[1.03] hover:shadow-lg cursor-pointer group ${
                row.reserved
                  ? 'bg-red-500/90 text-white hover:bg-red-600'
                  : 'bg-green-500/90 text-white hover:bg-green-600'
              }`}
            >
              <ShelfIcon className="w-10 h-10 mr-4 text-black opacity-80" />
              <span className="text-xl font-bold tracking-wide group-hover:underline">{row.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

AisleSection.propTypes = {
  aisle: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  side: PropTypes.string.isRequired,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      reserved: PropTypes.bool.isRequired,
    })
  ).isRequired,
  onBack: PropTypes.func.isRequired,
};

ShelfIcon.propTypes = {
  className: PropTypes.string,
};

export default AisleSection; 