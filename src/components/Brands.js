// src/components/Brands.js
import React from "react";
import ProductCard from "./ProductCard";
import  products  from "./productData";
import "./Products.css"; // reuse styles

// Group products by brand
const groupByBrand = (items) => {
  return items.reduce((groups, product) => {
    const brand = product.brand || "Other";
    if (!groups[brand]) groups[brand] = [];
    groups[brand].push(product);
    return groups;
  }, {});
};

export default function Brands() {
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
                onAddToCart={() => alert(`Added ${product.name} to cart!`)}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
