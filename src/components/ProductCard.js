// src/components/ProductCard.js
import React, { useState } from 'react';
import './ProductCard.css';

/**
 * A reusable React component for displaying a single product card.
 * It features a visual effect when the "Add to basket" button is clicked and
 * a hover effect on the product image.
 *
 * NOTE: For the Bootstrap icon to appear, you must add the following CDN link
 * to your main index.html file's <head> section:
 * <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
 *
 * @param {object} props - The component props.
 * @param {object} props.product - An object containing product details like name, price, and image.
 * @param {string} props.product.name - The name of the product.
 * @param {number} props.product.price - The price of the product.
 * @param {string} props.product.image - The URL of the default product image.
 * @param {string} props.product.hoverImage - The URL of the image to show on hover.
 * @param {Array<number>} props.product.sizes - An array of available sizes.
 * @param {function} props.onAddToCart - The function to call when the "Add to basket" button is clicked.
 */
export default function ProductCard({ product, onAddToCart }) {
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // New state for dropdown visibility

  /**
   * Handles the click event for the "Add to basket" button.
   * It triggers a visual overlay effect and calls the parent's `onAddToCart` handler.
   */
  const handleAddToCart = () => {
    // Only proceed if a size has been selected
    if (!selectedSize) {
      return;
    }

    // Show the "added" overlay
    setIsAdded(true);

    // Call the parent handler to add the product to the cart,
    // passing the selected size as part of the product data
    if (onAddToCart) {
      onAddToCart({ ...product, selectedSize });
    }

    // Hide the overlay after a delay to match the animation
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  // Determine the correct CSS class based on the product's color or a default value.
  const productClass = `product--${product.color || 'blue'}`;

  return (
    <div className={`product ${productClass}`}>
      <div className="product_inner">
        <img
          src={isHovered ? product.hoverImage : product.image}
          alt={product.name}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />
        <p>{product.name}</p>
        <p>Price R{product.price}</p>

        {/* New sizes dropdown section */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="product__size-dropdown-container">
            <button
              className="product__size-dropdown-toggle"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedSize ? `Size: ${selectedSize}` : 'Select Size'}
              <i className={`bi bi-chevron-down ${isDropdownOpen ? 'open' : ''}`}></i>
            </button>
            {isDropdownOpen && (
              <ul className="product__size-dropdown-menu">
                {product.sizes.map((size) => (
                  <li
                    key={size}
                    className="product__size-dropdown-item"
                    onClick={() => {
                      setSelectedSize(size);
                      setIsDropdownOpen(false); // Close dropdown after selection
                    }}
                  >
                    {size}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* The button is now disabled if no size is selected */}
        <button onClick={handleAddToCart} disabled={!selectedSize}>
          <i className="bi bi-cart"></i> Add to basket
        </button>
      </div>
      <div className={`product_overlay ${isAdded ? 'active' : ''}`}>
        <h2>Added to basket</h2>
        <i className="fa fa-check"></i>
      </div>
    </div>
  );
}
