import React, { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import './ProductForm.css';

export default function ProductForm({ initialData = {}, onSave, onCancel }) {
  const [name, setName] = useState(initialData.name || "");
  const [brand, setBrand] = useState(initialData.brand || "");
  const [price, setPrice] = useState(initialData.price || 0);
  const [description, setDescription] = useState(initialData.description || "");
  const [sizes, setSizes] = useState(initialData.sizes?.join(",") || "");
  const [image, setImage] = useState(initialData.image || "");
  const [galleryImages, setGalleryImages] = useState(
    initialData.galleryImages?.join(",") || ""
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const product = {
      name,
      brand,
      price: Number(price),
      description,
      sizes: sizes
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s)
        .map(Number),
      image,
      galleryImages: galleryImages
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url),
      hidden: initialData.hidden || false,
    };

    try {
      if (initialData.id) {
        const docRef = doc(db, "products", initialData.id);
        await updateDoc(docRef, product);
      } else {
        await addDoc(collection(db, "products"), product);
      }
      if (onSave) onSave(product);
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-group">
        <label htmlFor="name">Product Name</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="brand">Brand</label>
        <input
          id="brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="price">Price (R)</label>
        <input
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="sizes">Sizes (comma separated)</label>
        <input
          id="sizes"
          value={sizes}
          onChange={(e) => setSizes(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="image">Main Image URL</label>
        <input
          id="image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="galleryImages">Gallery Images (comma separated URLs)</label>
        <input
          id="galleryImages"
          value={galleryImages}
          onChange={(e) => setGalleryImages(e.target.value)}
        />
      </div>

      <div className="form-buttons">
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Product"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
