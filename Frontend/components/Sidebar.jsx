import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Pencil, LogOut, ArrowLeft } from 'lucide-react';
import { useUserStore } from '../src/stores/useUserStore';

export function Sidebar() {
  const { user, logout } = useUserStore();
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;

  const linkClasses = (path) =>
    `flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-orange-50 ${
      currentPath === path ? 'bg-orange-100 font-semibold' : ''
    }`;

  const handleLogout = () => {
    logout(); // assumes your store has a logout method
    navigate('/login'); // redirect to login page after logout
  };

  return (
    <div className="w-64 min-h-screen border-r border-orange-200 p-4 flex flex-col justify-between">
      <div>
      <button
            className="text-gray-600 hover:text-gray-800 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={24} />
          </button>
        {/* User Profile Section */}
        <div className="flex items-center gap-3 p-3 bg-black text-white rounded-lg mb-6">
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
            <img
              src={
                user?.profileImage ||
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzcsHv578aOlNW5kDRZ5Lc5AZQowEd-fojyQ&s'
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-medium">{user?.firstName}</span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          <Link to="/order-history" className={linkClasses('/order-history')}>
            <ShoppingCart size={20} /> Order History
          </Link>
          <Link to="/wishlist" className={linkClasses('/wishlist')}>
            <Heart size={20} /> Wishlist
          </Link>
          <Link to="/profile" className={linkClasses('/profile')}>
            <Pencil size={20} /> Update Profile
          </Link>
        </nav>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
      >
        <LogOut size={20} /> Logout
      </button>
    </div>
  );
}
