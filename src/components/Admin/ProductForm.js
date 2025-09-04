import React, { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import "./ProductForm.css";

export default function ProductForm({ initialData = {}, onSave, onCancel }) {
  const [productData, setProductData] = useState({
    name: initialData.name || "",
    brand: initialData.brand || "",
    price: initialData.price || 0,
    description: initialData.description || "",
    sizes: initialData.sizes?.join(",") || "",
    image: initialData.image || "",
    galleryImages: initialData.galleryImages?.join(",") || "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { sizes, galleryImages, ...restOfData } = productData;

    const parsedProduct = {
      ...restOfData,
      price: Number(restOfData.price),
      sizes: sizes
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s)
        .map(Number),
      galleryImages: galleryImages
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url),
      hidden: initialData.hidden || false,
    };

    try {
      if (initialData.id) {
        const docRef = doc(db, "products", initialData.id);
        await updateDoc(docRef, parsedProduct);
      } else {
        await addDoc(collection(db, "products"), parsedProduct);
      }
      if (onSave) onSave(parsedProduct);
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form">
      {/* Sticky Header */}
      <div className="product-form-header">
        <h2 className="product-form-title">
          {initialData.id ? "Edit Product" : "Add New Product"}
        </h2>
        <button type="button" className="cancel-btn" onClick={onCancel}>
          ✕ Close
        </button>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group full-width">
          <label htmlFor="name" className="required-asterisk">
            Product Name
          </label>
          <input
            id="name"
            value={productData.name}
            onChange={handleInputChange}
            placeholder="e.g. Premium Wireless Headphones"
            required
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={productData.description}
            onChange={handleInputChange}
            placeholder="A short description of the product..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="brand" className="required-asterisk">
            Brand
          </label>
          <input
            id="brand"
            value={productData.brand}
            onChange={handleInputChange}
            placeholder="e.g. Nike"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price" className="required-asterisk">
            Price (R)
          </label>
          <input
            id="price"
            type="number"
            value={productData.price}
            onChange={handleInputChange}
            placeholder="e.g. 999.99"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="sizes">Sizes</label>
          <input
            id="sizes"
            value={productData.sizes}
            onChange={handleInputChange}
            placeholder="e.g. 34, 35, 36"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="image">Main Image URL</label>
          <input
            id="image"
            value={productData.image}
            onChange={handleInputChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="galleryImages">Gallery Images</label>
          <input
            id="galleryImages"
            value={productData.galleryImages}
            onChange={handleInputChange}
            placeholder="Comma separated URLs"
          />
        </div>

        <div className="form-group full-width">
          <label>Upload Images</label>
          <div className="upload-box">
            <p>Drag & drop or click to upload</p>
            <input type="file" multiple className="file-input" />
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="form-buttons">
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
