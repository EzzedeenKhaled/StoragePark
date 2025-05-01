
import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import '../../src/assets/Styles/Reviews.css';

// All reviews in a single flat array, with some extras for demo
// const reviews = [
//   {
//     reviewer: 'Julie',
//     rating: 5,
//     comment: "Each item is perfect for my cottage core aesthetic! I can't wait to wear everything!! Seller was very attentive and asked question.",
//     image: 'https://via.placeholder.com/40x40',
//     category: "Women's Clothing & Accessories"
//   },
//   {
//     reviewer: 'Madonna',
//     rating: 5,
//     comment: "The quality is fabulous! Super thick substantial material and fleece lined. The stitching is well done and it's a piece of art.",
//     image: 'https://via.placeholder.com/40x40',
//     category: "Women's Clothing, Fall Style, Winter Dress, Sweater Dress, Cotton Dress"
//   },
//   {
//     reviewer: 'Mariam',
//     rating: 5,
//     comment: "Love all of her clothing and items so comfy and fun!",
//     image: 'https://via.placeholder.com/40x40',
//     category: "Upcycled Butter Soft Oversized Tunic Top, Plus Size Tunic Top Too"
//   },
//   {
//     reviewer: 'Lamia',
//     rating: 5,
//     comment: 'I am updating my review. Although shipping and service was not the best, This blouse is amazing.',
//     image: 'https://via.placeholder.com/40x40',
//     category: 'Linen wrap top reversible crop top for women Tie front or back blouse Open'
//   },
//   {
//     reviewer: 'Joe',
//     rating: 4,
//     comment: 'Very quick shipping and the sweater is really comfortable. Runs a bit large but still good.',
//     image: 'https://via.placeholder.com/40x40?text=J',
//     category: "Casual Sweater"
//   },
//   {
//     reviewer: 'Aliya',
//     rating: 5,
//     comment: "Super soft and fits perfectly, definitely recommend this shop! Loved the packaging, too.",
//     image: 'https://via.placeholder.com/40x40?text=A',
//     category: "Gift Purchase"
//   },
//   {
//     reviewer: 'Chris',
//     rating: 4,
//     comment: "Color is a little different than photo but quality is very nice, would buy again.",
//     image: 'https://via.placeholder.com/40x40?text=C',
//     category: "Women's Jeans"
//   },
//   {
//     reviewer: 'Fatima',
//     rating: 5,
//     comment: "Such lovely pieces, thank you so much! Will order again soon.",
//     image: 'https://via.placeholder.com/40x40?text=F',
//     category: "Accessories & Clothing"
//   },
//   // More reviews for better sliding effect:
//   {
//     reviewer: 'Samir',
//     rating: 5,
//     comment: "Exceptional craftsmanship. My wife loved her gift. Fast shipping!",
//     image: 'https://via.placeholder.com/40x40?text=S',
//     category: 'Gift, Accessories'
//   },
//   {
//     reviewer: 'Lina',
//     rating: 4,
//     comment: "Nice fabric, colors as described. I wish it arrived a bit faster.",
//     image: 'https://via.placeholder.com/40x40?text=L',
//     category: "Summer Clothing"
//   },
//   {
//     reviewer: 'Amir',
//     rating: 5,
//     comment: "Top class! Second time ordering and the fit is always perfect.",
//     image: 'https://via.placeholder.com/40x40?text=Am',
//     category: "Men's Casual"
//   },
//   {
//     reviewer: 'Sophie',
//     rating: 5,
//     comment: "Just wow! Superb details and came beautifully wrapped.",
//     image: 'https://via.placeholder.com/40x40?text=Soph',
//     category: "Accessories"
//   },
//   {
//     reviewer: 'Rania',
//     rating: 4,
//     comment: "Soft and comfy. Shipping took a week longer than expected.",
//     image: 'https://via.placeholder.com/40x40?text=Ra',
//     category: "Loungewear"
//   },
//   {
//     reviewer: 'Adam',
//     rating: 5,
//     comment: "It was a gift for my mom. She absolutely loved it!",
//     image: 'https://via.placeholder.com/40x40?text=Ad',
//     category: "Gift"
//   },
// ];


const ReviewCard = ({ reviewer, rating, comment, productName }) => {
  const stars = '★'.repeat(rating);
  return (
    <div className="review-card animate-fade-in" style={{ minWidth: 275, maxWidth: 350, margin: '0 auto', position:'relative' }}>
      <div className="reviewer-info">
        {/* <div className="reviewer-avatar">
          <img src={image} alt={`${reviewer} avatar`} />
        </div> */}
        <div className="reviewer-name">
          {reviewer} <span className="stars">{stars}</span>
        </div>
      </div>
      <div className="review-content">
        <p>{comment}</p>
      </div>
      <div className="review-category">
        <span className="category-tag">{productName}</span>
      </div>
    </div>
  );
};

const Reviews = ({ reviews }) => {
  const [startIdx, setStartIdx] = useState(0);
  const VISIBLE_COUNT = 3;

  const totalReviews = reviews.length;

  const nextReview = () => {
    setStartIdx((prev) => (prev + VISIBLE_COUNT) % totalReviews);
  };

  const prevReview = () => {
    setStartIdx((prev) => (prev - VISIBLE_COUNT + totalReviews) % totalReviews);
  };

  const visibleReviews = reviews.slice(startIdx, startIdx + VISIBLE_COUNT);
  if (visibleReviews.length < VISIBLE_COUNT) {
    visibleReviews.push(...reviews.slice(0, VISIBLE_COUNT - visibleReviews.length));
  }

  return (
    <div className="reviews-section" style={{ position: 'relative', minHeight: '350px' }}>
      <div className="reviews-header">
        <h2 className="reviews-title">Review spotlight</h2>
        <div className="info-icon">i</div>
        <p className="reviews-description">
          Here is a selection of four-star and five-star reviews from customers who were delighted with the products they found in this category.
        </p>
      </div>

      <div className="flex items-center justify-center" style={{ position: 'relative', minHeight: 240 }}>
        {/* Left Arrow */}
        <button
          onClick={prevReview}
          aria-label="Previous review"
          style={arrowButtonStyle('left')}
          className="nav-button hover-scale"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Review Cards */}
        <div style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
          maxWidth: 1200
        }}>
          {visibleReviews.map((review, idx) => {
            // Spread the review properties into the ReviewCard component
            const { user, rating, comment, item } = review;
            return (
              <ReviewCard
                key={startIdx + '-' + idx}
                reviewer={user?.firstName}
                rating={rating}
                comment={comment}
                productName={item?.productName}
              />
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={nextReview}
          aria-label="Next review"
          style={arrowButtonStyle('right')}
          className="nav-button hover-scale"
        >
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Page Indicators */}
      <div className="reviews-pages-indicator" style={{ textAlign: 'center', marginTop: '10px' }}>
        {Array.from({ length: Math.ceil(totalReviews / VISIBLE_COUNT) }).map((_, idx) => (
          <span
            key={idx}
            style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: idx === Math.floor(startIdx / VISIBLE_COUNT) ? '#333' : '#ccc',
              margin: '0 4px'
            }}
          ></span>
        ))}
      </div>
    </div>
  );
};


const arrowButtonStyle = (side) => ({
  position: 'absolute',
  [side]: -24,
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 2,
  background: '#fff',
  border: '1px solid #ddd',
  borderRadius: '50%',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  width: 40,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});


export default Reviews;

