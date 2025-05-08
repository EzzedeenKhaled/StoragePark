import { useState, useEffect, useCallback } from 'react';
import axios from '../../../lib/axios';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  KeyIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import Header from '../../../components/Admin/Header';

// Debounce function
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Password generator function
const generateStrongPassword = () => {
  const length = 12;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";
  
  // Ensure at least one of each required character type
  password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)]; // Uppercase
  password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)]; // Lowercase
  password += "0123456789"[Math.floor(Math.random() * 10)]; // Number
  password += "!@#$%^&*()_+"[Math.floor(Math.random() * 12)]; // Special char
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

// Password strength checker
const checkPasswordStrength = (password) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+]/.test(password);
  const isLongEnough = password.length >= 8;

  return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isLongEnough;
};

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const fetchEmployees = useCallback(async (search = '') => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/admins/employees`, {
        params: { search },
        withCredentials: true
      });
      
      if (response.data && Array.isArray(response.data)) {
        setEmployees(response.data);
        if (response.data.length === 0) {
          toast.info('No employees found matching your criteria.');
        }
      } else {
        setEmployees([]);
        toast.error('Invalid data format received from server');
      }
    } catch (error) {
      console.error('Error fetching employees:', error.response || error);
      if (error.response?.status === 404) {
        toast.info('No employees found matching your criteria.');
      } else if (error.response?.status === 401) {
        toast.error('Please log in again to continue.');
      } else {
        toast.error(`Failed to fetch employees: 'Please try again later.'}`);
      }
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((search) => {
      fetchEmployees(search);
    }, 300),
    [fetchEmployees]
  );

  useEffect(() => {
    fetchEmployees(searchTerm);
  }, [fetchEmployees, searchTerm]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
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
        phoneNumber: formData.get('phoneNumber'),
        password: formData.get('password'),
        role: 'employee',
        isVerified: true
      };

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(employeeData.email)) {
        toast.error('Please enter a valid email address');
        return;
      }

      // Validate phone number format
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      if (!phoneRegex.test(employeeData.phoneNumber)) {
        toast.error('Please enter a valid phone number');
        return;
      }

      // Validate password strength
      if (!checkPasswordStrength(employeeData.password)) {
        toast.error('Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character');
        return;
      }

      const response = await axios.post(`/admins/employees`, employeeData);

      if (response.data) {
        toast.success('Employee added successfully!');
        if (response.data.emailSent) {
          toast.info('Login credentials have been sent to the employee\'s email.');
        } else {
          toast.warning('Employee was added but failed to send credentials email.');
        }
        setShowAddModal(false);
        // Reset form
        e.target.reset();
        // Refresh the employee list
        fetchEmployees(searchTerm);
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      if (error.response?.status === 400) {
        if (error.response.data.message === 'User already exists') {
          toast.error('An employee with this email already exists');
        } else {
          toast.error(error.response.data.message || 'Invalid employee data');
        }
      } else if (error.response?.status === 401) {
        toast.error('Please log in again to continue.');
      } else {
        const errorMessage = 'Failed to add employee. Please try again.';
        toast.error(errorMessage);
      }
    }
  };

  const handleEditEmployee = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const formData = new FormData(e.target);
      const employeeData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phoneNumber: formData.get('phoneNumber'),
        password: formData.get('password') || undefined,
        role: 'employee'
      };

      const response = await axios.put(`/admins/employees/${selectedEmployee._id}`,employeeData);

      if (response.data) {
        toast.success('Employee updated successfully!');
        setShowEditModal(false);
        setSelectedEmployee(null);
        fetchEmployees(searchTerm);
      }
    } catch (error) {
      console.error('Error updating employee:', error.response || error);
      const errorMessage = 'Failed to update employee. Please try again.';
      toast.error(`Failed to update employee: ${errorMessage}`);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    setEmployeeToDelete(employeeId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(`/admins/employees/${employeeToDelete}`, {
        withCredentials: true
      });

      if (response.data) {
        toast.success('Employee deleted successfully!');
        fetchEmployees(searchTerm);
      }
    } catch (error) {
      console.error('Error deleting employee:', error.response || error);
      const errorMessage = 'Failed to delete employee. Please try again.';
      toast.error(`Failed to delete employee: ${errorMessage}`);
    } finally {
      setShowDeleteModal(false);
      setEmployeeToDelete(null);
    }
  };

  const handleGeneratePassword = (e) => {
    e.preventDefault();
    const generatedPassword = generateStrongPassword();
    const passwordInput = e.target.form.querySelector('input[name="password"]');
    if (passwordInput) {
      passwordInput.value = generatedPassword;
      passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-30">
        <div className={`${showAddModal || showEditModal || showDeleteModal ? 'backdrop-blur-md' : ''}`}>
          <Header />
        </div>
      </div>
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
            {/* Search and Filter */}
            <div className="mb-6 flex gap-4 items-center">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search by name, email, or phone number"
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
                            src={employee.profileImage || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzcsHv578aOlNW5kDRZ5Lc5AZQowEd-fojyQ&s'}
                            alt=""
                          />
                          <div className="ml-4">
                            <h2 className="text-lg font-medium text-gray-900">
                              {employee.firstName} {employee.lastName}
                            </h2>
                            <p className="text-sm text-gray-500">{employee.email}</p>
                            <p className="text-sm text-gray-500 capitalize">{employee.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setShowEditModal(true);
                            }}
                            className="text-blue-500 hover:text-blue-600"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(employee._id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <TrashIcon className="h-5 w-5" />
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
          <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-40">
            <div className="relative w-full max-w-md mx-4">
              {/* Blurred background layer */}
              <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-lg"></div>
              
              {/* Content layer */}
              <div className="relative">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-50/90 to-orange-100/90 backdrop-blur-xl px-6 py-4 rounded-t-lg border-b border-orange-200/50">
                  <h2 className="text-xl font-semibold text-orange-800">Add New Employee</h2>
                </div>
                
                {/* Body */}
                <div className="bg-white/80 backdrop-blur-xl px-6 py-6 rounded-b-lg">
                  <form onSubmit={handleAddEmployee}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-white/90"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-white/90"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          name="email"
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-white/90"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            type="text"
                            name="password"
                            required
                            minLength={8}
                            onChange={(e) => {
                              const isValid = checkPasswordStrength(e.target.value);
                              if (!isValid) {
                                e.target.setCustomValidity('Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character');
                              } else {
                                e.target.setCustomValidity('');
                              }
                            }}
                            className="block w-full border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-white/90"
                          />
                          <button
                            type="button"
                            onClick={handleGeneratePassword}
                            className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                          >
                            <KeyIcon className="h-5 w-5" />
                          </button>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-white/90"
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
                        Add Employee
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Employee Modal */}
        {showEditModal && selectedEmployee && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-40">
            <div className="relative w-full max-w-md mx-4">
              {/* Blurred background layer */}
              <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-lg"></div>
              
              {/* Content layer */}
              <div className="relative">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-50/90 to-orange-100/90 backdrop-blur-xl px-6 py-4 rounded-t-lg border-b border-orange-200/50">
                  <h2 className="text-xl font-semibold text-orange-800">Edit Employee</h2>
                </div>
                
                {/* Body */}
                <div className="bg-white/80 backdrop-blur-xl px-6 py-6 rounded-b-lg">
                  <form onSubmit={handleEditEmployee}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          defaultValue={selectedEmployee.firstName}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-white/90"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          defaultValue={selectedEmployee.lastName}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-white/90"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          name="email"
                          defaultValue={selectedEmployee.email}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-white/90"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Password (leave blank to keep current)</label>
                        <input
                          type="password"
                          name="password"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-white/90"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          defaultValue={selectedEmployee.phoneNumber}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-white/90"
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowEditModal(false);
                          setSelectedEmployee(null);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600"
                      >
                        Update Employee
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-40">
            <div className="relative w-full max-w-md mx-4">
              {/* Blurred background layer */}
              <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-lg"></div>
              
              {/* Content layer */}
              <div className="relative">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-50/90 to-orange-100/90 backdrop-blur-xl px-6 py-4 rounded-t-lg border-b border-orange-200/50">
                  <div className="flex items-center justify-center">
                    <ExclamationTriangleIcon className="h-6 w-6 text-orange-500 mr-2" />
                    <h3 className="text-lg font-medium text-orange-800">Delete Employee</h3>
                  </div>
                </div>
                
                {/* Body */}
                <div className="bg-white/80 backdrop-blur-xl px-6 py-6 rounded-b-lg">
                  <p className="text-sm text-gray-600 mb-6 text-center">
                    Are you sure you want to delete this employee? This action cannot be undone.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDeleteModal(false);
                        setEmployeeToDelete(null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={confirmDelete}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Employees; 