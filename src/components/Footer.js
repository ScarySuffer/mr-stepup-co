import React from "react";
import "./Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear(); // Get the current year dynamically

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Use the dynamically obtained currentYear */}
        <p>© {currentYear} Mr StepUp.co — All rights reserved.</p>
        <div className="social-links">
          {/* Email Icon Link */}
          <a
            href="mailto:info.mrstepup@gmail.com"
            aria-label="Email"
            className="icon-link" // Keep icon-link class for consistent styling
          >
            <i className="bi bi-envelope"></i> {/* Email icon only */}
          </a>
          {/* LinkedIn Link (Example - remember to replace with your actual URL) */}
          <a
            href="https://www.linkedin.com/company/mrstepup"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="icon-link"
          >
            <i className="bi bi-linkedin"></i>
          </a>
          {/* Twitter Link (Example - remember to replace with your actual URL) */}
          <a
            href="https://twitter.com/mrstepup"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="icon-link"
          >
            <i className="bi bi-twitter"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}