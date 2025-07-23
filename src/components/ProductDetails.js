import React from "react";
import { useParams, Link } from "react-router-dom";
import productData from "./productData";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();

  // Find the product by matching string id
  const product = productData.find((item) => item.id === id);

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div className="product-details">
      <h2>{product.name}</h2>
      <img src={product.image} alt={product.name} className="main-image" />

      <p className="description">{product.description}</p>

      <h4>Available Sizes:</h4>
      <div className="sizes">
  {product.sizes.map((size, index) => (
    <React.Fragment key={index}>
      <span className="size-badge">{size}</span>
      {index < product.sizes.length - 1 && ', '}
    </React.Fragment>
  ))}
</div>


      <h4>More Photos:</h4>
      <div className="more-images">
        {product.otherImages.map((img, index) => (
          <img key={index} src={img} alt={`More of ${product.name}`} />
        ))}
      </div>

      <Link to="/products" className="back-btn">← Back to Products</Link>
    </div>
  );
}
