// src/components/ProductCard.js
import React from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";

export default function ProductCard({ product, onAddToCart }) {
  const {
    id,
    name,
    brand,
    price,
    image,
    otherImages = [],
    sizes = [],
  } = product;

     console.log("ProductCard for product ID:", id, "image URL:", image);

  // Removed: const fallbackImage = "/assets/fallback.jpg";

  return (
    <div className="product-card">
      <Link to={`/product/${id}`}>
        <img
          src={image} // Changed from src={image || fallbackImage} to src={image}
          alt={name}
          className="product-image"
        />
      </Link>

      {otherImages.length > 0 && (
        <div className="thumbnail-gallery">
          {otherImages.slice(0, 3).map((imgUrl, idx) => (
            <img
              key={idx}
              src={imgUrl}
              alt={`${name} view ${idx + 1}`}
              className="thumbnail"
            />
          ))}
        </div>
      )}

      <div className="product-info">
        <h3>{name}</h3>
        <p className="brand">{brand}</p>
        <p className="price">R{price.toFixed(2)}</p>

        <Link to={`/product/${id}`} className="view-details-btn">
          View Details
        </Link>

        <button
          className="add-to-cart-btn"
          onClick={() => onAddToCart(product, sizes[0] || "", 1)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}