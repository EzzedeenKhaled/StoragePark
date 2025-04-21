import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, Pencil } from 'lucide-react';
import { useUserStore } from '../src/stores/useUserStore';

export function Sidebar() {
  const { user } = useUserStore();
  const location = useLocation();
  const currentPath = location.pathname;
  console.log('Uses:', user);
  const linkClasses = (path) =>
    `flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-orange-50 ${
      currentPath === path ? "bg-orange-100 font-semibold" : ""
    }`;

  return (
    <div className="w-64 min-h-screen border-r border-orange-200 p-4">
      {/* User Profile Section */}
      <div className="flex items-center gap-3 p-3 bg-black text-white rounded-lg mb-6">
        <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
          <img
            src={
              user?.profileImage ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzcsHv578aOlNW5kDRZ5Lc5AZQowEd-fojyQ&s"
            }
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-medium">{user.firstName}</span>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-2">
        <Link to="/order-history" className={linkClasses("/order-history")}>
          <ShoppingCart size={20} /> Order History
        </Link>
        <Link to="/wishlist" className={linkClasses("/wishlist")}>
          <Heart size={20} /> Wishlist
        </Link>
        <Link to="/profile" className={linkClasses("/profile")}>
          <Pencil size={20} /> Update Profile
        </Link>
      </nav>
    </div>
  );
}
