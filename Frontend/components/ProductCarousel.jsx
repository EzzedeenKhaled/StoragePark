import { useRef } from 'react';
import '../src/assets/Styles/ProductCarousel.css';

function ProductCarousel({ products, categories, title }) {
  const containerRef = useRef(null);

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
            <div className="product-card cursor-pointer" key={product.id}>
              <div className="product-image">
                {product.discount > 0 && (
                  <span className="discount-tag">{product.discount}% off</span>
                )}
                <img src={product.image} className="product-thumb" alt={product.name} />
              </div>
              <div className="product-info">
                <h2 className="product-brand">{product.name}</h2>
                <span className="price">${product.price}</span>
                {product.originalPrice && (
                  <span className="actual-price">${product.originalPrice}</span>
                )}
              </div>
            </div>
          ))}

        {categories &&
          categories.map((category, index) => (
            <div className="category-card cursor-pointer" key={index}>
              <div className="icon-placeholder"></div>
              <h3>{category}</h3>
            </div>
          ))}
      </div>
    </section>
  );
}

export default ProductCarousel;
