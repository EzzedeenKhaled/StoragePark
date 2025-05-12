import { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { usePartnerStore } from '../../../stores/usePartnerStore';
import { toast } from 'react-toastify';
import { LoadingSpinner } from '../../../../components/LoadingSpinner'
// Replace with your Mapbox access token
// mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

const ProfilePartner = () => {
  const email = localStorage.getItem('email');
  const [loading, setLoading] = useState(false);
  const { partner, setPartner, getPartner, updateUserPartner, loading: load } = usePartnerStore();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: 'Lebanon',
    address: '',
    language: 'English',
    location: { lat: 33.5731, lng: 35.3728 },
    profileImage: '' // Default to Saida, Lebanon coordinates
  });

  // Fetch partner data on component mount
  useEffect(() => {
    const fetchPartnerData = async () => {
      try {
        setLoading(true);
        const response = await getPartner(email);
        const partnerData = response.data;
        // Set partner data in store
        setPartner(partnerData);

        // Update form data with fetched data
        setFormData({
          fullName: partnerData?.companyName || '',
          email: partnerData?.email || '',
          phone: partnerData?.phoneNumber || '',
          country: 'Lebanon',
          address: partnerData?.address || '',
          language: 'English',
          profileImage: partnerData.profileImage
        });
      } catch (error) {
        console.error('Error fetching partner data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchPartnerData();
  }, [setPartner, getPartner]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    try {
      const updatedData = { email: formData.email };
      if (selectedImageFile) {
        updatedData.image = selectedImageFile;
      }
      const res = await updateUserPartner(updatedData);
      toast.success('Profile updated successfully');
      // Update partner store
    setFormData((prev) => ({
      ...prev,
      profileImage: res.data.profileImage,
    }));
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  if (load) return <LoadingSpinner />;
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* <Sidebar /> */}

      <div className="flex-1">
        {/* Header */}
        <div className="bg-gradient-to-r from-black to-orange-500 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{formData.fullName}&apos;s Information</h1>
              <p className="text-sm text-gray-200">{new Date().toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'long', year: 'numeric' })}</p>
            </div>
            <button
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-black/90 transition-colors cursor-pointer"
              onClick={handleSaveProfile}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Profile Form */}
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Shop Logo and Name Section */}
            <div className="flex items-center gap-4 mb-8">
              <div className="mb-8">
                <label htmlFor="profileImage" className="cursor-pointer group relative block w-24 h-24 rounded-full overflow-hidden">
                  <img
                    src={previewImage || formData.profileImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzcsHv578aOlNW5kDRZ5Lc5AZQowEd-fojyQ&s"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-sm font-medium ml-6">Change Picture</span>
                  </div>
                </label>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{formData.fullName}</h2>
                <p className="text-gray-500">{formData.email}</p>
                {partner?.isVerified !== undefined && (
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${partner.isVerified
                        ? 'bg-green-100 text-green-800' // Approved
                        : 'bg-yellow-100 text-yellow-800' // Pending or not approved
                      }`}
                  >
                    Status: {partner.isVerified ? 'Approved' : 'Pending'}
                  </span>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <div className="relative">
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none"
                  >
                    <option value="Lebanon">Lebanon</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your address"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <div className="relative">
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none"
                  >
                    <option value="English">English</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              {/* Document Files */}
              {partner && (
                <div className="col-span-2 mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Verification Documents</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {partner.certificateFile && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Certificate</h4>
                        <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={partner.certificateFile}
                            alt="Certificate"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <a
                          href={partner.certificateFile}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-600 hover:underline mt-2 inline-block"
                        >
                          View Document
                        </a>
                      </div>
                    )}

                    {partner.businessLicenseFile && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Business License</h4>
                        <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={partner.businessLicenseFile}
                            alt="Business License"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <a
                          href={partner.businessLicenseFile}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-600 hover:underline mt-2 inline-block"
                        >
                          View Document
                        </a>
                      </div>
                    )}

                    {partner.taxComplianceFile && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Tax Compliance</h4>
                        <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={partner.taxComplianceFile}
                            alt="Tax Compliance"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <a
                          href={partner.taxComplianceFile}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-600 hover:underline mt-2 inline-block"
                        >
                          View Document
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePartner;