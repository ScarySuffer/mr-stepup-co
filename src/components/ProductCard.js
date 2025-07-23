import React from "react";
import "./ProductCard.css";

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card" tabIndex={0}>
      <img src={product.image} alt={product.name} draggable={false} />
      <h3>{product.name}</h3>
      <p>R {product.price.toFixed(2)}</p>
      <button onClick={() => onAddToCart(product)}>Add to Cart</button>
    </div>
  );
}
