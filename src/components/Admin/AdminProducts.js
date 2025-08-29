// src/components/Admin/AdminProducts.js
import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  serverTimestamp
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import ProductForm from "./ProductForm";
import "./AdminProducts.css";

export default function AdminProducts() {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [userData, setUserData] = useState(null);

  // Fetch user document to get role
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      const userRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) setUserData(docSnap.data());
      setLoading(false);
    };
    fetchUserData();
  }, [currentUser]);

  // Load products from Firestore in real-time (only if admin)
  useEffect(() => {
    if (!userData || userData.role !== "admin") return;

    const colRef = collection(db, "products");
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const prodData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(prodData);
      },
      (err) => console.error("Error loading products:", err)
    );

    return () => unsubscribe();
  }, [userData]);

  // Admin access check
  if (loading) return <p>Loading...</p>;
  if (!currentUser || userData?.role !== "admin") {
    return <p style={{ textAlign: "center", marginTop: "3rem" }}>Access Denied. Admins only.</p>;
  }

  // Add or update product
  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        const docRef = doc(db, "products", editingProduct.id);
        await setDoc(docRef, { ...productData }, { merge: true });
      } else {
        const colRef = collection(db, "products");
        await addDoc(colRef, { ...productData, createdAt: serverTimestamp() });
      }
      setEditingProduct(null);
      setShowForm(false);
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const docRef = doc(db, "products", id);
      await deleteDoc(docRef);
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <div className="admin-products-container">
      <h1>Admin: Manage Products</h1>
      <button className="add-product-btn" onClick={() => { setEditingProduct(null); setShowForm(true); }}>
        Add Product
      </button>

      {showForm && (
        <div className="product-form-modal">
          <div className="modal-content">
            <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
            <ProductForm
              initialData={editingProduct}
              onSave={handleSaveProduct}
            />
            <button className="close-modal-btn" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <table className="admin-products-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Brand</th>
            <th>Price</th>
            <th>Sizes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td><img src={product.image} alt={product.name} className="admin-product-image" /></td>
              <td>{product.name}</td>
              <td>{product.brand}</td>
              <td>R{product.price}</td>
              <td>{product.sizes?.join(", ")}</td>
              <td>
                <button onClick={() => { setEditingProduct(product); setShowForm(true); }}>Edit</button>
                <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
