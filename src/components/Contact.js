// src/components/Contact.js
import React from "react";
import { Link } from "react-router-dom";
import "./Contact.css";

export default function Contact() {
  return (
    <section className="contact-section">
      <h2 className="section-title">Get in Touch with Mr. StepUp</h2> {/* Added a class for styling */}
      <p className="section-description">
        Have a question about a product, need assistance with an order, or looking for a specific pair of sneakers?
        We're here to help! Reach out to us directly through WhatsApp or connect with us on Instagram.
      </p>

      {/* Visually appealing gallery of products/lifestyle shots */}
      <div className="showcase-gallery">
        <div className="showcase-card">
          <img src="/assets/showcase/different-converses.jpg" alt="Vintage Converse Shoes Collection" />
          <p className="caption">Our curated vintage collection</p>
        </div>
        <div className="showcase-card">
          <img src="/assets/showcase/nike-af1.jpg" alt="Nike Air Force 1 dancing in urban setting" />
          <p className="caption">New Arrivals: Nike Air Force 1</p>
        </div>
        {/* You can add more showcase cards here if you have more images */}
      </div>

      <div className="contact-links">
        {/* For actual WhatsApp, you'd use a link like:
            <a href="https://wa.me/YOURPHONENUMBER" target="_blank" rel="noopener noreferrer" className="contact-btn whatsapp-btn">
                <i className="fab fa-whatsapp"></i> WhatsApp
            </a>
            For Instagram:
            <a href="https://instagram.com/YOURINSTAGRAMHANDLE" target="_blank" rel="noopener noreferrer" className="contact-btn instagram-btn">
                <i className="fab fa-instagram"></i> Instagram
            </a>
        */}
        <Link to="/coming-soon" className="contact-btn whatsapp-btn">
          📞 WhatsApp
        </Link>
        <Link to="/coming-soon" className="contact-btn instagram-btn">
          📸 Instagram
        </Link>
      </div>
    </section>
  );
}