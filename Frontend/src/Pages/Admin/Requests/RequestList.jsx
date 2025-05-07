import { useState, useEffect } from 'react';
import Header from '../../../../components/Admin/Header';
import RequestCard from './RequestCard';
import "./request.css";
import axios from '../../../../lib/axios';
import toast from 'react-hot-toast';
const RequestsList = () => {
  const [partners, setPartners] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnverifiedPartners = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/admins/partners/unverified");
        console.log(data)
        setPartners(data);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchUnverifiedPartners();
  }, []);

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
      await axios.post('/admins/confirm-request', { email: selectedRequest.email });
      toast.success('Request confirmed successfully!');
      setPartners((prevPartners) => prevPartners.filter((partner) => partner.email !== selectedRequest.email));
      closeModal();
    } catch {
      toast.error('An error occurred while confirming the request.');
    }
  };

  // Cancel Request (✘ Button)
  const cancelRequest = async () => {
    try {
      await axios.post('/admins/cancel-request', { email: selectedRequest.email });
      toast.success('Request canceled successfully!');
      // Remove the canceled request from the partners list
    setPartners((prevPartners) => prevPartners.filter((partner) => partner.email !== selectedRequest.email));
      closeModal();
    } catch {
      toast.success('An error occurred while canceling the request.');
    }
  };

  // Filter requests based on search query
  const filteredRequests = partners.filter((request) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase().trim();
    const searchableFields = [
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
            placeholder="Search by email, address, or phone"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Render filtered request cards */}
      <div className="requests-list">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : filteredRequests.length > 0 ? (
          filteredRequests.map((request, index) => (
            <RequestCard
              key={index}
              {...request}
              onClick={() => handleRequestClick(request)}
            />
          ))
        ) : (
          <p>No matching requests found.</p>
        )}
      </div>

      {/* Modal for displaying detailed information */}
      {showModal && selectedRequest && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="closes-button" onClick={closeModal}>×</button>
            <h3>{selectedRequest?.authorizedRepresentative || "N/A"}</h3>
            <p>Email: {selectedRequest?.email}</p>
            <p>Address: {selectedRequest?.address}</p>

            {/* Phone Number */}
            {selectedRequest?.phoneNumber && (
              <p>Phone Number: {selectedRequest?.phoneNumber}</p>
            )}

            {/* Legal Documentation */}
            <div className='legal-documentation'>
              <h4>Legal Documentation</h4>
              <p>
                Certificate of Incorporation: 
                {selectedRequest?.certificateFileURL ? (
                  <a href={selectedRequest?.certificateFileURL} target="_blank" rel="noopener noreferrer">
                    <img src={selectedRequest?.certificateFileURL} alt="Certificate of Incorporation" className="w-24 h-24 object-cover" />
                  </a>
                ) : "Not Provided"}
              </p>
              <p>
                Business License: 
                {selectedRequest?.businessLicenseFileURL ? (
                  <a href={selectedRequest?.businessLicenseFileURL} target="_blank" rel="noopener noreferrer">
                    <img src={selectedRequest?.businessLicenseFileURL} alt="Business License" className="w-24 h-24 object-cover" />
                  </a>
                ) : "Not Provided"}
              </p>
              <p>
                Tax Compliance Certificate: 
                {selectedRequest?.taxComplianceFileURL ? (
                  <a href={selectedRequest?.taxComplianceFileURL} target="_blank" rel="noopener noreferrer">
                    <img src={selectedRequest?.taxComplianceFileURL} alt="Tax Compliance Certificate" className="w-24 h-24 object-cover" />
                  </a>
                ) : "Not Provided"}
              </p>
            </div>

            {/* Buttons at the bottom */}
            <div className="modal-buttons">
              <button className="cancel-button" onClick={cancelRequest}>✘</button>
              <button className="confirm-button" onClick={confirmRequest}>✓</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestsList;
