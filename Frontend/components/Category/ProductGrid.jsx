import { useState } from "react";
import ProductCard from "./ProductCard";
import "../../src/assets/Styles/ProductGrid.css";

const ProductGrid = ({ products, sortOption }) => {
  // Sort products based on the selected option
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === "priceLowToHigh") {
      return a.pricePerUnit - b.pricePerUnit;
    } else if (sortOption === "priceHighToLow") {
      return b.pricePerUnit - a.pricePerUnit;
    } else if (sortOption === "nameAZ") {
      return a.productName.localeCompare(b.productName);
    } else if (sortOption === "nameZA") {
      return b.productName.localeCompare(a.productName);
    }
    return 0; // Default order (relevancy)
  });

  return (
    <div className="product-grid">
      {sortedProducts.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;