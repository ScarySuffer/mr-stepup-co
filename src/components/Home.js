// src/components/Home.js
import React from "react";
import Hero from "./Hero";
import ProductCard from "./ProductCard"; // Assuming ProductCard is used directly
import "./Home.css"; // Your Home specific styles
// No longer import productData directly here if using filteredProducts
// import products from "./productData";

export default function Home({ onAddToCart, filteredProducts }) { // Receive filteredProducts
  // If Home is supposed to show *all* products on initial load,
  // and only filter when a search term is active, you'll use filteredProducts.
  // Otherwise, you might want to slice `products` for just "featured".
  // For consistency with search, let's use filteredProducts for now.
  const productsToShow = filteredProducts.slice(0, 8); // Example: show top 8 filtered products

  return (
    <div className="home-container">
      <Hero />
      <section id="featured-products" className="products-section" style={{marginTop: '2rem'}}>
        <div className="hero-content">
        <h1>Step Up Your Sneaker Game</h1>
        <a href="/products" className="cta-button">
          Shop Now
        </a>
      </div>
        <h2>Featured Sneakers</h2>
        {productsToShow.length === 0 && (
            <p style={{textAlign: 'center', fontSize: '1.2rem', color: '#666', marginTop: '2rem'}}>
                No featured sneakers found matching your search.
            </p>
        )}
        <div className="products-grid">
          {productsToShow.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      </section>
    </div>
  );
}