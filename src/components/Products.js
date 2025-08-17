// src/components/Products.js
import React, { useMemo } from 'react';
import ProductCard from './ProductCard';
import productData from './productData';
import './Products.css';

/**
 * Renders the main product list page with a responsive grid of product cards.
 * @param {function} onAddToCart - Handler to add a product to the cart.
 */
export default function Products({ onAddToCart }) {
  const products = useMemo(() => productData, []);

  return (
    <section className="products-section">
      <div className="products-header">
        <h2>Our Products</h2>
        <p className="subtext">Find something you love.</p>
      </div>

      {products.length > 0 ? (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart} 
            />
          ))}
        </div>
      ) : (
        <p className="no-products-message">
          No products found. Please check back later!
        </p>
      )}
    </section>
  );
}
