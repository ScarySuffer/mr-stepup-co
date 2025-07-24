// src/components/ProductDetails.js
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import productData from "./productData";
import AddToCartConfirmation from './AddToCartConfirmation'; // Import the confirmation component
import "./ProductDetails.css"; // Ensure this CSS is comprehensive for detailed view

export default function ProductDetails({ onAddToCart }) {
  const { id } = useParams();
  const product = productData.find((item) => item.id === id);

  // State for selected size and quantity
  const [selectedSize, setSelectedSize] = useState(
    product && product.sizes && product.sizes.length > 0 ? product.sizes[0] : ''
  );
  const [quantity, setQuantity] = useState(1);

  // --- NEW STATE FOR CONFIRMATION MESSAGE ---
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  // --- END NEW STATE ---

  if (!product) {
    return <div>Product not found.</div>;
  }

  const handleAddToCartClick = () => {
    if (selectedSize) {
      // Call the parent's onAddToCart function, passing product, size, and quantity
      onAddToCart(product, selectedSize, quantity);

      // --- TRIGGER CONFIRMATION MESSAGE ---
      setConfirmationMessage(`${quantity}x ${product.name} (Size: ${selectedSize}) added to cart!`);
      setShowConfirmation(true);
      // --- END TRIGGER ---

    } else {
      alert("Please select a size before adding to cart.");
    }
  };

  // --- NEW FUNCTION TO CLOSE CONFIRMATION ---
  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setConfirmationMessage(''); // Clear message when hidden
  };
  // --- END NEW FUNCTION ---

  return (
    <div className="product-details">
      <div className="product-detail-card"> {/* Added a wrapper for better styling */}
        <div className="product-main">
          <img src={product.image} alt={product.name} className="main-image" />

          <div className="product-info">
            <h2>{product.name}</h2> {/* Changed to h2 */}
            <p className="description">{product.description}</p>
            <p className="price">R{product.price.toFixed(2)}</p> {/* Format price */}

            <h4>Available Sizes:</h4>
            <div className="sizes-selection"> {/* Renamed for clarity */}
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

            {/* Quantity Selector */}
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

        {product.otherImages && product.otherImages.length > 0 && (
          <>
            <h4>More Photos:</h4>
            <div className="image-gallery"> {/* Renamed for clarity */}
              {product.otherImages.map((img, index) => (
                <img key={index} src={img} alt={`More of ${product.name}`} />
              ))}
            </div>
          </>
        )}
      </div> {/* End product-detail-card */}

      <Link to="/products" className="back-btn">
        ← Back to Products
      </Link>

      {/* --- ADD THE CONFIRMATION MESSAGE COMPONENT HERE --- */}
      <AddToCartConfirmation
        show={showConfirmation}
        message={confirmationMessage}
        onClose={handleCloseConfirmation}
        duration={3000} // Message will automatically hide after 3 seconds
      />
      {/* --- END ADDITION --- */}
    </div>
  );
}