import Header from '../../../../components/Admin/Header';
import './Store.css';
import shelf from '/shelf.png';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const aisles = [
  { id: 1, title: 'Aisle 1', Lreserved: false, Rreserved: false },
  { id: 2, title: 'Aisle 2', Lreserved: true, Rreserved: true },
  { id: 3, title: 'Aisle 3', Lreserved: false, Rreserved: false },
  { id: 4, title: 'Aisle 4', Lreserved: true, Rreserved: true },
  { id: 5, title: 'Aisle 5', Lreserved: false, Rreserved: false },
  { id: 6, title: 'Aisle 6', Lreserved: true, Rreserved: true },
];

const Store = () => {
  const navigate = useNavigate();

  const handleSectionClick = (aisleId, side) => {
    navigate(`/admin/store/aisle/${aisleId}/${side.toLowerCase()}`);
  };

  const AisleSection = ({ aisle }) => (
    <div className="aisle-container">
      <h3 className="aisle-title">{`Aisle ${aisle.id}`}</h3>
      <div className="aisle-sections">
        <div
          className={`aisle-section left ${aisle.Lreserved ? 'red' : 'green'}`}
          onClick={() => handleSectionClick(aisle.id, 'Left')}
        >
          <img src={shelf} alt="Shelf" className="shelf-icon" />
          <span>LEFT</span>
        </div>
        <div
          className={`aisle-section right ${aisle.Rreserved ? 'red' : 'green'}`}
          onClick={() => handleSectionClick(aisle.id, 'Right')}
        >
          <img src={shelf} alt="Shelf" className="shelf-icon" />
          <span>RIGHT</span>
        </div>
      </div>
    </div>
  );

  AisleSection.propTypes = {
    aisle: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      Lreserved: PropTypes.bool.isRequired,
      Rreserved: PropTypes.bool.isRequired,
    }).isRequired,
  };

  return (
    <div className="store-page">
      <Header />
      <div className="store-content">
        <div className="content-header">
          <h2>Store</h2>
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Search" 
              className="search-input"
            />
          </div>
        </div>
        <div className="aisles-grid">
          {aisles.map((aisle) => (
            <AisleSection key={aisle.id} aisle={aisle} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Store; 