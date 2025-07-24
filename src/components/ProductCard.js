// src/components/ProductCard.js
import React from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";

// Now onAddToCart will receive the product directly from Products/Brands,
// and we'll pass a default size for simplicity for the card's button
export default function ProductCard({ product, onAddToCart }) {
  // For the ProductCard's direct "Add to Cart" button,
  // we can assume a default size or prompt the user.
  // For now, let's just pick the first available size, or a default 'One Size'
  const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'One Size';

  return (
    <div className="product-card" tabIndex={0}>
      <img src={product.img || product.image} alt={product.name} draggable={false} />
      <h3>{product.name}</h3>
      <p>R{product.price}</p>

      <div className="card-buttons">
        {/* Pass product and a default size to handleAddToCart */}
        <button onClick={() => onAddToCart(product, defaultSize)}>Add to Cart</button>
        <Link to={`/product/${product.id}`} className="view-details-btn">
          View Details
        </Link>
      </div>
    </div>
  );
}