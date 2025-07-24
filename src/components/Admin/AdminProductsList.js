// src/components/Admin/AdminProductsList.js
import React from 'react';
import { Link } from 'react-router-dom';
import './AdminProductsList.css'; // We'll create this CSS next

export default function AdminProductsList({ products, onDeleteProduct }) {
    if (!products || products.length === 0) {
        return (
            <section className="admin-products-section">
                <h2>Admin Dashboard</h2>
                <p>No products found. <Link to="/admin/add-product" className="admin-link-btn">Add a new product</Link> to get started!</p>
            </section>
        );
    }

    return (
        <section className="admin-products-section">
            <h2>Admin Dashboard</h2>
            <div className="admin-actions">
                <Link to="/admin/add-product" className="admin-link-btn">
                    + Add New Product
                </Link>
            </div>
            <div className="product-list-container">
                {products.map((product) => (
                    <div key={product.id} className="admin-product-item">
                        <img src={product.img || product.image} alt={product.name} />
                        <div className="product-details">
                            <h3>{product.name}</h3>
                            <p>Brand: {product.brand}</p>
                            <p>Price: R{product.price.toFixed(2)}</p>
                        </div>
                        <div className="product-actions">
                            <Link to={`/admin/edit-product/${product.id}`} className="edit-btn">Edit</Link>
                            <button onClick={() => onDeleteProduct(product.id)} className="delete-btn">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}