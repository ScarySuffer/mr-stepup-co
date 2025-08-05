import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

import { auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";

// Import the new icons for light/dark mode
import { FaSun, FaMoon } from 'react-icons/fa';

const AuthLinks = ({ user, handleLogout, closeNavbar }) => {
  if (!user) {
    return (
      <>
        <li className="nav-item">
          <Link className="nav-link" to="/login" onClick={closeNavbar}>
            Login
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/signup" onClick={closeNavbar}>
            Signup
          </Link>
        </li>
      </>
    );
  }
  return (
    <>
      <li className="nav-item nav-user-email">
        <span className="nav-link disabled" tabIndex={-1}>
          {user.email}
        </span>
      </li>
      <li className="nav-item">
        <button
          className="btn btn-link nav-link"
          onClick={async () => {
            await handleLogout();
            closeNavbar();
          }}
        >
          Logout
        </button>
      </li>
    </>
  );
};

export default function Navbar({ cartItemCount, searchTerm, setSearchTerm }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navbarRef = useRef(null);
  const dropdownRef = useRef(null);
  const dropdownButtonRef = useRef(null);
  const navigate = useNavigate();

  const { theme, toggleTheme } = useContext(ThemeContext);
  const [user, setUser] = useState(null);
  const [togglerIconColor, setTogglerIconColor] = useState(''); // State to hold dynamic toggler color

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  // Effect to update toggler icon color when theme changes
  useEffect(() => {
    // Get the computed style of the document element to access CSS variables
    const computedStyle = getComputedStyle(document.documentElement);
    const color = computedStyle.getPropertyValue('--navbar-toggler-icon-color').trim();
    // Bootstrap expects hex without '#', so remove it and encode
    setTogglerIconColor(color.replace('#', ''));
  }, [theme]); // Re-run when the theme changes


  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
    setIsDropdownOpen(false);
  };

  const closeNavbar = () => {
    setIsCollapsed(true);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (window.location.pathname !== "/products") {
      navigate("/products");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (window.location.pathname !== "/products") {
      navigate("/products");
    }
  };

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

  // Dynamically generate the toggler icon SVG background-image
  const togglerIconSvg = `data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='%23${togglerIconColor}' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e`;


  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top app-navbar" ref={navbarRef}>
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
          {/* Apply dynamic background image to the toggler icon span */}
          <span className="navbar-toggler-icon" style={{ backgroundImage: `url("${togglerIconSvg}")` }} />
        </button>

        <div
          className={`collapse navbar-collapse justify-content-center ${isCollapsed ? "" : "show"}`}
          id="navbarNavDropdown"
        >
          {/* Search Bar */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 search-bar-left">
            <li className="nav-item">
              <form className="d-flex" role="search" onSubmit={handleSearchSubmit}>
                <input
                  name="search"
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

          {/* Right Nav: Cart, Dark Mode Toggle and Auth Links */}
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            <li className="nav-item">
              <Link className="nav-link cart-icon-link" to="/cart" onClick={closeNavbar}>
                🛒 Cart{" "}
                {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
              </Link>
            </li>
            <li className="nav-item">
              <button
                className="btn btn-outline-secondary ms-2 d-flex align-items-center justify-content-center theme-toggle-btn" // Added a new class `theme-toggle-btn`
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
                title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {theme === "dark" ? (
                  <FaSun className="theme-icon sun-icon" /> // Added classes for styling
                ) : (
                  <FaMoon className="theme-icon moon-icon" /> // Added classes for styling
                )}
              </button>
            </li>

            {/* Auth links */}
            <AuthLinks user={user} handleLogout={handleLogout} closeNavbar={closeNavbar} />
          </ul>
        </div>
      </div>
    </nav>
  );
}