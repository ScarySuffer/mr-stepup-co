import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import ProductCard from "./ProductCard";
import "./Products.css";
import "./Brands.css";

const groupByBrand = (items) => {
  return items.reduce((groups, product) => {
    const brand = product.brand && typeof product.brand === 'string' ? product.brand : "Other";
    if (!groups[brand]) groups[brand] = [];
    groups[brand].push(product);
    return groups;
  }, {});
};

export default function Brands({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const colRef = collection(db, "products");
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const prodData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(prodData);
        setLoading(false);
      },
      (err) => {
        console.error("Error loading products:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading products...</p>;

  const productsByBrand = groupByBrand(products);

  return (
    <section className="brands-section">
      <h2 className="brands-title">Sneakers by Brand</h2>
      {Object.entries(productsByBrand).map(([brand, items]) => (
        <div key={brand} className="brand-group">
          <h3 className="brand-heading">{brand}</h3>
          <div className="products-grid">
            {items.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
