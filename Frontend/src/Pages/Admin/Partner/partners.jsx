import { useState, useEffect } from 'react';
import './partner.css';
import Header from '../../../../components/Admin/Header';
import { useNavigate } from 'react-router-dom';
import axios from '../../../../lib/axios';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Partners = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAcceptedPartners = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/admins/accepted');
        setPartners(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch partners.');
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedPartners();
  }, []);

  console.log("diajd: ",partners)
  const filteredPartners = partners.filter((partner) => {
    const query = searchQuery.trim().toLowerCase();
    return query === '' || partner.name.toLowerCase().startsWith(query);
  });

  const navigateToPartnerDetail = (partnerId, email) => {
    localStorage.setItem('partnerId', partnerId);
    localStorage.setItem('email', email);
    localStorage.setItem('role', "admin");
    navigate('/partner-dashboard', { state: { id: partnerId, email: email } });
  };

  return (
    <div>
      <Header />
      <div className="partners-page">
        <div className="partners-content">
          {/* Header Row */}
          <div className="header-actionsP">
            <h2 className="title">Partners</h2>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by name or email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Partners Grid */}
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <ul className="partners-grid">
              {filteredPartners.length > 0 ? (
                filteredPartners.map((partner) => (
                  <li key={partner.id} className="partner-item">
                    <div
                      className="partner-box"
                      onClick={() => navigateToPartnerDetail(partner.id, partner.email)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="partner-logo">
                        {partner.logo ? (
                          <img src={partner.logo} alt={`${partner.name} logo`} />
                        ) : (
                          <div className="placeholder-logo">No Logo</div>
                        )}
                      </div>
                      <div className="partner-details">
                        <strong>{partner.name}</strong>
                        <em>{partner.email}</em>
                      </div>
                      <span className="partner-arrow">&#8250;</span>
                    </div>
                  </li>
                ))
              ) : (
                <p className="no-results">No matching partners found.</p>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Partners;