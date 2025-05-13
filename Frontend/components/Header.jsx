import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../src/stores/useUserStore';
import { ProfileMenu } from './ProfileMenu';
import { ShoppingCart, Search } from 'lucide-react';
import { useCartStore } from '../src/stores/useCartStore';
import axios from '../lib/axios';

const Header = () => {
  const navigate = useNavigate();
  const { cart } = useCartStore();
  const { user, logout } = useUserStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim().length > 0) {
      try {
        const response = await axios.get(`/products/search?q=${encodeURIComponent(query)}`);
        setSearchResults(response.data);
        setShowResults(true);
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleProductClick = (productId) => {
    setShowResults(false);
    setSearchQuery('');
    navigate(`/product-page/${productId}`);
  };

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
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-4 pr-10 py-2 border border-orange-500 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
            <Search size={18} />
          </button>
          
          {showResults && searchResults.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleProductClick(product._id)}
                  className="p-2 hover:bg-orange-50 cursor-pointer flex items-center gap-2"
                >
                  <img 
                    src={product.imageProduct} 
                    alt={product.productName} 
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{product.productName}</p>
                    <p className="text-sm text-gray-600">${product.pricePerUnit}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
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
              <Link to="/partner-info" className="hover:text-orange-500 transition-colors">
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