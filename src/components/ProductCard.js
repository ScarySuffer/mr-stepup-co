// src/components/ProductCard.js
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";

export default function ProductCard({ product, onAddToCart }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [buttonState, setButtonState] = useState('initial'); // 'initial', 'shake', 'added'
  const intervalRef = useRef(null);

  useEffect(() => {
    setCurrentImageIndex(0);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [product.id]);

  const handleMouseEnterImage = () => {
    if (product.galleryImages?.length > 1) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex(
          (prev) => (prev + 1) % product.galleryImages.length
        );
      }, 800);
    }
  };

  const handleMouseLeaveImage = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrentImageIndex(0);
  };

  const handleAddToCart = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      setButtonState('shake');
      setTimeout(() => setButtonState('initial'), 800);
      return;
    }

    setButtonState('added');
    if (onAddToCart) onAddToCart(product, selectedSize || null, 1);
    setTimeout(() => {
      setButtonState('initial');
      setSelectedSize(null);
    }, 1500);
  };

  const displayedImage =
    product.galleryImages?.length > 0
      ? product.galleryImages[currentImageIndex]
      : product.image;

  const getButtonText = () => {
    if (buttonState === 'added') return "Added to basket";
    if (buttonState === 'shake') return "Select a Size";
    return "Add to basket";
  };

  const getButtonClass = () => {
    let className = 'add-to-cart-btn';
    if (buttonState === 'added') className += ' added';
    if (buttonState === 'shake') className += ' shake';
    return className;
  };

  return (
    <div className={`product product--${product.color || "blue"}`}>
      <div className="product_inner">
        {/* Hidden Badge */}
        {product.hidden && (
          <span className="product-hidden-badge">Out of stock</span>
        )}

        <Link
          to={`/products/${product.id}`}
          className="product-image-link"
          onMouseEnter={handleMouseEnterImage} 
          onMouseLeave={handleMouseLeaveImage}
        >
          <img src={displayedImage} alt={product.name} />
        </Link>

        <p className="product-name">{product.name}</p>
        <p className="product-price">Price R{product.price}</p>

        {product.sizes?.length > 0 && (
          <div className="product__size-dropdown-container">
            <button
              className="product__size-dropdown-toggle"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
            >
              {selectedSize ? `Size: ${selectedSize}` : "Select Size"}
              <i className={`bi bi-chevron-down ${isDropdownOpen ? "open" : ""}`}></i>
            </button>

            {isDropdownOpen && (
              <ul className="product__size-dropdown-menu" role="listbox">
                {product.sizes.map((size) => (
                  <li
                    key={size}
                    className="product__size-dropdown-item"
                    onClick={() => {
                      setSelectedSize(size);
                      setIsDropdownOpen(false);
                      if (buttonState === 'shake') setButtonState('initial');
                    }}
                    role="option"
                    aria-selected={selectedSize === size}
                  >
                    {size}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <button
          onClick={handleAddToCart}
          className={getButtonClass()}
        >
          {buttonState === 'added' ? (
            <i className="bi bi-check2"></i>
          ) : (
            <i className="bi bi-cart"></i>
          )}
          {getButtonText()}
        </button>
      </div>
    </div>
  );
}
