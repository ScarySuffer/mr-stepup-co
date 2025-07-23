import React from "react";
import { Link } from "react-router-dom";
import "./Contact.css";

export default function Contact() {
  return (
    <section className="contact-section">
      <h2>Get in Touch</h2>
      <p>Got questions? Want to order a pair? Reach out to us via Instagram or WhatsApp!</p>

      <div className="showcase-gallery">
        <div className="showcase-card">
          <img src="/assets/showcase/different-converses.jpg" alt="Vintage Converse Shoes" />
          <p className="caption">Vintage Converse Collection</p>
        </div>
        <div className="showcase-card">
          <img src="/assets/showcase/nike-af1.jpg" alt="Nike Air Force 1 dancing" />
          <p className="caption">Nike Air Force 1 in motion</p>
        </div>
      </div>

      <div className="contact-links">
        <Link to="/coming-soon">📞 WhatsApp</Link>
        <Link to="/coming-soon">📸 Instagram</Link>
      </div>
    </section>
  );
}
