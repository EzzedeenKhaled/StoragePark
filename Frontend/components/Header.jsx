import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../src/stores/useUserStore';
import { ProfileMenu } from './ProfileMenu';
import { ShoppingCart, Search } from 'lucide-react';
import { useCartStore } from '../src/stores/useCartStore';

const Header = () => {
  const navigate = useNavigate();
  const { cart } = useCartStore();
  const { user, logout } = useUserStore(); // Add logout function

  const handleCartClick = () => {
    if (cart.length === 0) {
      navigate('/empty-cart');
    } else {
      navigate('/cart');
    }
  };

  const handleRoleNavigation = () => {
    if (user.role === 'partner') {
      navigate('/partner');
    } else if (user.role === 'admin') {
      navigate('/admin');
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="w-full mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="logo">
          <Link to="/">
            <img src="/logo_landing.png" alt="Storage Park Logo" className="h-10" />
          </Link>
        </div>

        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-4 pr-10 py-2 border border-orange-500 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
            <Search size={18} />
          </button>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-6">
          {user ? (
            <>
              {user.role === 'customer' ? (
                <>
                  <ProfileMenu />
                  <button onClick={handleCartClick} className="relative text-gray-700 hover:text-orange-500 transition-colors cursor-pointer">
                    <ShoppingCart size={20} color="orange" />
                    {cart.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-semibold px-1 py-[1px] rounded-full">
                        {cart.length}
                      </span>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleRoleNavigation}
                    className="text-gray-700 hover:text-orange-500 transition-colors cursor-pointer"
                  >
                    {user.role === 'partner' ? 'Partner' : 'Admin'}
                  </button>
                  <button
                    onClick={logout}
                    className="text-gray-700 hover:text-orange-500 transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <Link to="/partner" className="hover:text-orange-500 transition-colors">
                Become A Partner
              </Link>
              <Link to="/login" className="hover:text-orange-500 transition-colors">
                Login
              </Link>
              <button onClick={handleCartClick} className="relative text-gray-700 hover:text-orange-500 transition-colors cursor-pointer">
                <ShoppingCart size={20} color="orange" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;