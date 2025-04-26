import { Heart } from "lucide-react";
import { toast } from "react-hot-toast";
import { useUserStore } from "../src/stores/useUserStore";
const ProductGallery = ({ mainImage, productId   }) => {
  const { user, wishlist, addToWishlist, removeFromWishlist } = useUserStore();

  const handleWishlistClick = async () => {
    if (!user) {
      toast.error("Please log in first");
      return;
    }
console.log("Product ID:", productId);
    const isInWishlist = wishlist.includes(productId);

    try {
      if (isInWishlist) {
        await removeFromWishlist(productId);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(productId);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const isInWishlist = wishlist.includes(productId);

  return (
    <div className="relative bg-white rounded-lg overflow-hidden">
      <button
        onClick={handleWishlistClick}
        className={`absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 ${isInWishlist ? "text-red-500" : "text-gray-400"
          }`}
      >
        <Heart size={20} className="cursor-pointer" />
      </button>
      <img src={mainImage} alt="Product" className="w-full object-cover" />
    </div>
  );
};

export default ProductGallery;