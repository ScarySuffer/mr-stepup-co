import React from "react";
import "./Contact.css";

export default function Contact() {
  return (
    <section className="contact-section">
      <h2 className="section-title">Get in Touch with Mr. StepUp</h2>
      <p className="section-description">
        Have a question about a product, need assistance with an order, or looking for a specific pair of sneakers?
        We're here to help! Reach out to us directly through <span className="highlight-bold">WhatsApp</span>, <span className="highlight-bold">email</span>, connect with us on <span className="highlight-bold">Instagram</span>, or find us on <span className="highlight-bold">TikTok</span>.
      </p>

      <div className="showcase-gallery">
        <div className="showcase-card">
          <img src="/assets/showcase/different-converses.jpg" alt="Vintage Converse Shoes Collection" />
          <p className="caption">Our curated vintage collection</p>
        </div>
        <div className="showcase-card">
          <img src="/assets/showcase/nike-af1.jpg" alt="Nike Air Force 1 dancing in urban setting" />
          <p className="caption">New Arrivals: Nike Air Force 1</p>
        !</div>
      </div>

      {/* --- NEW: Actual Contact Details in Full --- */}
      <div className="actual-contact-details">
        <h3>Direct Contact Information</h3>
        <p><strong>WhatsApp:</strong> 063 614 0298</p>
        <p><strong>Email:</strong> info.mrstepup@gmail.com</p>
        <p><strong>TikTok:</strong> @Truthdecoded0</p>
        <p><strong>Instagram:</strong> @MrStepUpSneakers</p>
      </div>
      {/* --- END NEW --- */}

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
          rel="noopener noreferrer"
          className="contact-btn instagram-btn"
          aria-label="Connect on Instagram"
        >
          <i className="bi bi-instagram"></i> Instagram
        </a>

        <a
          href="https://www.tiktok.com/@Truthdecoded0"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-btn tiktok-btn"
          aria-label="Connect on TikTok"
        >
          <i className="bi bi-tiktok"></i> TikTok
        </a>
      </div>
    </section>
  );
}