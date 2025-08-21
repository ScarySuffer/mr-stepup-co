// src/components/Admin/ProductForm.js

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AddProductForm.css";

export default function ProductForm({ onSubmit, products }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    img: "",
    description: "",
    sizes: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setErrorMessage("");
    if (isEditing && products) {
      const productToEdit = products.find((p) => p.id === id);
      if (productToEdit) {
        setFormData({
          name: productToEdit.name || "",
          brand: productToEdit.brand || "",
          price: productToEdit.price ? String(productToEdit.price) : "",
          img: productToEdit.image || "", 
          description: productToEdit.description || "",
          sizes: Array.isArray(productToEdit.sizes)
            ? productToEdit.sizes.join(", ")
            : productToEdit.sizes || "",
        });
      } else {
        console.warn(`Product with ID ${id} not found.`);
        setErrorMessage("Product not found. Redirecting...");
        setTimeout(() => navigate("/admin/products"), 1500);
      }
    } else if (!isEditing) {
      setFormData({
        name: "",
        brand: "",
        price: "",
        img: "",
        description: "",
        sizes: "",
      });
    }
  }, [id, isEditing, products, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
    
    // Find the original product if we're in editing mode
    const originalProduct = isEditing ? products.find(p => p.id === id) : null;
    if (isEditing && !originalProduct) {
        setErrorMessage("Original product data not found.");
        setLoading(false);
        return;
    }

    if (!isEditing && (!formData.name.trim() || !formData.brand.trim() || !formData.price.trim() || !formData.img.trim())) {
      setErrorMessage("Please fill in all required fields: Name, Brand, Price, and Image URL.");
      setLoading(false);
      return;
    }

    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setErrorMessage("Please enter a valid positive price.");
      setLoading(false);
      return;
    }

    const sizesArray = formData.sizes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    let productToSubmit;
    if (isEditing) {
      // For editing, only update the fields that are allowed to change
      productToSubmit = {
        id: id,
        name: originalProduct.name,
        brand: originalProduct.brand,
        image: originalProduct.image,
        hoverImage: originalProduct.hoverImage,
        galleryImages: originalProduct.galleryImages,
        color: originalProduct.color,
        price: priceNum,
        description: formData.description.trim(),
        sizes: sizesArray.length > 0 ? sizesArray.map(s => parseFloat(s)) : null,
      };
    } else {
      // For adding, create a new product object
      try {
          new URL(formData.img.trim());
      } catch (_) {
          setErrorMessage("Please enter a valid Image URL.");
          setLoading(false);
          return;
      }
      productToSubmit = {
        name: formData.name.trim(),
        brand: formData.brand.trim(),
        price: priceNum,
        image: formData.img.trim(),
        hoverImage: formData.img.trim(),
        galleryImages: [formData.img.trim()],
        description: formData.description.trim(),
        sizes: sizesArray.length > 0 ? sizesArray.map(s => parseFloat(s)) : null,
        color: 'blue'
      };
    }

    try {
      await onSubmit(productToSubmit);
      alert(isEditing ? "Product updated successfully!" : "Product added successfully!");
      navigate("/admin/products");
    } catch (error) {
      console.error("Submission error:", error);
      setErrorMessage(`Failed to ${isEditing ? 'update' : 'add'} product: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="add-product-section">
      <h2>{isEditing ? "Edit Sneaker Product" : "Add New Sneaker Product"}</h2>
      <form className="add-product-form" onSubmit={handleSubmit}>
        {errorMessage && (
          <p className="form-error-message" role="alert">{errorMessage}</p>
        )}
        <div className="form-group">
          <label htmlFor="name">Product Name <span className="required">*</span></label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required={!isEditing}
            disabled={isEditing || loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="brand">Brand <span className="required">*</span></label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required={!isEditing}
            disabled={isEditing || loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price (R) <span className="required">*</span></label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="img">Image URL <span className="required">*</span></label>
          <input
            type="url"
            id="img"
            name="img"
            value={formData.img}
            onChange={handleChange}
            required={!isEditing}
            disabled={isEditing || loading}
            placeholder="e.g., https://example.com/shoe.jpg"
          />
        </div>
        <div className="form-group">
          <label htmlFor="sizes">Available Sizes (comma-separated, e.g., 7, 8, 9.5)</label>
          <input
            type="text"
            id="sizes"
            name="sizes"
            value={formData.sizes}
            onChange={handleChange}
            disabled={loading}
            placeholder="e.g., 7, 7.5, 8, 9, 10"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            disabled={loading}
          ></textarea>
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? <div className="spinner"></div> : (isEditing ? "Update Product" : "Add Product")}
        </button>
      </form>
    </section>
  );
}