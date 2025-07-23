import React from "react";
import ProductCard from "./ProductCard";
import "./Products.css";

// Import products as default, no curly braces
import products from "./productData";

export default function Products() {
  const handleAddToCart = (product) => {
    alert(`Added ${product.name} to cart!`);
  };

  return (
    <section id="products" className="products-section">
      <h2>Featured Sneakers</h2>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </section>
  );
}
