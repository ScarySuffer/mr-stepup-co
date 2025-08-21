import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";

import { auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";

import { FaSun, FaMoon } from 'react-icons/fa';
import logo from "../assets/mr-step-up-logo.jpg";
import Modal from "./Modal";

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

  const { theme, toggleTheme } = useTheme();
  const { isAdmin } = useContext(AuthContext); // ✅ 'loading' has been removed
  const [user, setUser] = useState(null);
  const [togglerIconColor, setTogglerIconColor] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const computedStyle = getComputedStyle(document.documentElement);
    const color = computedStyle.getPropertyValue('--navbar-toggler-icon-color').trim();
    setTogglerIconColor(color.replace('#', ''));
  }, [theme]);

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

  const handleManageProductsClick = (e) => {
    e.preventDefault();
    closeNavbar();
    if (isAdmin) {
      navigate("/admin/products");
    } else {
      setShowModal(true);
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

  const togglerIconSvg = `data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='%23${togglerIconColor}' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e`;


  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top app-navbar" ref={navbarRef}>
        <div className="container-fluid">
          <Link className="navbar-brand" to="/" onClick={closeNavbar}>
            <img
              src={logo}
              alt="Mr StepUp Logo"
              className="navbar-logo"
              style={{ height: "40px", objectFit: "contain" }}
            />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            aria-controls="navbarNavDropdown"
            aria-expanded={!isCollapsed}
            aria-label="Toggle navigation"
            onClick={toggleNavbar}
          >
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
                    <button
                      className="dropdown-item admin-link"
                      onClick={handleManageProductsClick}
                    >
                      Manage Products
                    </button>
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
                  className="btn btn-outline-secondary ms-2 d-flex align-items-center justify-content-center theme-toggle-btn"
                  onClick={toggleTheme}
                  aria-label="Toggle dark mode"
                  title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {theme === "dark" ? (
                    <FaSun className="theme-icon sun-icon" />
                  ) : (
                    <FaMoon className="theme-icon moon-icon" />
                  )}
                </button>
              </li>

              {/* Auth links */}
              <AuthLinks user={user} handleLogout={handleLogout} closeNavbar={closeNavbar} />
            </ul>
          </div>
        </div>
      </nav>

      {/* The Admin Unauthorized Modal */}
      <Modal 
        show={showModal} 
        onClose={() => setShowModal(false)}
        title="Access Denied"
      >
        <p>You do not have the necessary administrator privileges to access this page.</p>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button 
            onClick={() => setShowModal(false)} 
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#dc3545', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer' 
            }}
          >
            Close
          </button>
        </div>
      </Modal>
    </>
  );
}