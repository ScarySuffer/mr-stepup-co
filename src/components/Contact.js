// src/components/Contact.js
import React from "react";
import "./Contact.css";

export default function Contact() {
  return (
    <section className="contact-section">
      <h2 className="section-title">Get in Touch with Mr. StepUp</h2>
      <p className="section-description">
        Have a question about a product, need assistance with an order, or looking for a specific pair of sneakers?
        We're here to help! Reach out to us directly through <span className="highlight-bold">WhatsApp</span>, <span className="highlight-bold">email</span>, or connect with us on <span className="highlight-bold">Instagram</span>.
      </p>

      <div className="showcase-gallery">
        <div className="showcase-card">
          <img src="/assets/showcase/different-converses.jpg" alt="Vintage Converse Shoes Collection" />
          <p className="caption">Our curated vintage collection</p>
        </div>
        <div className="showcase-card">
          <img src="/assets/showcase/nike-af1.jpg" alt="Nike Air Force 1 dancing in urban setting" />
          <p className="caption">New Arrivals: Nike Air Force 1</p>
        </div>
      </div>

      <div className="contact-links">
        <a
          href="https://wa.me/27636140298"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-btn whatsapp-btn"
          aria-label="Contact via WhatsApp"
        >
          <i className="bi bi-whatsapp"></i> WhatsApp
        </a>

        <a
          href="mailto:info.mrstepup@gmail.com"
          className="contact-btn email-btn"
          aria-label="Send us an Email"
        >
          <i className="bi bi-envelope-fill"></i> Email
        </a>

        <a
          href="https://instagram.com/YOURINSTAGRAMHANDLE"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-btn instagram-btn"
          aria-label="Connect on Instagram"
        >
          <i className="bi bi-instagram"></i> Instagram
        </a>
      </div>
    </section>
  );
}