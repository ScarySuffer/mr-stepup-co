// src/components/Products.js
import React from "react";
import ProductCard from "./ProductCard";
import FilterSortBar from "./FilterSortBar";
import "./Products.css";

export default function Products({
  onAddToCart,
  productsToDisplay,
  // PROPS FOR FILTER/SORT
  selectedBrand,
  setSelectedBrand,
  selectedSize,
  setSelectedSize,
  sortBy,
  setSortBy,
  uniqueBrands,
  uniqueSizes,
}) {
  return (
    <section id="products" className="products-section">
      <h2>Our Complete Collection</h2>
      <FilterSortBar
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        sortBy={sortBy}
        setSortBy={setSortBy}
        uniqueBrands={uniqueBrands}
        uniqueSizes={uniqueSizes}
      />

      {productsToDisplay.length === 0 && (
        <p className="no-products-message">
          No sneakers found matching your search, filters, or sorting criteria.
        </p>
      )}
      <div className="products-grid">
        {productsToDisplay.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
}