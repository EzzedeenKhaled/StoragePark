import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useUserStore } from '../../src/stores/useUserStore';
import { toast } from 'react-hot-toast';
import '../../src/assets/Styles/ProductCard.css';
import axios from '../../lib/axios';

const ProductCard = ({ product }) => {
  console.log("ProductCard product:", product);
  const { user, addToWishlist, removeFromWishlist } = useUserStore();
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    if (!user) {
      setLiked(false);
      return;
    }

    const wishlistFromStorage = JSON.parse(localStorage.getItem(`wishlist_${user._id}`)) || [];
    setLiked(wishlistFromStorage.includes(product._id));
  }, [product._id, user]);

  const displayPercentOff = product?.discount;
  const isOnSale = product?.discount > 0;
  const discountPrice = isOnSale 
    ? product?.pricePerUnit - (product?.pricePerUnit * (displayPercentOff / 100))
    : product?.pricePerUnit;

  const handleWishlistClick = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in first");
      return;
    }

    try {
      let wishlistFromStorage = JSON.parse(localStorage.getItem(`wishlist_${user._id}`)) || [];

      if (liked) {
        await removeFromWishlist(product._id);
        wishlistFromStorage = wishlistFromStorage.filter(id => id !== product._id);
        // toast.success("Removed from wishlist");
      } else {
        await addToWishlist(product._id);
        if (!wishlistFromStorage.includes(product._id)) {
          wishlistFromStorage.push(product._id);
        }
        // toast.success("Added to wishlist");
      }

      localStorage.setItem(`wishlist_${user._id}`, JSON.stringify(wishlistFromStorage));
      setLiked(!liked);
    } catch (error) {
      console.error("Error updating wishlist:", error);
      // toast.error("Something went wrong");
    }
  };
  const handleClick = async () => {
    try {
      const res = await axios.get(`/customers/${product._id}/status`);
      const isActive = res.data?.isActive;

      if (isActive) {
        navigate(`/product-page/${product._id}`);
      } else {
        navigate("/notFound")
      }
    } catch (error) {
      console.error("Error checking product status:", error);
      toast.error("Failed to verify product status.");
    }
  };

  return (
    <div className="product-card" style={{ position: 'relative', paddingTop: '16px' }}>
      {isOnSale && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            background: '#ea384c',
            color: '#fff',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 700,
            padding: '3px 10px',
            zIndex: 2,
            boxShadow: '0 1px 6px rgba(0,0,0,0.06)'
          }}
        >
          SALE
        </div>
      )}

      <button
        type="button"
        aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
        onClick={handleWishlistClick}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 2,
          background: 'rgba(255,255,255,0.90)',
          border: 'none',
          borderRadius: '50%',
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: liked ? '0 2px 8px #ea384c33' : '0 2px 8px rgba(0,0,0,0.05)'
        }}
        className="hover-scale"
      >
        <Heart
          color={liked ? "#ea384c" : "#9b87f5"}
          fill={liked ? "#ea384c" : "none"}
          size={22}
          strokeWidth={2}
          className='cursor-pointer'
        />
      </button>

      <div onClick={handleClick} className="product-link cursor-pointer">
        <div className="product-image">
          <img src={product?.imageProduct} alt="Product" />
        </div>
        <div className="product-info" style={{ position: 'relative', minHeight: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              className="product-price"
              style={{ color: isOnSale ? '#ea384c' : '#f60', fontWeight: 700 }}
            >
              {discountPrice?.toFixed(2)}$
            </span>
            {isOnSale && (
              <>
                <span
                  style={{
                    textDecoration: 'line-through',
                    color: '#bbb',
                    fontSize: 14,
                    fontWeight: 400
                  }}
                >
                  {product?.pricePerUnit}$
                </span>
                <span
                  style={{
                    marginLeft: 3,
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#ea384c',
                    background: '#ffe4ea',
                    borderRadius: 4,
                    padding: '1px 7px'
                  }}
                >
                  -{displayPercentOff}%
                </span>
              </>
            )}
          </div>
          <h3 className="product-name">{product?.productName}</h3>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
