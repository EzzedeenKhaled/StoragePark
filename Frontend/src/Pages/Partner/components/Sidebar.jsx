import { NavLink, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../../stores/useUserStore';
import axios from '../../../../lib/axios';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

const Sidebar = () => {
  const { logout } = useUserStore();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleLogout = () => {
    logout(); // Call the logout function
    navigate('/'); // Redirect to homepage or login page
  };

  const isAdmin = localStorage.getItem('role') === 'admin'; // Check if the role is admin

  const handleAdminNavigate = () => {
    localStorage.removeItem('partnerId');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    navigate('/admin/partners'); // Navigate to the admin partners page
  };

  const handleDeletePartner = async () => {
    const partnerId = localStorage.getItem('partnerId');
    if (!partnerId) return;

    try {
      const toastId = toast.loading('Deleting partner...');
      await axios.delete(`/admins/deletePartner/${partnerId}`);
      toast.success('Partner deleted successfully', { id: toastId });
      setShowDeleteModal(false);
      handleAdminNavigate();
    } catch (error) {
      console.error('Error deleting partner:', error);
      toast.error(error.response?.data?.message || 'Failed to delete partner');
    }
  };

  return (
    <>
      <div className="bg-gray-900 text-white w-64 min-h-screen fixed">
        {/* Logo */}
        <div className="p-4">
          <NavLink to="/" className="flex items-center">
            <img 
              src="/logo_d.png" 
              alt="Storage Park Logo" 
              className="h-14 w-30" 
            />
          </NavLink>
        </div>

        {/* Navigation */}
        <nav className="mt-8">
          <NavLink 
            to="/partner" 
            end
            className={({ isActive }) =>
              `flex items-center py-3 px-4 ${
                isActive ? 'text-orange-500 bg-gray-800' : 'text-gray-400 hover:text-white'
              }`
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
            </svg>
            Overview
          </NavLink>

          <NavLink to="/partner/analytics" className={({ isActive }) =>
            `flex items-center py-3 px-4 ${
              isActive ? 'text-orange-500 bg-gray-800' : 'text-gray-400 hover:text-white'
            }`
          }>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analytics
          </NavLink>

          <NavLink to="/partner/orders" className={({ isActive }) =>
            `flex items-center py-3 px-4 ${
              isActive ? 'text-orange-500 bg-gray-800' : 'text-gray-400 hover:text-white'
            }`
          }>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Orders
          </NavLink>

          <NavLink to="/partner/products" className={({ isActive }) =>
            `flex items-center py-3 px-4 ${
              isActive ? 'text-orange-500 bg-gray-800' : 'text-gray-400 hover:text-white'
            }`
          }>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Products
          </NavLink>

          <NavLink to="/partner/profile" className={({ isActive }) =>
            `flex items-center py-3 px-4 ${
              isActive ? 'text-orange-500 bg-gray-800' : 'text-gray-400 hover:text-white'
            }`
          }>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile Information
          </NavLink>
        </nav>

        {/* Logout or Admin Navigation */}
        <div className="absolute bottom-0 w-64 p-4">
          {isAdmin ? (
            <div className="space-y-2">
              <button 
                onClick={handleAdminNavigate} 
                className="flex items-center text-gray-400 hover:text-white w-full cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Admin
              </button>
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center text-red-400 hover:text-red-300 w-full cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Partner
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogout} 
              className="flex items-center text-gray-400 hover:text-white w-full cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-900/50 mb-4">
                <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Delete Partner</h3>
              <p className="text-sm text-gray-400 mb-4">
                Are you sure you want to delete this partner? This action cannot be undone and will remove all associated data including products and warehouse allocations.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePartner}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;