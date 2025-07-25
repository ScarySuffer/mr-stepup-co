// src/components/ProductCard.js
import React, { useState } from "react"; // Import useState hook
import { Link } from "react-router-dom";
import "./ProductCard.css";

export default function ProductCard({ product, onAddToCart }) {
  const {
    id,
    name,
    brand,
    price,
    image, // This is the default/main image
    otherImages = [],
    sizes = [],
  } = product;

  // Use state to manage the currently displayed main image
  // Initialize it with the product's default 'image'
  const [currentMainImage, setCurrentMainImage] = useState(image);

  // Function to handle thumbnail clicks
  const handleThumbnailClick = (imgUrl) => {
    setCurrentMainImage(imgUrl); // Update the state to the clicked thumbnail's URL
  };

  return (
    <div className="product-card">
      {/* Link around the main image for navigation to product details */}
      <Link to={`/product/${id}`} className="product-image-link">
        <img
          src={currentMainImage} // Now dynamically set by state
          alt={name}
          className="product-main-image"
        />
      </Link>

      {/* Thumbnail gallery: Show if there are any otherImages */}
      {otherImages.length > 0 && (
        <div className="thumbnail-gallery">
          {/* Include the main image as the first thumbnail for consistency, if desired.
              Otherwise, just map otherImages.
              Here, we'll map `image` and then `otherImages.slice(0, 2)` to show a total of 3.
              Or, show up to 3 thumbnails from `otherImages`
          */}
          {otherImages.slice(0, 3).map((imgUrl, idx) => (
            <img
              key={idx} // Using index as key is fine for static lists
              src={imgUrl}
              alt={`${name} thumbnail ${idx + 1}`}
              className={`thumbnail ${currentMainImage === imgUrl ? 'selected-thumbnail' : ''}`} // Add a class for selected thumbnail
              onClick={() => handleThumbnailClick(imgUrl)} // Add onClick handler
            />
          ))}
        </div>
      )}

      <div className="product-details-content">
        <h3>{name}</h3>
        <p className="product-brand">{brand}</p>
        <p className="product-price">R{price.toFixed(2)}</p>

        <div className="card-buttons">
          <Link to={`/product/${id}`} className="view-details-btn">
            View Details
          </Link>
          <button
            className="add-to-cart-btn"
            onClick={() => onAddToCart(product, sizes[0] || '', 1)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}