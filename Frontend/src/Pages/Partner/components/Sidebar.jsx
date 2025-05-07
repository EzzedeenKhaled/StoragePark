import { NavLink, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../../stores/useUserStore';

const Sidebar = () => {
  const { logout } = useUserStore();
  const navigate = useNavigate();

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

  return (
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
          to="/partner-dashboard" 
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
          <button 
            onClick={handleAdminNavigate} 
            className="flex items-center text-gray-400 hover:text-white w-full cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Admin
          </button>
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
  );
};

export default Sidebar;