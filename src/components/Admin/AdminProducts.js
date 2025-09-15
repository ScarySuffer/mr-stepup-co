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
  serverTimestamp,
  updateDoc,
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
  const [searchTerm, setSearchTerm] = useState(""); // ADDED: New state for search term

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

  useEffect(() => {
    if (!userData || userData.role !== "admin") return;
    const colRef = collection(db, "products");
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const prodData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(prodData);
      },
      (err) => console.error("Error loading products:", err)
    );
    return () => unsubscribe();
  }, [userData]);

  if (loading) return <p className="loading-state">Loading...</p>;
  if (!currentUser || userData?.role !== "admin") {
    return <p className="access-denied-message">Access Denied. Admins only.</p>;
  }

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

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const docRef = doc(db, "products", id);
      await deleteDoc(docRef);
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // HIDDEN TOGGLE
  const toggleHidden = async (product) => {
    try {
      const docRef = doc(db, "products", product.id);
      await updateDoc(docRef, { hidden: !product.hidden });
    } catch (err) {
      console.error("Error updating hidden status:", err);
    }
  };

  // ADDED: Handler for search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // ADDED: Filter logic
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-products-container">
      <div className="admin-header">
        <h1 className="page-title">Admin: Manage Products</h1>
        {/* ADDED: Search input field */}
        <input
          type="text"
          placeholder="Search products..."
          className="search-input"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button
          className="add-product-btn"
          onClick={() => {
            // UPDATED: Pass an empty object to prevent the null error
            setEditingProduct({});
            setShowForm(true);
          }}
        >
          + Add Product
        </button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="product-form-modal">
          <div className="modal-content">
            <ProductForm
              initialData={editingProduct}
              onSave={handleSaveProduct}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className="desktop-view">
        <div className="table-container">
          <table className="admin-products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Sizes</th>
                <th>Hidden</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* UPDATED: Map over filteredProducts */}
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="admin-product-image"
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.brand}</td>
                  <td>R{product.price}</td>
                  <td>{product.sizes?.join(", ")}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={product.hidden || false}
                      onChange={() => toggleHidden(product)}
                    />
                  </td>
                  <td className="actions-cell">
                    <button
                      className="edit-btn"
                      onClick={() => {
                        setEditingProduct(product);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="mobile-view">
        <div className="product-cards-container">
          {/* UPDATED: Map over filteredProducts */}
          {filteredProducts.map((product) => (
            <div className="product-card" key={product.id}>
              <img
                src={product.image}
                alt={product.name}
                className="product-card-image"
              />
              <div className="card-info">
                <p>
                  <strong>Name:</strong> {product.name}
                </p>
                <p>
                  <strong>Brand:</strong> {product.brand}
                </p>
                <p>
                  <strong>Price:</strong> R{product.price}
                </p>
                <p>
                  <strong>Sizes:</strong> {product.sizes?.join(", ")}
                </p>
                <p>
                  <strong>Hidden:</strong>{" "}
                  <input
                    type="checkbox"
                    checked={product.hidden || false}
                    onChange={() => toggleHidden(product)}
                  />
                </p>
              </div>
              <div className="card-actions">
                <button
                  className="edit-btn"
                  onClick={() => {
                    setEditingProduct(product);
                    setShowForm(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}