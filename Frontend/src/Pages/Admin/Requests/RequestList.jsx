import { useState } from 'react';
import Header from '../../../../components/Admin/Header';
import RequestCard from './RequestCard';
import "./request.css";
import axios from 'axios';

// Sample data with all possible fields
const requestsData = [
  {
    id: 1,
    name: "FearlessPeak",
    email: "fearlessspeak@gmail.com",
    address: "Saida, Lebanon",
    authorizedRepresentative: "Adhan Saoudi",
    phoneNumber: "81543712",
    legalDocumentation: {
      certificateOfIncorporation: "Available",
      businessLicense: "Available",
      taxComplianceCertificate: "Available",
    },
    uploadedFiles: ["Document 1", "Document 2"],
  },
  {
    id: 2,
    name: "TimeQuest",
    email: "timequest@gmail.com",
    address: "Byblos, Lebanon",
    authorizedRepresentative: null,
    phoneNumber: null,
    legalDocumentation: null,
    uploadedFiles: [],
  },
  {
    id: 3,
    name: "DreamTide",
    email: "dreamtide@gmail.com",
    address: "Tripoli, Lebanon",
    authorizedRepresentative: "Jane Smith",
    phoneNumber: "70123456",
    legalDocumentation: {
      certificateOfIncorporation: "Not Available",
      businessLicense: "Available",
      taxComplianceCertificate: "Not Available",
    },
    uploadedFiles: ["File A", "File B"],
  },
  {
    id: 4,
    name: "SwiftBuy",
    email: "swiftbuy@gmail.com",
    address: "Beirut, Lebanon",
    authorizedRepresentative: null,
    phoneNumber: null,
    legalDocumentation: null,
    uploadedFiles: [],
  },
  {
    id: 5,
    name: "OnlineShop",
    email: "onlineshop@gmail.com",
    address: "Saida, Lebanon",
    authorizedRepresentative: "John Doe",
    phoneNumber: "71234567",
    legalDocumentation: {
      certificateOfIncorporation: "Available",
      businessLicense: "Not Available",
      taxComplianceCertificate: "Available",
    },
    uploadedFiles: ["Invoice.pdf", "Contract.docx"],
  },
  {
    id: 6,
    name: "AllBrand",
    email: "allbrand@gmail.com",
    address: "Saida, Lebanon",
    authorizedRepresentative: null,
    phoneNumber: null,
    legalDocumentation: null,
    uploadedFiles: [],
  },
];

const RequestsList = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle request card click
  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  // Close the modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Confirm Request (✓ Button)
  const confirmRequest = async () => {
    try {
      await axios.post('/api/confirm-request', { id: selectedRequest.id });
      alert('Request confirmed successfully!');
      closeModal();
    } catch {
      alert('An error occurred while confirming the request.');
    }
  };

  // Cancel Request (✘ Button)
  const cancelRequest = async () => {
    try {
      await axios.post('/api/cancel-request', { id: selectedRequest.id });
      alert('Request canceled successfully!');
      closeModal();
    } catch {
      alert('An error occurred while canceling the request.');
    }
  };

  // Filter requests based on search query
  const filteredRequests = requestsData.filter((request) => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase().trim();
    const searchableFields = [
      request.name,
      request.email,
      request.address,
      request.authorizedRepresentative,
      request.phoneNumber
    ].filter(Boolean); // Remove null/undefined values

    return searchableFields.some(field => 
      field.toLowerCase().includes(query)
    );
  });

  return (
    <div className="content">
      {/* Header */}
      <Header />

      {/* Title and Search Bar */}
      <div className="header-actions">
        <h3 className="title">Requests</h3>
        <div className="search-bar">
          
          <input
            type="text"
            placeholder="Search by name, email, address, or phone"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Render filtered request cards */}
      <div className="requests-list">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <RequestCard
              key={request.id}
              {...request}
              onClick={() => handleRequestClick(request)}
            />
          ))
        ) : (
          <p>No matching requests found.</p>
        )}
      </div>

      {/* Modal for displaying detailed information */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="closes-button" onClick={closeModal}>×</button>
            <h3>{selectedRequest?.name}</h3>
            <p>Email: {selectedRequest?.email}</p>
            <p>Address: {selectedRequest?.address}</p>
            {/* Authorized Representative */}
            {selectedRequest?.authorizedRepresentative && (
              <p>Authorized Representative: {selectedRequest?.authorizedRepresentative}</p>
            )}

            {/* Phone Number */}
            {selectedRequest?.phoneNumber && (
              <p>Phone Number: {selectedRequest?.phoneNumber}</p>
            )}

            {/* Legal Documentation */}
            {selectedRequest?.legalDocumentation && (
              <div className='legal-documentation'>
                <h4>Legal Documentation</h4>
                <p>Certificate of Incorporation: {selectedRequest?.legalDocumentation.certificateOfIncorporation}</p>
                <p>Business License: {selectedRequest?.legalDocumentation.businessLicense}</p>
                <p>Tax Compliance Certificate: {selectedRequest?.legalDocumentation.taxComplianceCertificate}</p>
              </div>
            )}
            {/* Uploaded Files */}
            {selectedRequest?.uploadedFiles && selectedRequest.uploadedFiles.length > 0 && (
              <div className='legal-documentation'>
                <h4>Uploaded Documents:</h4>
                <ul>
                  {selectedRequest.uploadedFiles.map((file, index) => (
                    <li key={index}>{file}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Buttons at the bottom */}
            <div className="modal-buttons">
              <button className="cancel-button" onClick={cancelRequest}>✘ </button>
              <button className="confirm-button" onClick={confirmRequest}>✓ </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestsList;