
import ProductCard from './ProductCard';
import '../../src/assets/Styles/ProductGrid.css';

const ProductGrid = ({ products }) => {
  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard 
          product={product}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
