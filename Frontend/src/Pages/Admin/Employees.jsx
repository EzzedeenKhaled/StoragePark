import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MagnifyingGlassIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import Header from '../../../components/Admin/Header';

const API_BASE_URL = 'http://localhost:5000'; // Add base URL

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/api/admin/employees?search=${searchTerm}`, {
          withCredentials: true
        });
        
        if (response.data && Array.isArray(response.data.employees)) {
          setEmployees(response.data.employees);
          if (response.data.employees.length === 0 && !searchTerm) {
            toast.info('No employees found in the database. Click "Add Employee" to create one.');
          }
        } else {
          setEmployees([]);
          toast.error('Invalid data format received from server');
        }
      } catch (error) {
        console.error('Error fetching employees:', error.response || error);
        if (error.response?.status === 404) {
          toast.info('No employees found in the database. Click "Add Employee" to create one.');
        } else if (error.response?.status === 401) {
          toast.error('Please log in again to continue.');
        } else {
          toast.error(`Failed to fetch employees: ${error.response?.data?.message || 'Please try again later.'}`);
        }
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const formData = new FormData(e.target);
      const employeeData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        role: formData.get('role'),
        password: formData.get('password'),
        isActive: true
      };

      console.log('Sending employee data:', employeeData);
      const response = await axios.post(`${API_BASE_URL}/api/admin/employees`, employeeData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        console.log('Employee added successfully:', response.data);
        toast.success('Employee added successfully!');
        setShowAddModal(false);
        // Refresh the employee list
        const fetchResponse = await axios.get(`${API_BASE_URL}/api/admin/employees?search=${searchTerm}`, {
          withCredentials: true
        });
        if (fetchResponse.data && Array.isArray(fetchResponse.data.employees)) {
          setEmployees(fetchResponse.data.employees);
        }
      }
    } catch (error) {
      console.error('Error adding employee:', error.response || error);
      if (error.response?.status === 401) {
        toast.error('Please log in again to continue.');
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to add employee. Please try again.';
        toast.error(`Failed to add employee: ${errorMessage}`);
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
              <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Employee
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
            ) : employees.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No employees found
              </div>
            ) : (
              <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 divide-y divide-gray-200">
                  {employees.map((employee) => (
                    <div key={employee._id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img
                            className="h-12 w-12 rounded-full"
                            src={employee.profileImage || 'https://via.placeholder.com/48'}
                            alt=""
                          />
                          <div className="ml-4">
                            <h2 className="text-lg font-medium text-gray-900">
                              {employee.firstName} {employee.lastName}
                            </h2>
                            <p className="text-sm text-gray-500">{employee.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            employee.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {employee.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <button
                            className="ml-4 text-orange-500 hover:text-orange-600"
                            onClick={() => {/* View employee details */}}
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

        {/* Add Employee Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">Add New Employee</h2>
              <form onSubmit={handleAddEmployee}>
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
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                      name="role"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="staff">Staff</option>
                    </select>
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
                    Add Employee
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

export default Employees; 