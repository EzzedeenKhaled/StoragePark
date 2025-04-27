import React, { useState } from 'react';
import './partner.css';
import Header from '../../../../components/Admin/Header';
import onlineshop from '/onlineshop.png';
import swiftbuy from '/swiftbuy.png';
import clothing from '/clothing.png';
import { useNavigate } from 'react-router-dom';

const Partners = () => {
  const navigate = useNavigate();
  const acceptedPartners = [
    {
      id: 1,
      name: 'Online Shop',
      email: 'online-shop@gmail.com',
      logo: onlineshop,
    },
    {
      id: 2,
      name: 'Online Company',
      email: 'online-company@gmail.com',
      logo: clothing,
    },
    {
      id: 3,
      name: 'Swift Buy',
      email: 'swift-buy@gmail.com',
      logo: swiftbuy,
    },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const filteredPartners = acceptedPartners.filter((partner) => {
    const query = searchQuery.trim().toLowerCase();
    return query === '' || partner.name.toLowerCase().startsWith(query);
  });

  const navigateToPartnerDetail = (partnerId) => {
    navigate(`/partner/${partnerId}`);
  };

  return (
    <div>
      <Header />
      <div className="partners-page">
        <div className="partners-content">
          {/* Header Row */}
          <div className="header-actionsP">
            <h2 className="title">Partners</h2>
            <div className="search-container">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
          </div>

          {/* Partners Grid */}
          <ul className="partners-grid">
            {filteredPartners.length > 0 ? (
              filteredPartners.map((partner) => (
                <li key={partner.id} className="partner-item">
                  <div
                    className="partner-box"
                    onClick={() => navigateToPartnerDetail(partner.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="partner-logo">
                      <img src={partner.logo} alt={`${partner.name} logo`} />
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
        </div>
      </div>
    </div>
  );
};

export default Partners;