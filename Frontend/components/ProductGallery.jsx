import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { toast } from "react-hot-toast";
import { useUserStore } from "../src/stores/useUserStore";

const ProductGallery = ({ mainImage, productId }) => {
  const { user, addToWishlist, removeFromWishlist } = useUserStore();
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Function to check if product is in the user's wishlist
  const checkWishlist = () => {
    if (user) {
      const wishlistFromStorage = JSON.parse(localStorage.getItem(`wishlist_${user._id}`)) || [];
      setIsInWishlist(wishlistFromStorage.includes(productId));
    } else {
      // If the user is not logged in, use the global wishlist
      const wishlistFromStorage = JSON.parse(localStorage.getItem('wishlist')) || [];
      setIsInWishlist(wishlistFromStorage.includes(productId));
    }
  };

  useEffect(() => {
    checkWishlist(); // Check wishlist when component mounts

    const handleStorageChange = () => {
      checkWishlist(); // Check wishlist when localStorage changes
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [productId, user]);

  const handleWishlistClick = async () => {
    if (!user) {
      toast.error("Please log in first");
      return;
    }

    try {
      let wishlistFromStorage = JSON.parse(localStorage.getItem(`wishlist_${user._id}`)) || [];

      if (isInWishlist) {
        await removeFromWishlist(productId);
        wishlistFromStorage = wishlistFromStorage.filter(id => id !== productId);
        localStorage.setItem(`wishlist_${user._id}`, JSON.stringify(wishlistFromStorage));
        setIsInWishlist(false);
      } else {
        await addToWishlist(productId);
        wishlistFromStorage.push(productId);
        localStorage.setItem(`wishlist_${user._id}`, JSON.stringify(wishlistFromStorage));
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      // toast.error("Something went wrong");
    }
  };

  return (
    <div className="relative bg-white rounded-lg overflow-hidden">
      <button
        onClick={handleWishlistClick}
        className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
      >
        <Heart
          size={20}
          className="cursor-pointer"
          color={isInWishlist ? "#ea384c" : "#9b87f5"}
          fill={isInWishlist ? "#ea384c" : "none"}
        />
      </button>
      <img src={mainImage} alt="Product" className="w-full object-cover" />
    </div>
  );
};

export default ProductGallery;
