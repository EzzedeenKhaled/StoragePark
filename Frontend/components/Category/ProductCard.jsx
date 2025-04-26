import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useUserStore } from '../../src/stores/useUserStore';
import { toast } from 'react-hot-toast'; // Make sure you have toast
import '../../src/assets/Styles/ProductCard.css';

const ProductCard = ({ product }) => {
  // console.log("ProductCard", product);
  const { user, wishlist, addToWishlist, removeFromWishlist, getWishlist } = useUserStore();
  console.log('wishlist', wishlist);
  const [liked, setLiked] = useState(wishlist.includes(product._id));
  // useEffect(() => {
  //   setLiked(wishlist.includes(product._id));
  // }, [wishlist, product._id]);
  // useEffect(() => {
  //   getWishlist(); // Fetch wishlist once when the app loads
  // }, []);
  // If percentOff is provided, use it directly, otherwise calculate it
  const displayPercentOff = product?.discount;
  
  // If onSale flag is provided, use it, otherwise determine from prices
  const isOnSale = product?.discount > 0 ? true : false;

  const discountPrice = product?.discount ? product?.pricePerUnit - (product?.pricePerUnit * (displayPercentOff / 100)) : product?.pricePerUnit;

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please log in first");
      return;
    }
    // console.log("handleWishlistClick", product._id);
    const isInWishlist = wishlist.includes(product._id);
    // console.log("isInWishlist", isInWishlist);
    try {
      if (isInWishlist) {
        await removeFromWishlist(product._id);
        setLiked(false);
        // toast.success("Removed from wishlist");
      } else {
        await addToWishlist(product._id);
        setLiked(true);
        // toast.success("Added to wishlist");
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      // toast.error("Something went wrong");
    }
  };

  return (
    <div className="product-card" style={{ position: 'relative', paddingTop: '16px' }}>
      {/* Sale tag */}
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
      {/* Heart Icon */}
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
      {/* Product Card Content */}
      <Link to={`/product-page/${product?._id}`} className="product-link">
        <div className="product-image">
          <img src={product?.imageProduct} alt="Product" />
        </div>
        <div className="product-info" style={{ position: 'relative', minHeight: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* If sale, show new price, strikethrough old, percent off */}
            <span className="product-price" style={{ color: isOnSale ? '#ea384c' : '#f60', fontWeight: 700 }}>
              {discountPrice}$
            </span>
            {isOnSale && product?.pricePerUnit && (
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
                {displayPercentOff && (
                  <span
                    style={{
                      marginLeft: 3,
                      fontSize: 13,
                      fontWeight: 500,
                      color: '#ea384c',
                      background: '#ffe4ea',
                      borderRadius: 4,
                      padding: '1px 7px'
                    }}>
                    -{displayPercentOff}%
                  </span>
                )}
              </>
            )}
          </div>
          <h3 className="product-name">{product?.productName}</h3>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
