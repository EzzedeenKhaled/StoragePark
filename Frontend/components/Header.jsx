
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search } from 'lucide-react';

const Header = () => {
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
            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
            <Search size={18} />
          </button>
        </div>
        
        <div className="flex items-center gap-6">
          <Link to="/partner" className="text-gray-700 hover:text-orange-500 transition-colors">
            Become A Partner
          </Link>
          <Link to="/login" className="text-gray-700 hover:text-orange-500 transition-colors">
            Login
          </Link>
          <Link to="/cart" className="text-gray-700 hover:text-orange-500 transition-colors relative">
            <ShoppingCart size={20} color='orange'/>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
