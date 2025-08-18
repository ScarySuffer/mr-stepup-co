import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";

export default function ProductCard({ product, onAddToCart }) {
  const safeProduct = product || {
    id: "",
    name: "",
    brand: "",
    price: 0,
    image: "",
    otherImages: [],
    sizes: [],
  };

  const { id, name, brand, price, image, otherImages = [], sizes = [] } = safeProduct;

  const getImagePath = (path) => (path?.startsWith("/") ? path : `/${path}`);
  const mainImage = getImagePath(image);
  const otherImgs = otherImages.map(getImagePath);

  const [currentMainImage, setCurrentMainImage] = useState(mainImage);
  const [prevImage, setPrevImage] = useState(null); // for smooth transition

  useEffect(() => {
    setCurrentMainImage(mainImage);
  }, [mainImage]);

  const handleThumbnailClick = (imgUrl) => {
    if (imgUrl !== currentMainImage) {
      setPrevImage(currentMainImage);
      setCurrentMainImage(imgUrl);
    }
  };

  return (
    // Add the 'product-card' class here
    <div className="flip-card product-card">
      <div className="flip-card-inner">
        {/* FRONT */}
        <div className="flip-card-front">
          <Link to={`/product/${id}`} className="product-image-link">
            {prevImage && (
              <img
                src={prevImage}
                alt={name}
                className="product-main-image fade-out"
                onAnimationEnd={() => setPrevImage(null)}
              />
            )}
            <img src={currentMainImage} alt={name} className="product-main-image fade-in" />
          </Link>
          <div className="product-details-content">
            <h3>{name}</h3>
            <p className="product-brand">{brand}</p>
            <p className="product-price">R{price.toFixed(2)}</p>
          </div>
        </div>

        {/* BACK */}
        <div className="flip-card-back">
          <div className="flip-back-content">
            {otherImgs.length > 0 && (
              <div className="thumbnail-gallery-back">
                {otherImgs.map((imgUrl, idx) => (
                  <img
                    key={idx}
                    src={imgUrl}
                    alt={`${name} thumbnail ${idx + 1}`}
                    className={`thumbnail ${currentMainImage === imgUrl ? "selected-thumbnail" : ""}`}
                    onClick={() => handleThumbnailClick(imgUrl)}
                  />
                ))}
              </div>
            )}
            <div className="size-selector">
              <select>
                {sizes.map((size, idx) => (
                  <option key={idx} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <button className="add-to-cart-btn" onClick={() => onAddToCart(safeProduct, sizes[0] || "", 1)}>
              Add to Cart
            </button>
            <Link to={`/product/${id}`} className="view-details-btn">
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}