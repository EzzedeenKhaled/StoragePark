// RequestCard.jsx
import React from 'react';
import "./requestcard.css";

const RequestCard = ({ name, email, address, authorizedRepresentative, phoneNumber, legalDocumentation, onClick }) => {
  return (
    <div className="request-card" onClick={onClick}>
      <h3 className="card-title">{name}</h3>
      <p className="card-email">Email: {email}</p>
      <p className="card-address">Address: {address}</p>
      {authorizedRepresentative && (
        <p className="card-representative">Representative: {authorizedRepresentative}</p>
      )}
      {phoneNumber && (
        <p className="card-phone">Phone: {phoneNumber}</p>
      )}
      {legalDocumentation && (
        <div className="card-legal-docs">
          <p className="card-doc-item">Certificate: {legalDocumentation.certificateOfIncorporation}</p>
          <p className="card-doc-item">License: {legalDocumentation.businessLicense}</p>
          <p className="card-doc-item">Tax Certificate: {legalDocumentation.taxComplianceCertificate}</p>
        </div>
      )}
    </div>
  );
};

export default RequestCard;