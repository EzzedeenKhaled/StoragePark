import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MagnifyingGlassIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import Header from '../../../components/Admin/Header';

const API_BASE_URL = 'http://localhost:5000'; // Add base URL

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/api/admin/customers?search=${searchTerm}`, {
          withCredentials: true
        });
        
        if (response.data && Array.isArray(response.data.customers)) {
          setCustomers(response.data.customers);
          if (response.data.customers.length === 0 && !searchTerm) {
            toast.info('No customers found in the database. Click "Add Customer" to create one.');
          }
        } else {
          setCustomers([]);
          toast.error('Invalid data format received from server');
        }
      } catch (error) {
        console.error('Error fetching customers:', error.response || error);
        if (error.response?.status === 404) {
          toast.info('No customers found in the database. Click "Add Customer" to create one.');
        } else if (error.response?.status === 401) {
          toast.error('Please log in again to continue.');
        } else {
          toast.error(`Failed to fetch customers: ${error.response?.data?.message || 'Please try again later.'}`);
        }
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const formData = new FormData(e.target);
      const customerData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phoneNumber: formData.get('phoneNumber'),
        password: formData.get('password'),
        isVerified: true
      };

      console.log('Sending customer data:', customerData);
      const response = await axios.post(`${API_BASE_URL}/api/admin/customers`, customerData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        console.log('Customer added successfully:', response.data);
        toast.success('Customer added successfully!');
        setShowAddModal(false);
        // Refresh the customer list
        const fetchResponse = await axios.get(`${API_BASE_URL}/api/admin/customers?search=${searchTerm}`, {
          withCredentials: true
        });
        if (fetchResponse.data && Array.isArray(fetchResponse.data.customers)) {
          setCustomers(fetchResponse.data.customers);
        }
      }
    } catch (error) {
      console.error('Error adding customer:', error.response || error);
      if (error.response?.status === 401) {
        toast.error('Please log in again to continue.');
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to add customer. Please try again.';
        toast.error(`Failed to add customer: ${errorMessage}`);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col mt-16">
        {/* Title Section */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Customer
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-gray-50 border border-gray-200 text-gray-700 rounded whitespace-pre-line">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : customers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No customers found
              </div>
            ) : (
              <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <div key={customer._id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img
                            className="h-12 w-12 rounded-full"
                            src={customer.profileImage || 'https://via.placeholder.com/48'}
                            alt=""
                          />
                          <div className="ml-4">
                            <h2 className="text-lg font-medium text-gray-900">
                              {customer.firstName} {customer.lastName}
                            </h2>
                            <p className="text-sm text-gray-500">{customer.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            customer.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {customer.isVerified ? 'Verified' : 'Pending'}
                          </span>
                          <button
                            className="ml-4 text-orange-500 hover:text-orange-600"
                            onClick={() => {/* View customer details */}}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Add Customer Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">Add New Customer</h2>
              <form onSubmit={handleAddCustomer}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      name="password"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600"
                  >
                    Add Customer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Customers; 