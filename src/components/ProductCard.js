import React from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card" tabIndex={0}>
      <img src={product.img || product.image} alt={product.name} draggable={false} />
      <h3>{product.name}</h3>
      <p>R{product.price}</p>

      <div className="card-buttons">
        <button onClick={() => onAddToCart(product)}>Add to Cart</button>
        <Link to={`/product/${product.id}`} className="view-details-btn">
          View Details
        </Link>
      </div>
    </div>
  );
}
