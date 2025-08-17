// src/components/FeaturedProducts.js
import React from "react";
import ProductCard from "./ProductCard";
import products from "../data/productData"; // make sure this points to your productData.js
import "./FeaturedProducts.css";

export default function FeaturedProducts({ onAddToCart }) {
  // Show all products for “all brands”
  const productsToShow = products; // remove any brand filtering here

  return (
    <section className="featured-products">
      <h2>Featured Sneakers - All Brands</h2>
      {productsToShow.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="product-grid">
          {productsToShow.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
      <div className="cta-container">
        <a href="/products" className="cta-button">
          View All Products
        </a>
      </div>
    </section>
  );
}
