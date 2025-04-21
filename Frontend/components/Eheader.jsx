import React from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../src/stores/useUserStore';
import { ProfileMenu } from './ProfileMenu';

function Eheader() {
  const { user } = useUserStore();

  return (
    <div>
      <header className="flex justify-between items-center px-5 py-3">
        {/* Logo */}
        <div className="flex items-center font-bold">
          <Link to="/">
          <img src="/logo_b.png" alt="Storage Park Logo" className="w-24 mr-2" />
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex items-center relative">
          <input 
            type="text" 
            placeholder="Search" 
            className="w-[300px] rounded-full border border-orange-500 px-4 py-2"
          />
          <button className="absolute right-3">
            🔍
          </button>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <ProfileMenu />
              <span className="cursor-pointer">🛒</span>
            </>
          ) : (
            <>
              <Link to="/partner" className="hover:text-orange-500 transition-colors">
                Become A Partner
              </Link>
              <Link to="/login" className="hover:text-orange-500 transition-colors">
                Login
              </Link>
              <span className="cursor-pointer">🛒</span>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative mt-5">
        <img 
          src="/hero-image.png" 
          alt="Order Tracking Hero Image" 
          className="w-full"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center bg-black/50">
          <h1 className="text-4xl font-bold mb-2">Order Tracking Made Simple</h1>
          <p className="text-xl mb-5">Real-Time Updates at Your Fingertips</p>
          <button 
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded"
          >
            Track Your Order
          </button>
        </div>
      </section>
    </div>
  );
}

export default Eheader;