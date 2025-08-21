// src/components/Admin/AdminProductsList.js

import React from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import "./AdminProductsList.css";

export default function AdminProductsList({ products, onDeleteProduct }) {
  const handleDeleteClick = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      try {
        await onDeleteProduct(productId);
        alert("Product deleted successfully!");
      } catch (error) {
        alert("Failed to delete product. Please try again.");
        console.error("Deletion error:", error);
      }
    }
  };

  if (!products || products.length === 0) {
    return (
      <section className="admin-products-section">
        <h2>Admin Dashboard</h2>
        <p className="no-products-message">No products found.
          <Link to="/admin/add-product" className="admin-link-btn">
            <FaPlus className="mr-1" /> Add a new product
          </Link>
          to get started!
        </p>
      </section>
    );
  }

  return (
    <section className="admin-products-section">
      <h2>Admin Dashboard</h2>
      <div className="admin-actions">
        <Link to="/admin/add-product" className="admin-link-btn" aria-label="Add New Product">
          <FaPlus className="mr-1" /> Add New Product
        </Link>
      </div>
      <div className="product-list-container">
        {products.map((product) => (
          <div key={product.id} className="admin-product-item">
            <img src={product.image} alt={product.name} loading="lazy" />
            <div className="product-details">
              <h3>{product.name}</h3>
              <p>Brand: {product.brand}</p>
              <p>Price: R{product.price.toFixed(2)}</p>
              {product.sizes && product.sizes.length > 0 && (
                <p>Sizes: {product.sizes.join(', ')}</p>
              )}
            </div>
            <div className="product-actions">
              <Link
                to={`/admin/edit-product/${product.id}`}
                className="edit-btn"
                aria-label={`Edit ${product.name}`}
              >
                <FaEdit className="mr-1" /> Edit
              </Link>
              <button
                onClick={() => handleDeleteClick(product.id, product.name)}
                className="delete-btn"
                aria-label={`Delete ${product.name}`}
              >
                <FaTrash className="mr-1" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}