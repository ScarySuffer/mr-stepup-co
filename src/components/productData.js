// src/components/ProductCard.js
import React from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <img src={product.image} alt={product.name} className="product-image" />
      </Link>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="brand">{product.brand}</p>
        <p className="price">R{product.price.toFixed(2)}</p>

        <Link to={`/product/${product.id}`} className="details-button">
          View Details
        </Link>

        <button
          className="add-to-cart-btn"
          onClick={() => onAddToCart(product, product.sizes?.[0] || "", 1)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
