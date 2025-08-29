// src/components/FeaturedProducts.js
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import ProductCard from "./ProductCard";
import "./FeaturedProducts.css";

export default function FeaturedProducts({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const colRef = collection(db, "products");

    // Listen to Firestore in real-time
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const prodData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(prodData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading products...</p>;

  return (
    <section className="featured-products">
      <h2>Featured Sneakers - All Brands</h2>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
      <div className="cta-container">
        <a href="/products" className="cta-button">
          View All Products
        </a>
      </div>
    </section>
  );
}
