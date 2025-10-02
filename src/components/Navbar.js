import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Modal from "./Modal";

import "./Navbar.css";
import logo from "../assets/Mr-Step-Up-logos.jpg"; // Local logo

export default function Navbar({ cartItemCount, searchTerm, setSearchTerm }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const navbarRef = useRef(null);
  const dropdownRef = useRef(null);
  const dropdownButtonRef = useRef(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const snap = await getDoc(userRef);
          setUserRole(snap.exists() ? snap.data().role || "user" : "user");
        } catch (err) {
          console.error("Error reading user role:", err);
          setUserRole("user");
        }
      } else {
        setUserRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

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
    if (window.location.pathname !== "/products") navigate("/products");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (window.location.pathname !== "/products") navigate("/products");
  };

  const handleManageProductsClick = () => {
    if (!currentUser) {
      setModalMessage("You need to log in to access this page.");
      setShowLoginModal(true);
    } else if (userRole !== "admin") {
      setModalMessage("You do not have the necessary administrator privileges to access this page.");
      setShowLoginModal(true);
    } else {
      navigate("/admin/products");
    }
    closeNavbar();
  };

  const handleProtectedClick = (action) => {
    if (!currentUser) {
      setModalMessage(`You must be logged in to view your ${action === "checkout" ? "checkout" : "order history"}.`);
      setShowLoginModal(true);
    } else {
      navigate(action === "checkout" ? "/checkout" : "/order-history");
    }
    closeNavbar();
  };

  const handleLogout = async () => {
    await signOut(auth);
    closeNavbar();
    navigate("/");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) closeNavbar();
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
  }, [isDropdownOpen]);

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top app-navbar" ref={navbarRef}>
        <div className="container-fluid">
          <Link className="navbar-brand" to="/" onClick={closeNavbar}>
            <img src={logo} alt="Mr StepUp Logo" className="navbar-logo" />
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

          <div className={`collapse navbar-collapse ${isCollapsed ? "" : "show"}`}>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <form className="d-flex" role="search" onSubmit={handleSearchSubmit}>
                  <input
                    type="search"
                    placeholder="Search sneakers..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="form-control me-2"
                  />
                </form>
              </li>
            </ul>

            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item"><Link className="nav-link" to="/" onClick={closeNavbar}>Home</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/products" onClick={closeNavbar}>Shop</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/brands" onClick={closeNavbar}>Discover</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/contact" onClick={closeNavbar}>Contact</Link></li>
              <li className="nav-item dropdown">
                <button
                  className={`nav-link dropdown-toggle btn btn-link ${isDropdownOpen ? "show" : ""}`}
                  id="navbarDropdown"
                  type="button"
                  onClick={toggleDropdown}
                  ref={dropdownButtonRef}
                >
                  More
                </button>
                <ul className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`} ref={dropdownRef}>
                  <li><Link className="dropdown-item" to="/coming-soon" onClick={closeNavbar}>Promotions</Link></li>
                  <li><Link className="dropdown-item" to="/coming-soon" onClick={closeNavbar}>About Us</Link></li>
                  <li><Link className="dropdown-item" to="/coming-soon" onClick={closeNavbar}>FAQ</Link></li>
                  <li>
                    <button className="dropdown-item" onClick={() => handleProtectedClick("order-history")}>
                      My Orders
                    </button>
                  </li>
                  {userRole === 'admin' && (
                    <li>
                      <button className="dropdown-item admin-link" onClick={handleManageProductsClick}>
                        Manage Products
                      </button>
                    </li>
                  )}
                </ul>
              </li>
            </ul>

            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
              <li className="nav-item">
                <Link className="nav-link" to="/cart" onClick={closeNavbar}>
                  🛒 Cart {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
                </Link>
              </li>

              <li className="nav-item">
                <button
                  className="btn btn-outline-secondary ms-2 d-flex align-items-center justify-content-center theme-toggle-btn"
                  onClick={toggleTheme}
                  title={`Toggle to ${theme === "dark" ? "light" : "dark"} mode`}
                >
                  {theme === "dark" ? '☀️' : '🌙'}
                </button>
              </li>

              {currentUser ? (
                <>
                  <li className="nav-item"><span className="nav-link disabled">{currentUser.email}</span></li>
                  <li className="nav-item"><button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button></li>
                </>
              ) : (
                <li className="nav-item"><Link className="nav-link" to="/auth" onClick={closeNavbar}>Login / Signup</Link></li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <Modal show={showLoginModal} onClose={() => setShowLoginModal(false)} title="Login Required">
        <p>{modalMessage}</p>
        <div className="modal-actions">
          <button
            onClick={() => {
              setShowLoginModal(false);
              navigate("/auth");
            }}
            className="modal-login-btn"
          >
            Login
          </button>
        </div>
      </Modal>
    </>
  );
}
