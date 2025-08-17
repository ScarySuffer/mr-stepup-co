// src/components/Home.js
import React from "react";
import Hero from "./Hero";
import ProductCard from "./ProductCard"; // Assuming ProductCard is used directly
import "./Home.css"; 
import BrandCarousel from "./BrandCarousel";
import products from "./productData"; // Make sure this points to your full product dataset

export default function Home({ onAddToCart, filteredProducts }) { 
  // Use filteredProducts if provided (e.g., from search), otherwise show all products
  const productsToShow = filteredProducts?.length
    ? filteredProducts.slice(0, 8)
    : products.slice(0, 8); // Show top 8 products if no filter

  return (
    <div className="home-container">
      <Hero />
      <BrandCarousel />

      <section id="featured-products" className="products-section" style={{ marginTop: '2rem' }}>
        <div className="hero-content">
          <h1>Step Up Your Sneaker Game</h1>
          <a href="/products" className="cta-button">
            Shop Now
          </a>
        </div>

        <h2>Featured Sneakers</h2>

        {productsToShow.length === 0 && (
          <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#666', marginTop: '2rem' }}>
            No featured sneakers found matching your search.
          </p>
        )}

        <div className="products-grid">
          {productsToShow.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart} 
            />
          ))}
        </div>
      </section>
    </div>
  );
}
