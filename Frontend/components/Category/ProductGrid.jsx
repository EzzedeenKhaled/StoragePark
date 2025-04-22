
import ProductCard from './ProductCard';
import '../../src/assets/Styles/ProductGrid.css';

const ProductGrid = ({ products }) => {
  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard 
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          image={product.image}
          originalPrice={product.originalPrice}
          onSale={product.onSale}
          percentOff={product.percentOff}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
