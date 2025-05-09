import React from 'react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductCardCart = ({ product, inCart, onSale }) => {
  const navigate = useNavigate();

  // Calculate the discounted price
  const discountedPrice = product.pricePerUnit - (product.pricePerUnit * (product.discount / 100));
  const originalPrice = product.pricePerUnit; // Original price is the pricePerUnit

  const handleCardClick = () => {
    navigate(`/product-page/${product._id}`); // Navigate to the product page with the product ID
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden relative transition-transform hover:-translate-y-1 cursor-pointer"
      onClick={handleCardClick} // Add onClick handler to navigate
    >
      {onSale && (
        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
          Sale
        </span>
      )}
      
      {inCart && (
        <div className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md cursor-pointer">
          <Heart size={18} />
        </div>
      )}
      
      <img 
        src={product.imageProduct} 
        alt={product.title || product.productName} // Fallback to productName if title is not available
        className="w-full h-48 object-cover" 
      />
      
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold text-orange-500">
            ${discountedPrice.toFixed(2)} {/* Display the discounted price */}
          </span>
          {product.discount > 0 && (
            <>
              <span className="text-sm text-gray-500 line-through">
                ${originalPrice.toFixed(2)} {/* Display the original price */}
              </span>
              <span className="text-xs text-red-500">
                ({product.discount}% off) {/* Display the discount percentage */}
              </span>
            </>
          )}
        </div>
        <h3 className="text-gray-800 font-medium text-sm line-clamp-2">
          {product.title || product.productName} {/* Fallback to productName if title is not available */}
        </h3>
      </div>
    </div>
  );
};

export default ProductCardCart;