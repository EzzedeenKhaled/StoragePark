import { useState, useEffect } from 'react';
import Header from '../../../../components/Admin/Header';
import RequestCard from './RequestCard';
import "./request.css";
import axios from '../../../../lib/axios';
import toast from 'react-hot-toast';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

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
      <div className={`fixed top-0 left-0 right-0 z-30 ${showModal ? 'backdrop-blur-md' : ''}`}>
        <div className={`${showModal ? 'bg-white/40 backdrop-blur-xl' : ''}`}>
          <Header />
        </div>
      </div>

      {/* Title and Search Bar */}
      <div className={`header-actions ${showModal ? 'mt-16' : ''}`}>
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Requests</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search and Filter */}
          <div className="mb-6 flex gap-4 items-center">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by email, address, or phone"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
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
        </div>
      </main>

      {/* Modal for displaying detailed information */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-40">
          <div className="relative w-full max-w-2xl mx-4">
            {/* Blurred background layer */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-lg"></div>
            
            {/* Content layer */}
            <div className="relative">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-50/90 to-orange-100/90 backdrop-blur-xl px-6 py-4 rounded-t-lg border-b border-orange-200/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-orange-800">
                    {selectedRequest?.authorizedRepresentative || "N/A"}
                  </h3>
                  <button 
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={closeModal}
                  >
                    ×
                  </button>
                </div>
              </div>
              
              {/* Body */}
              <div className="bg-white/80 backdrop-blur-xl px-6 py-6 rounded-b-lg">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900">{selectedRequest?.email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Phone Number</p>
                      <p className="text-gray-900">{selectedRequest?.phoneNumber || "Not Provided"}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-gray-900">{selectedRequest?.address}</p>
                  </div>

                  {/* Legal Documentation */}
                  <div className="mt-6 space-y-4">
                    <h4 className="text-lg font-medium text-gray-900">Legal Documentation</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500">Certificate of Incorporation</p>
                        {selectedRequest?.certificateFileURL ? (
                          <a 
                            href={selectedRequest?.certificateFileURL} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block group"
                          >
                            <div className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                              <img 
                                src={selectedRequest?.certificateFileURL} 
                                alt="Certificate of Incorporation" 
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200" 
                              />
                            </div>
                          </a>
                        ) : (
                          <p className="text-sm text-gray-500">Not Provided</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500">Business License</p>
                        {selectedRequest?.businessLicenseFileURL ? (
                          <a 
                            href={selectedRequest?.businessLicenseFileURL} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block group"
                          >
                            <div className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                              <img 
                                src={selectedRequest?.businessLicenseFileURL} 
                                alt="Business License" 
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200" 
                              />
                            </div>
                          </a>
                        ) : (
                          <p className="text-sm text-gray-500">Not Provided</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500">Tax Compliance Certificate</p>
                        {selectedRequest?.taxComplianceFileURL ? (
                          <a 
                            href={selectedRequest?.taxComplianceFileURL} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block group"
                          >
                            <div className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                              <img 
                                src={selectedRequest?.taxComplianceFileURL} 
                                alt="Tax Compliance Certificate" 
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200" 
                              />
                            </div>
                          </a>
                        ) : (
                          <p className="text-sm text-gray-500">Not Provided</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    onClick={cancelRequest}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={confirmRequest}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestsList;
