import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ cartItemCount, searchTerm, setSearchTerm }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navbarRef = useRef(null);
  const dropdownRef = useRef(null);
  const dropdownButtonRef = useRef(null);
  const navigate = useNavigate();

  // Initialize dark mode from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark";
    setIsDarkMode(isDark);
    document.documentElement.setAttribute("data-theme", savedTheme || "light");
  }, []);

  // Toggle navbar collapse (mobile)
  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
    setIsDropdownOpen(false);
  };

  // Close navbar & dropdown
  const closeNavbar = () => {
    setIsCollapsed(true);
    setIsDropdownOpen(false);
  };

  // Toggle dropdown menu inside navbar
  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  // Handle search input changes and navigate if needed
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (window.location.pathname !== "/products") {
      navigate("/products");
    }
  };

  // Prevent form submit default and navigate if needed
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (window.location.pathname !== "/products") {
      navigate("/products");
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    const theme = newDarkMode ? "dark" : "light";
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  };

  // Close navbar and dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (!isCollapsed && navbarRef.current && !navbarRef.current.contains(event.target)) {
        closeNavbar();
      }
      if (
        isDropdownOpen &&
        dropdownRef.current &&
        dropdownButtonRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !dropdownButtonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCollapsed, isDropdownOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsDropdownOpen(false);
        setIsCollapsed(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <nav
      className="navbar navbar-expand-lg bg-body-tertiary fixed-top app-navbar"
      ref={navbarRef}
    >
      <div className="container-fluid">
        <Link className="navbar-brand" to="/" onClick={closeNavbar}>
          Mr StepUp.co
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNavDropdown"
          aria-expanded={!isCollapsed}
          aria-label="Toggle navigation"
          onClick={toggleNavbar}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
          className={`collapse navbar-collapse justify-content-center ${
            isCollapsed ? "" : "show"
          }`}
          id="navbarNavDropdown"
        >
          {/* Search Bar */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 search-bar-left">
            <li className="nav-item">
              <form className="d-flex" role="search" onSubmit={handleSearchSubmit}>
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search sneakers..."
                  aria-label="Search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </form>
            </li>
          </ul>

          {/* Main Navigation Links */}
          <ul className="navbar-nav mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" to="/" onClick={closeNavbar}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products" onClick={closeNavbar}>
                Sneakers
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/brands" onClick={closeNavbar}>
                Brands
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact" onClick={closeNavbar}>
                Contact
              </Link>
            </li>
            <li className="nav-item dropdown">
              <button
                className={`nav-link dropdown-toggle btn btn-link ${isDropdownOpen ? "show" : ""}`}
                id="navbarDropdown"
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
                type="button"
                onClick={toggleDropdown}
                ref={dropdownButtonRef}
              >
                More
              </button>
              <ul
                className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}
                aria-labelledby="navbarDropdown"
                role="menu"
                ref={dropdownRef}
              >
                <li role="menuitem">
                  <Link className="dropdown-item" to="/coming-soon" onClick={closeNavbar}>
                    Promotions
                  </Link>
                </li>
                <li role="menuitem">
                  <Link className="dropdown-item" to="/coming-soon" onClick={closeNavbar}>
                    About Us
                  </Link>
                </li>
                <li role="menuitem">
                  <Link className="dropdown-item" to="/coming-soon" onClick={closeNavbar}>
                    FAQ
                  </Link>
                </li>
                <li role="menuitem">
                  <Link className="dropdown-item" to="/order-history" onClick={closeNavbar}>
                    My Orders
                  </Link>
                </li>
                <li role="menuitem">
                  <Link
                    className="dropdown-item admin-link"
                    to="/admin/products"
                    onClick={closeNavbar}
                  >
                    Manage Products
                  </Link>
                </li>
              </ul>
            </li>
          </ul>

          {/* Right Nav: Cart and Dark Mode Toggle */}
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            <li className="nav-item">
              <Link className="nav-link cart-icon-link" to="/cart" onClick={closeNavbar}>
                🛒 Cart{" "}
                {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
              </Link>
            </li>
            <li className="nav-item">
              <button
                className="btn btn-outline-secondary ms-2"
                onClick={toggleDarkMode}
                aria-label="Toggle dark mode"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? "☀️ Light" : "🌙 Dark"}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
