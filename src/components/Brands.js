// src/components/Brands.js
import React from "react";
import ProductCard from "./ProductCard";
import products from "./productData";
import "./Products.css";
import "./Brands.css"; // Ensure this is imported

const groupByBrand = (items) => {
  return items.reduce((groups, product) => {
    const brand = product.brand && typeof product.brand === 'string' ? product.brand : "Other";
    if (!groups[brand]) groups[brand] = [];
    groups[brand].push(product);
    return groups;
  }, {});
};

export default function Brands({ onAddToCart }) {
  const productsByBrand = groupByBrand(products);

  return (
    <section className="brands-section">
      <h2 className="brands-title">Sneakers by Brand</h2>
      {Object.entries(productsByBrand).map(([brand, items]) => (
        <div key={brand} className="brand-group">
          <h3 className="brand-heading">{brand}</h3>
          <div className="products-grid">
            {items.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}