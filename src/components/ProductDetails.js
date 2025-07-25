// src/components/ProductDetails.js
import React, { useState, useEffect } from "react"; // Added useEffect
import { useParams, Link } from "react-router-dom";
import AddToCartConfirmation from './AddToCartConfirmation';
import "./ProductDetails.css";

// Remove: import productData from './productData'; // No longer needed here

export default function ProductDetails({ onAddToCart, products }) {
  const { id } = useParams();
  // product is now found from the `products` prop
  const product = products.find((item) => item.id === id);

  // Initialize mainImage using useEffect to react to product changes
  const [mainImage, setMainImage] = useState('');
  useEffect(() => {
    if (product) {
      setMainImage(product.image);
    }
  }, [product]);

  const [selectedSize, setSelectedSize] = useState(
    product && product.sizes?.length > 0 ? product.sizes[0] : ''
  );
  const [quantity, setQuantity] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  // Reset selected size and quantity when product changes (e.g., navigating between detail pages)
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.length > 0 ? product.sizes[0] : '');
      setQuantity(1);
    }
  }, [product]);

  if (!product) {
    return <div style={{ padding: '2rem' }}>Product not found.</div>;
  }

  const handleAddToCartClick = () => {
    if (selectedSize) {
      onAddToCart(product, selectedSize, quantity);
      setConfirmationMessage(`${quantity}x ${product.name} (Size: ${selectedSize}) added to cart!`);
      setShowConfirmation(true);
    } else {
      alert("Please select a size before adding to cart.");
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setConfirmationMessage('');
  };

  return (
    <div className="product-details">
      <div className="product-detail-card">
        <div className="product-main">
          {/* Ensure mainImage is always set to the product's primary image on load */}
          <img src={mainImage} alt={product.name} className="main-image" />

          <div className="product-info">
            <h2>{product.name}</h2>
            <p className="description">{product.description}</p>
            <p className="price">R{product.price.toFixed(2)}</p>

            <h4>Available Sizes:</h4>
            <div className="sizes-selection">
              {product.sizes.map((size) => (
                <span
                  key={size}
                  className={`size-badge ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </span>
              ))}
            </div>

            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>

            <button className="add-to-cart-btn" onClick={handleAddToCartClick}>
              Add to Cart
            </button>
          </div>
        </div>

        {product.otherImages?.length > 0 && (
          <>
            <h4>More Photos:</h4>
            <div className="image-gallery">
              {/* Add product.image (main image) to the gallery so user can click back to it */}
              <img
                src={product.image}
                alt={`Main view of ${product.name}`}
                className={`thumbnail ${mainImage === product.image ? 'selected-thumbnail' : ''}`}
                onClick={() => setMainImage(product.image)}
                style={{ cursor: 'pointer' }}
              />
              {product.otherImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`More of ${product.name} view ${index + 2}`}
                  className={`thumbnail ${mainImage === img ? 'selected-thumbnail' : ''}`}
                  onClick={() => setMainImage(img)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <Link to="/products" className="back-btn">
        ← Back to Products
      </Link>

      <AddToCartConfirmation
        show={showConfirmation}
        message={confirmationMessage}
        onClose={handleCloseConfirmation}
        duration={3000}
      />
    </div>
  );
}