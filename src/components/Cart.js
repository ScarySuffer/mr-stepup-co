// src/components/Cart.js
import React from "react";
import { Link } from "react-router-dom";
import "./Cart.css";

export default function Cart({ cartItems, onRemoveFromCart, onUpdateQuantity }) {
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <section className="cart-section">
      <h2>Your Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty. Time to find some fresh kicks!</p>
          <Link to="/products" className="cta-button">
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-items-container">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.selectedSize}`} className="cart-item-card">
                <img src={item.image || item.img} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>Size: {item.selectedSize}</p>
                  <p className="item-price">R{item.price.toFixed(2)}</p>
                </div>
                <div className="cart-item-controls">
                  <div className="quantity-control">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                      disabled={item.quantity === 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => onUpdateQuantity(item.id, item.selectedSize, parseInt(e.target.value) || 1)}
                      min="1"
                    />
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="remove-item-btn"
                    onClick={() => onRemoveFromCart(item.id, item.selectedSize)}
                  >
                    Remove
                  </button>
                </div>
                <p className="item-subtotal">Subtotal: R{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Cart Total: R{calculateTotal().toFixed(2)}</h3>
            <div className="cart-actions">
              <Link to="/products" className="continue-shopping-btn">
                Continue Shopping
              </Link>
              {/* UPDATED LINK */}
              <Link to="/checkout" className="checkout-btn">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </>
      )}
    </section>
  );
}