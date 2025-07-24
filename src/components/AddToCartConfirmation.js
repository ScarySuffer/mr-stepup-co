// src/components/AddToCartConfirmation.js
import React, { useEffect, useState } from 'react';

export default function AddToCartConfirmation({ show, message, duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show); // Update visibility when 'show' prop changes

    let timer;
    if (show) {
      timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) {
          onClose(); // Call the parent's onClose to reset its state
        }
      }, duration);
    }

    return () => {
      clearTimeout(timer); // Clean up the timer if component unmounts or 'show' changes
    };
  }, [show, duration, onClose]);

  if (!isVisible) {
    return null; // Don't render if not visible
  }

  return (
    <div className="add-to-cart-confirmation-message">
      <p>{message}</p>
      <button className="close-confirmation-button" onClick={() => { setIsVisible(false); if (onClose) onClose(); }}>
        &times;
      </button>
    </div>
  );
}