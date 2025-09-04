// src/components/Products.js
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import localProducts from "./productData.js";
import "./Products.css";

export default function Products({ onAddToCart, isAdmin = false }) {
  const [products, setProducts] = useState(localProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const colRef = collection(db, "products");

    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const firestoreProducts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Merge Firestore with local products (avoid duplicates)
        const mergedProducts = [
          ...firestoreProducts,
          ...localProducts.filter(
            (lp) => !firestoreProducts.some((fp) => fp.id === lp.id)
          ),
        ];

        // Filter products: hide hidden items for normal users
        const visibleProducts = mergedProducts.filter((p) => isAdmin || !p.hidden);

        setProducts(visibleProducts);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching real-time products:", error);
        setProducts(localProducts.filter((p) => isAdmin || !p.hidden));
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isAdmin]);

  if (loading) {
    return (
      <section className="products-section">
        <div className="products-header">
          <h2>Our Products</h2>
          <p className="subtext">Find something you love.</p>
        </div>
        <p>Loading products...</p>
      </section>
    );
  }

  return (
    <section className="products-section">
      <div className="products-header">
        <h2>Our Products</h2>
        <p className="subtext">Find something you love.</p>
      </div>

      {products.length > 0 ? (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              isAdmin={isAdmin} // <-- pass admin status
            />
          ))}
        </div>
      ) : (
        <p className="no-products-message">
          No products found. Please check back later!
        </p>
      )}
    </section>
  );
}
