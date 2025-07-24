// src/components/Admin/ProductForm.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import "./AddProductForm.css";

// ProductForm now expects a 'products' prop to find the product for editing
export default function ProductForm({ onSubmit, products }) {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the ID from the URL if it exists
  const isEditing = !!id; // Boolean flag: true if an ID is present in the URL

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    img: "",
    description: "",
    sizes: "",
  });

  // Effect to populate form when editing, or clear when adding
  useEffect(() => {
    if (isEditing && products) {
      // Find the product by ID
      const productToEdit = products.find((p) => p.id === id);
      if (productToEdit) {
        setFormData({
          name: productToEdit.name || "",
          brand: productToEdit.brand || "",
          price: productToEdit.price || "",
          img: productToEdit.img || productToEdit.image || "",
          description: productToEdit.description || "",
          sizes: Array.isArray(productToEdit.sizes)
            ? productToEdit.sizes.join(",")
            : productToEdit.sizes || "",
        });
      } else {
        // If product not found, maybe navigate away or show error
        console.warn(`Product with ID ${id} not found.`);
        navigate('/admin/products'); // Redirect to admin list if product not found
      }
    } else if (!isEditing) {
      // Clear form when in "add product" mode
      setFormData({
        name: "",
        brand: "",
        price: "",
        img: "",
        description: "",
        sizes: "",
      });
    }
  }, [id, isEditing, products, navigate]); // Dependencies: re-run if ID, mode, or products change

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.brand || !formData.price || !formData.img) {
      alert("Please fill in all required fields: Name, Brand, Price, and Image URL.");
      return;
    }

    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert("Please enter a valid positive price.");
      return;
    }

    const sizesArray = formData.sizes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const productToSubmit = {
      id: isEditing ? id : `prod-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: formData.name,
      brand: formData.brand,
      price: priceNum,
      img: formData.img,
      image: formData.img,
      description: formData.description,
      sizes: sizesArray.length > 0 ? sizesArray : null,
    };

    onSubmit(productToSubmit); // onSubmit handles both add and update
    alert(isEditing ? "Product updated successfully!" : "Product added successfully!");

    navigate("/admin/products"); // Navigate back to the admin product list after submission
  };

  return (
    <section className="add-product-section">
      <h2>{isEditing ? "Edit Sneaker Product" : "Add New Sneaker Product"}</h2>
      <form className="add-product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Product Name <span className="required">*</span></label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
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
            required
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
            required
            placeholder="e.g., https://example.com/shoe.jpg"
          />
        </div>
        <div className="form-group">
          <label htmlFor="sizes">Available Sizes (comma-separated, e.g., 7,8,9.5)</label>
          <input
            type="text"
            id="sizes"
            name="sizes"
            value={formData.sizes}
            onChange={handleChange}
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
          ></textarea>
        </div>
        <button type="submit" className="submit-btn">
          {isEditing ? "Update Product" : "Add Product"}
        </button>
      </form>
    </section>
  );
}