import { useRef } from 'react';
import '../src/assets/Styles/ProductCarousel.css';
import { useNavigate } from 'react-router-dom';
import ProductCard from './Category/ProductCard';
import { Link } from 'react-router-dom';

function ProductCarousel({ products, categories, title, wishlist }) {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const scrollItemWidth = () => {
    if (containerRef.current) {
      const item = containerRef.current.querySelector('.product-card, .category-card');
      return item ? item.getBoundingClientRect().width : 0;
    }
    return 0;
  };

  const scrollLeft = () => {
    if (containerRef.current) {
      const itemWidth = scrollItemWidth();
      containerRef.current.scrollLeft -= itemWidth;
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      const itemWidth = scrollItemWidth();
      containerRef.current.scrollLeft += itemWidth;
    }
  };
  
  return (
    <section className="product">
      <h2 className="product-category">{title}</h2>
      <button className="pre-btn" onClick={scrollLeft}>
        <img src="/arrow.png" alt="Previous" />
      </button>
      <button className="nxt-btn" onClick={scrollRight}>
        <img src="/arrow.png" alt="Next" />
      </button>

      <div className="product-container" ref={containerRef}>
        {products &&
          products.map((product) => (
            <ProductCard key={product._id || product.id} product={product} wishlist={wishlist} />
          ))}

        {categories &&
          categories.map((category, index) => (
            <div className="category-card cursor-pointer" key={index}>
              <Link to={`/category/${category.name}`} className="category-link">
                <div className="category-image">
                  <img 
                    src={category.image}
                    alt={category.name} 
                    className="category-thumb"
                  />
                </div>
                <h3>{category.name}</h3>
              </Link>
            </div>
          ))}
      </div>
    </section>
  );
}

export default ProductCarousel;