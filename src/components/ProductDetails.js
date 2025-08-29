import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; 
import AddToCartConfirmation from './AddToCartConfirmation';
import "./ProductDetails.css";

export default function ProductDetails({ onAddToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  // Fetch product by ID from Firestore
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct({ id: docSnap.id, ...data });
          setMainImage(data.galleryImages?.[0] || data.image || "");
          setSelectedSize(data.sizes?.length > 0 ? data.sizes[0] : null);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="product-details" style={{ padding: "2rem", textAlign: "center" }}>
        <p>Product not found. 😔</p>
        <Link to="/products" className="back-btn" style={{ display: "block", marginTop: "1rem" }}>
          ← Back to Products
        </Link>
      </div>
    );
  }

  const handleAddToCartClick = () => {
    if (product.sizes && product.sizes.length > 0 && selectedSize === null) {
      setConfirmationMessage("Please select a size before adding to cart! 📏");
      setShowConfirmation(true);
      return;
    }

    const itemToAdd = {
      ...product,
      selectedSize: product.sizes?.length > 0 ? selectedSize : null,
      quantity,
    };

    onAddToCart(itemToAdd, itemToAdd.selectedSize, quantity);

    const sizeDisplay = itemToAdd.selectedSize ? ` (Size: ${itemToAdd.selectedSize})` : "";
    setConfirmationMessage(`${quantity}x ${product.name}${sizeDisplay} added to cart! 🎉`);
    setShowConfirmation(true);
  };

  return (
    <div className="product-details">
      <div className="product-detail-card">
        <div className="imgBx">
          <img src={mainImage} alt={product.name} />
        </div>

        <div className="contentBx">
          <h2>{product.name}</h2>
          <p className="description">{product.description}</p>
          <p className="price">R{product.price.toFixed(2)}</p>
        </div>
      </div>

      <div className="product-actions-container">
        {product.sizes && product.sizes.length > 0 && (
          <div className="size">
            <h3>Size:</h3>
            {product.sizes.map(size => (
              <span
                key={size}
                className={`size-badge ${selectedSize === size ? "selected" : ""}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </span>
            ))}
          </div>
        )}

        <div className="quantity">
          <h3>Quantity:</h3>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          />
        </div>

        <button
          className="add-to-cart-btn"
          onClick={handleAddToCartClick}
          disabled={product.sizes?.length > 0 && selectedSize === null}
        >
          Add to Cart
        </button>
      </div>

      {product.galleryImages && product.galleryImages.length > 1 && (
        <div className="image-gallery">
          {product.galleryImages.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${product.name} view ${idx + 1}`}
              className={`thumbnail ${mainImage === img ? "selected-thumbnail" : ""}`}
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>
      )}

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
