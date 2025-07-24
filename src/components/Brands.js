// src/components/Brands.js
import React from "react";
import ProductCard from "./ProductCard";
import products from "./productData";
import "./Products.css"; 
import "./Brands.css"; 
const groupByBrand = (items) => {
  return items.reduce((groups, product) => {
    const brand = product.brand || "Other";
    if (!groups[brand]) groups[brand] = [];
    groups[brand].push(product);
    return groups;
  }, {});
};

// Brands component also receives onAddToCart as a prop
export default function Brands({ onAddToCart }) { // Destructure onAddToCart
  const productsByBrand = groupByBrand(products);

  return (
    <section className="brands-section" style={{ padding: "2rem" }}>
      <h2>Sneakers by Brand</h2>
      {Object.entries(productsByBrand).map(([brand, items]) => (
        <div key={brand} style={{ marginBottom: "3rem" }}>
          <h3 style={{ marginBottom: "1rem" }}>{brand}</h3>
          <div className="products-grid">
            {items.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                // Pass the function down. ProductCard will use a default size.
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}