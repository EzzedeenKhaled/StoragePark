
import React from 'react';
import { Heart } from 'lucide-react';

const ProductCardCart = ({ product, inCart, onSale }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden relative transition-transform hover:-translate-y-1">
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
        src={product.image} 
        alt={product.title}
        className="w-full h-48 object-cover" 
      />
      
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold text-orange-500">${product.price}</span>
          {product.originalPrice && (
            <>
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
              <span className="text-xs text-red-500">({product.discount}% off)</span>
            </>
          )}
        </div>
        <h3 className="text-gray-800 font-medium text-sm line-clamp-2">{product.title}</h3>
      </div>
    </div>
  );
};

export default ProductCardCart;
