import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">Mr StepUp.co</div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/products">Sneakers</Link></li>
        <li><Link to="/brands">Brands</Link></li> {/* New link */}
        <li><Link to="/contact">Contact</Link></li>
      </ul>
    </nav>
  );
}
