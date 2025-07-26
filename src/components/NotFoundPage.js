import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css'; // Make sure this CSS file is next to this JS file

export default function NotFoundPage() {
  return (
    <div className="not-found-container">
      {/* The image is now set as a CSS background, so the <img> tag is removed */}
      {/* <img src="/assets/images/404.png" alt="Page Not Found Illustration" className="not-found-image" /> */}

      <h1 className="not-found-title">404 - Page Not Found</h1>
      <p className="not-found-message">
        Oops! It looks like this page took a wrong turn.
      </p>
      <p className="not-found-description">
        Don't worry, even the best navigators get lost sometimes. The sneaker you're looking for might have run off, or the page never existed.
      </p>

      <div className="not-found-links">
        <Link to="/" className="not-found-cta-link primary-link">
          <i className="fas fa-home"></i> Go to Homepage
        </Link>
        <Link to="/products" className="not-found-cta-link secondary-link">
          <i className="fas fa-shoe-prints"></i> Browse All Sneakers
        </Link>
        <Link to="/contact" className="not-found-cta-link tertiary-link">
          <i className="fas fa-question-circle"></i> Contact Support
        </Link>
      </div>

      <p className="not-found-small-print">
        If you typed the address, double-check it. Otherwise, let's get you back to finding your perfect pair!
      </p>
    </div>
  );
}