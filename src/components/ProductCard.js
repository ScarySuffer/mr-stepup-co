import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

/**
 * A reusable React component for displaying a single product card.
 * It features a visual effect when the "Add to basket" button is clicked and
 * a hover effect on the product image, now with a gallery slider.
 * The product image is now a clickable link to the ProductDetails page.
 *
 * NOTE: For the Bootstrap icon to appear, you must add the following CDN link
 * to your main index.html file's <head> section:
 * <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
 *
 * @param {object} props - The component props.
 * @param {object} props.product - An object containing product details like name, price, and image.
 * @param {string} props.product.id - The unique ID of the product, used for linking.
 * @param {string} props.product.name - The name of the product.
 * @param {number} props.product.price - The price of the product.
 * @param {string} props.product.image - The URL of the default product image.
 * @param {Array<string>} props.product.galleryImages - An array of image URLs for different product views (for slider).
 * @param {Array<number>} props.product.sizes - An array of available sizes.
 * @param {function} props.onAddToCart - The function to call when the "Add to basket" button is clicked.
 */
export default function ProductCard({ product, onAddToCart }) {
  const [isAdded, setIsAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // State for image slider
  const intervalRef = useRef(null); // Ref to hold the interval ID

  // Reset currentImageIndex when product changes (useful if product cards are reused)
  useEffect(() => {
    setCurrentImageIndex(0);
    // Cleanup any running interval if component unmounts or product changes before mouse leaves
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [product.id]); // Dependency on product.id ensures reset when product changes

  /**
   * Handles mouse entering the product image to start the image slider.
   */
  const handleMouseEnterImage = () => {
    // Only start slider if there are multiple images in the gallery
    if (product.galleryImages && product.galleryImages.length > 1) {
      // Clear any existing interval to prevent multiple intervals running
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // Start cycling through images
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex(prevIndex =>
          (prevIndex + 1) % product.galleryImages.length
        );
      }, 800); // Change image every 800ms
    } else {
      // If only one image, ensure it's displayed (though it should be by default)
      setCurrentImageIndex(0);
    }
  };

  /**
   * Handles mouse leaving the product image to stop the image slider and reset.
   */
  const handleMouseLeaveImage = () => {
    // Clear the interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    // Reset to the first image (front view) when mouse leaves
    setCurrentImageIndex(0);
  };

  /**
   * Handles the click event for the "Add to basket" button.
   * It triggers a visual overlay effect and calls the parent's `onAddToCart` handler.
   */
  const handleAddToCart = () => {
    // Only proceed if a size has been selected AND product has sizes
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      return; // Do nothing if no size is selected for a product that requires sizes
    }

    // Show the "added" overlay
    setIsAdded(true);

    // Call the parent handler to add the product to the cart,
    // passing the selected size as part of the product data
    if (onAddToCart) {
      onAddToCart({ ...product, selectedSize });
    }

    // Hide the overlay after a delay to match the animation
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  // Determine the correct CSS class based on the product's color or a default value.
  const productClass = `product--${product.color || 'blue'}`;

  // Determine the image source: either the current image from the gallery, or the default product.image
  const displayedImage = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages[currentImageIndex]
    : product.image; // Fallback if gallery is not available or empty

  return (
    <div className={`product ${productClass}`}>
      <div className="product_inner">
        {/* Wrap image in Link component */}
        <Link to={`/products/${product.id}`} className="product-image-link">
          <img
            src={displayedImage} // Use the dynamically selected image
            alt={product.name}
            onMouseEnter={handleMouseEnterImage} // Start slider on hover
            onMouseLeave={handleMouseLeaveImage} // Stop slider on mouse leave
          />
        </Link>

        {/* Product name */}
        <p className="product-name">{product.name}</p>

        {/* Product price */}
        <p className="product-price">Price R{product.price}</p>

        {/* New sizes dropdown section, only render if product has sizes */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="product__size-dropdown-container">
            <button
              className="product__size-dropdown-toggle"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedSize ? `Size: ${selectedSize}` : 'Select Size'}
              <i className={`bi bi-chevron-down ${isDropdownOpen ? 'open' : ''}`}></i>
            </button>
            {isDropdownOpen && (
              <ul className="product__size-dropdown-menu">
                {product.sizes.map((size) => (
                  <li
                    key={size}
                    className="product__size-dropdown-item"
                    onClick={() => {
                      setSelectedSize(size);
                      setIsDropdownOpen(false); // Close dropdown after selection
                    }}
                  >
                    {size}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* The button is now disabled if no size is selected and sizes are available for the product */}
        <button onClick={handleAddToCart} disabled={product.sizes && product.sizes.length > 0 && !selectedSize}>
          <i className="bi bi-cart"></i> Add to basket
        </button>
      </div>
      <div className={`product_overlay ${isAdded ? 'active' : ''}`}>
        <h2>Added to basket</h2>
        <i className="fa fa-check"></i>
      </div>
    </div>
  );
}
