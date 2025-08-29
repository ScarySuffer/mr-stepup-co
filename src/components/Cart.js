import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "./Cart.css";

export default function Cart({ cartItems, setCartItems, onUpdateQuantity }) {
  const { currentUser, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);

  // ----------------------------
  // Sync cart to Firestore or localStorage
  // ----------------------------
  const syncCart = useCallback(
    async (updatedCart) => {
      if (!currentUser) {
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        console.log("[Cart] Guest cart saved to localStorage:", updatedCart);
        return;
      }

      const userRef = doc(db, "users", currentUser.uid);

      try {
        await setDoc(
          userRef,
          { cart: updatedCart },
          { merge: true }
        );
        console.log(`[Cart] Cart synced to Firestore for user ${currentUser.uid}:`, updatedCart);
      } catch (err) {
        console.error("[Cart] Error saving cart to Firestore:", err);
      }
    },
    [currentUser]
  );

  // ----------------------------
  // Load cart on mount
  // ----------------------------
  useEffect(() => {
    const loadCart = async () => {
      let localCart = JSON.parse(localStorage.getItem("cart")) || [];

      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);

        try {
          const docSnap = await getDoc(userRef);
          let firestoreCart = [];
          if (docSnap.exists()) {
            firestoreCart = docSnap.data().cart || [];
          } else {
            await setDoc(userRef, { cart: [], pastOrders: [] });
            console.log(`[Cart] User document created for ${currentUser.uid}`);
          }

          // Merge Firestore cart with local cart (avoid duplicates)
          const mergedCart = [...firestoreCart];

          localCart.forEach(localItem => {
            if (!firestoreCart.some(f => f.id === localItem.id && f.selectedSize === localItem.selectedSize)) {
              mergedCart.push(localItem);
            }
          });

          setCartItems(mergedCart);
          syncCart(mergedCart);
          console.log(`[Cart] Loaded and merged cart for user ${currentUser.uid}:`, mergedCart);

        } catch (err) {
          console.error("[Cart] Error loading cart:", err);
          setCartItems(localCart);
        }
      } else {
        setCartItems(localCart);
        console.log("[Cart] Loaded guest cart from localStorage:", localCart);
      }

      setLoading(false);
    };

    if (!authLoading) loadCart();
  }, [currentUser, authLoading, setCartItems, syncCart]);

  // ----------------------------
  // Sync cart whenever cartItems changes
  // ----------------------------
  useEffect(() => {
    if (!loading && !authLoading) {
      console.log("[Cart] Syncing cart due to cartItems change:", cartItems);
      syncCart(cartItems);
    }
  }, [cartItems, syncCart, loading, authLoading]);

  // ----------------------------
  // Helpers
  // ----------------------------
  const calculateTotal = () =>
    cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);

  const handleQuantityChange = (item, value) => {
    const qty = parseInt(value, 10);
    if (!isNaN(qty) && qty >= 1) onUpdateQuantity(item.id, item.selectedSize, qty);
  };

  const handleRemoveFromCart = (item) => {
    const updatedCart = cartItems.filter(
      i => !(i.id === item.id && i.selectedSize === item.selectedSize)
    );
    setCartItems(updatedCart);
    syncCart(updatedCart);
    console.log("[Cart] Item removed, updated cart:", updatedCart);
  };

  if (loading || authLoading) return <p>Loading cart...</p>;

  return (
    <section className="cart-section">
      <h2>Your Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty. Time to find some fresh kicks!</p>
          <Link to="/products" className="cta-button">Start Shopping</Link>
        </div>
      ) : (
        <>
          <div className="cart-items-container">
            {cartItems.map(item => (
              <div key={`${item.id}-${item.selectedSize}`} className="cart-item-card">
                <img src={item.image || item.img} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>Size: {item.selectedSize}</p>
                  <p className="item-price">R{(item.price || 0).toFixed(2)}</p>
                </div>
                <div className="cart-item-controls">
                  <div className="quantity-control">
                    <button onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity - 1)} disabled={item.quantity === 1}>-</button>
                    <input type="number" value={item.quantity} min="1" onChange={e => handleQuantityChange(item, e.target.value)} />
                    <button onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity + 1)}>+</button>
                  </div>
                  <button className="remove-item-btn" onClick={() => handleRemoveFromCart(item)}>Remove</button>
                </div>
                <p className="item-subtotal">Subtotal: R{((item.price || 0) * (item.quantity || 0)).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Cart Total: R{calculateTotal().toFixed(2)}</h3>
            <div className="cart-actions">
              <Link to="/products" className="continue-shopping-btn">Continue Shopping</Link>
              <Link to="/checkout" className="checkout-btn">Proceed to Checkout</Link>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
