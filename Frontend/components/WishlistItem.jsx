import React from 'react';
import { useCartStore } from '../src/stores/useCartStore';
import { useUserStore } from '../src/stores/useUserStore';
import { LoadingSpinner } from './LoadingSpinner';
import { toast } from 'react-hot-toast';

export function WishlistItem({ wishlist }) {
  const { addToCart } = useCartStore();
  const { removeFromWishlist, loading, getWishlist, user } = useUserStore();
  
  // Handle removing item from wishlist
  const handleRemove = async (productId) => {
    try {
      // Get the user's wishlist from localStorage
      let wishlistFromStorage = JSON.parse(localStorage.getItem(`wishlist_${user._id}`)) || [];

      // Remove from wishlist in the store
      await removeFromWishlist(productId);

      // Remove the product from localStorage wishlist
      wishlistFromStorage = wishlistFromStorage.filter(id => id !== productId);
      localStorage.setItem(`wishlist_${user._id}`, JSON.stringify(wishlistFromStorage));

      // Optionally, refresh the wishlist from the store if needed
      await getWishlist(); // Refresh the wishlist from the store

      // toast.success("Item removed from wishlist");
    } catch (error) {
      console.error("Failed to remove item:", error);
      // toast.error("Failed to remove item from wishlist");
    }
  };

  if (loading) return <LoadingSpinner />;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wishlist.map((item) => (
        <div key={item._id} className="border border-orange-200 rounded-lg p-6 flex flex-col justify-between">
          <div>
            <div className="w-full h-48 bg-gray-100 rounded-lg mb-4">
              <img 
                src={item.imageProduct} 
                alt={item.productName} 
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/placeholder-product.png';
                }}
              />
            </div>
            <h3 className="text-lg font-semibold mb-2">{item.productName}</h3>
            <p className="text-gray-600 mb-4">
              ${item.pricePerUnit ? item.pricePerUnit.toFixed(2) : "0.00"}
            </p>
            <p className={`text-sm ${item.quantity > 0 ? 'text-green-600' : 'text-red-600'}`} >
              {item.quantity > 0 ? 'In Stock' : 'Out of Stock'}
            </p>
          </div>
          <div className="mt-4 space-y-2">
            <button
              className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition-colors cursor-pointer"
              onClick={() => addToCart(item._id)} 
            >
              Add to Cart
            </button>
            <button
              className="w-full border border-red-500 text-red-500 py-2 px-4 rounded hover:bg-red-50 transition-colors cursor-pointer"
              onClick={() => handleRemove(item._id)}
            >
              Remove from Wishlist
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
