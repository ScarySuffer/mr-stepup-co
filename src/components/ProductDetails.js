import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import AddToCartConfirmation from './AddToCartConfirmation';
import productData from './productData';
import "./ProductDetails.css";

export default function ProductDetails({ onAddToCart }) {
  const { id } = useParams();
  const product = productData.find(p => p.id === id);

  const [mainImage, setMainImage] = useState(product?.image || '');
  const [prevImage, setPrevImage] = useState(null); // for smooth fade
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  useEffect(() => {
    if (product) {
      setMainImage(product.image);
      const newSize = product.sizes?.includes(selectedSize) ? selectedSize : product.sizes?.[0] || '';
      setSelectedSize(newSize);
      setQuantity(1);
    }
  }, [product, selectedSize]);

  if (!product) {
    return (
      <div className="product-details" style={{ padding: '2rem', textAlign: 'center' }}>
        Product not found.
        <Link to="/products" className="back-btn" style={{ display: 'block', marginTop: '1rem' }}>
          ← Back to Products
        </Link>
      </div>
    );
  }

  const handleAddToCartClick = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      setConfirmationMessage("Please select a size before adding to cart.");
      setShowConfirmation(true);
      return;
    }
    onAddToCart(product, selectedSize, quantity);
    setConfirmationMessage(`${quantity}x ${product.name} (Size: ${selectedSize || 'N/A'}) added to cart!`);
    setShowConfirmation(true);
  };

  const handleThumbnailClick = (img) => {
    if (img !== mainImage) {
      setPrevImage(mainImage);
      setMainImage(img);
    }
  };

  return (
    <div className="product-details">
      <div className="product-detail-card">
        <div className="product-main">
          <div className="image-container">
            {prevImage && (
              <img
                src={prevImage}
                alt={product.name}
                className="main-image fade-out"
                onAnimationEnd={() => setPrevImage(null)}
              />
            )}
            <img src={mainImage} alt={product.name} className="main-image fade-in" />
          </div>

          <div className="product-info">
            <h2>{product.name}</h2>
            <p className="description">{product.description}</p>
            <p className="price">R{product.price.toFixed(2)}</p>

            {product.sizes.length > 0 && (
              <>
                <h4>Available Sizes:</h4>
                <div className="sizes-selection">
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
              </>
            )}

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

        {product.otherImages.length > 0 && (
          <>
            <h4>More Photos:</h4>
            <div className="image-gallery">
              {[product.image, ...product.otherImages].map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.name} view ${idx + 1}`}
                  className={`thumbnail ${mainImage === img ? 'selected-thumbnail' : ''}`}
                  onClick={() => handleThumbnailClick(img)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <Link to="/products" className="back-btn">← Back to Products</Link>

      <AddToCartConfirmation
        show={showConfirmation}
        message={confirmationMessage}
        onClose={() => setShowConfirmation(false)}
        duration={3000}
      />
    </div>
  );
}
