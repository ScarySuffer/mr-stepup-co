// src/components/Home.js
import React, { useState, useEffect } from "react";
import Hero from "./Hero";
import BrandCarousel from "./BrandCarousel";
import ProductCard from "./ProductCard";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import "./Home.css";

export default function Home({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const colRef = collection(db, "products");

    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const prodData = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          // Filter out hidden products
          .filter((p) => !p.hidden);

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
    <div className="home-container">
      <Hero />
      <BrandCarousel />

      <section
        id="all-products"
        className="products-section"
        style={{ marginTop: "2rem" }}
      >
        <div className="hero-content">
          <h1>Step Up Your Sneaker Game</h1>
          <a href="/products" className="cta-button">
            Shop Now
          </a>
        </div>

        <h2>All Sneakers</h2>

        {products.length === 0 && (
          <p
            style={{
              textAlign: "center",
              fontSize: "1.2rem",
              color: "#666",
              marginTop: "2rem",
            }}
          >
            No sneakers available.
          </p>
        )}

        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
