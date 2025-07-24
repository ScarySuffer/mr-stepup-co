// src/components/FilterSortBar.js
import React from "react";
import "./FilterSortBar.css"; // We'll create this next

export default function FilterSortBar({
  selectedBrand,
  setSelectedBrand,
  selectedSize,
  setSelectedSize,
  sortBy,
  setSortBy,
  uniqueBrands,
  uniqueSizes,
}) {
  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
  };

  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="filter-sort-bar">
      <div className="filter-group">
        <label htmlFor="brand-filter">Brand:</label>
        <select id="brand-filter" value={selectedBrand} onChange={handleBrandChange}>
          {uniqueBrands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="size-filter">Size:</label>
        <select id="size-filter" value={selectedSize} onChange={handleSizeChange}>
          {uniqueSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="sort-by">Sort By:</label>
        <select id="sort-by" value={sortBy} onChange={handleSortChange}>
          <option value="default">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
      </div>
    </div>
  );
}