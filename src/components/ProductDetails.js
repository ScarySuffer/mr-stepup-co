import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import AddToCartConfirmation from './AddToCartConfirmation';
import productData from './productData'; // Assuming this is your source of product data
import "./ProductDetails.css";

export default function ProductDetails({ onAddToCart }) {
  const { id } = useParams();
  const product = productData.find(p => p.id === id);

  // Initialize mainImage with the first image from galleryImages, or fallback to product.image
  const [mainImage, setMainImage] = useState(product?.galleryImages?.[0] || product?.image || '');

  // Initialize selectedSize: if product has sizes, default to the first one, otherwise null/empty
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.length > 0 ? product.sizes[0] : null);
  const [quantity, setQuantity] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  // Effect to reset state when product changes (including initial load)
  useEffect(() => {
    if (product) {
      // Set main image to the first in the gallery when product loads/changes
      setMainImage(product.galleryImages?.[0] || product.image || '');
      // If product has sizes, set selectedSize to the first available size, otherwise null
      setSelectedSize(product.sizes?.length > 0 ? product.sizes[0] : null);
      setQuantity(1); // Reset quantity
    }
  }, [product]); // Only re-run when the 'product' object itself changes

  // Handle case where product is not found
  if (!product) {
    return (
      <div className="product-details" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Product not found. 😔</p>
        <Link to="/products" className="back-btn" style={{ display: 'block', marginTop: '1rem' }}>
          ← Back to Products
        </Link>
      </div>
    );
  }

  // Handle adding product to cart
  const handleAddToCartClick = () => {
    // Check if sizes are required and a size is not selected
    if (product.sizes && product.sizes.length > 0 && selectedSize === null) {
      setConfirmationMessage("Please select a size before adding to cart! 📏");
      setShowConfirmation(true);
      return;
    }

    // Prepare product to be added to cart
    const itemToAdd = {
      ...product,
      selectedSize: product.sizes?.length > 0 ? selectedSize : null, // Store null if no sizes are applicable
      quantity: quantity
    };

    // Call parent's add to cart function
    onAddToCart(itemToAdd, itemToAdd.selectedSize, quantity); // Ensure onAddToCart expects product, selectedSize, quantity

    // Set confirmation message
    const sizeDisplay = itemToAdd.selectedSize ? ` (Size: ${itemToAdd.selectedSize})` : '';
    setConfirmationMessage(`${quantity}x ${product.name}${sizeDisplay} added to cart! 🎉`);
    setShowConfirmation(true);
  };

  // Handle clicking a thumbnail to change the main image
  const handleThumbnailClick = (img) => {
    setMainImage(img);
  };

  return (
    <div className="product-details">
      <div className="product-detail-card">
        {/* Main image container */}
        <div className="imgBx">
          <img src={mainImage} alt={product.name} />
        </div>

        {/* Product content and actions */}
        <div className="contentBx">
          <h2>{product.name}</h2>
          <p className="description">{product.description}</p>
          <p className="price">R{product.price.toFixed(2)}</p>
        </div>
      </div>

      {/* New container for size, quantity, and add to cart */}
      <div className="product-actions-container">
        {/* Size selection, only rendered if sizes are available */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="size">
            <h3>Size:</h3>
            {product.sizes.map(size => (
              <span
                key={size}
                className={`size-badge ${selectedSize === size ? 'selected' : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </span>
            ))}
          </div>
        )}

        {/* Quantity selector */}
        <div className="quantity">
          <h3>Quantity:</h3>
          <input
            type="number"
            id="quantity"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          />
        </div>

        {/* Add to Cart button */}
        <button
          className="add-to-cart-btn"
          onClick={handleAddToCartClick}
          disabled={product.sizes?.length > 0 && selectedSize === null}
        >
          Add to Cart
        </button>
      </div>

      {/* Image Gallery - only show if there are multiple images in the gallery */}
      {product.galleryImages && product.galleryImages.length > 1 && (
        <div className="image-gallery">
          {product.galleryImages.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${product.name} view ${idx + 1}`}
              className={`thumbnail ${mainImage === img ? 'selected-thumbnail' : ''}`}
              onClick={() => handleThumbnailClick(img)}
            />
          ))}
        </div>
      )}

      <Link to="/products" className="back-btn">← Back to Products</Link>

      {/* Confirmation message for add to cart */}
      <AddToCartConfirmation
        show={showConfirmation}
        message={confirmationMessage}
        onClose={() => setShowConfirmation(false)}
        duration={3000}
      />
    </div>
  );
}