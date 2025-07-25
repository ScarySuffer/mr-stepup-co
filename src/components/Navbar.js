// src/components/Navbar.js
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ cartItemCount, searchTerm, setSearchTerm }) {
  const [isCollapsed, setIsCollapsed] = useState(true); // State for main navbar collapse
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for "More" dropdown
  const navbarRef = useRef(null); // Ref for the entire navbar to detect clicks outside
  const dropdownRef = useRef(null); // Ref for the dropdown menu itself
  const dropdownButtonRef = useRef(null); // Ref for the dropdown toggle button

  const navigate = useNavigate();

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
    // When main navbar toggles, ensure dropdown is closed
    setIsDropdownOpen(false);
  };

  // Function to close the main navbar (used for nav links and outside clicks)
  const closeNavbar = () => {
    setIsCollapsed(true);
    setIsDropdownOpen(false); // Also close dropdown when main nav closes
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Stop event from bubbling up to document click outside listener
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
    const handleClickOutside = (event) => {
      // Close main navbar if click outside navbarRef AND it's currently open
      if (
        isCollapsed === false && // Only close if it's currently open
        navbarRef.current &&
        !navbarRef.current.contains(event.target)
      ) {
        closeNavbar(); // Use the dedicated close function
      }

      // Close dropdown if click outside dropdown button or menu AND it's open
      if (
        isDropdownOpen &&
        dropdownRef.current &&
        dropdownButtonRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !dropdownButtonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCollapsed, isDropdownOpen]); // Depend on these states to re-add listener if they change

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top" ref={navbarRef}> {/* ADDED fixed-top */}
      <div className="container-fluid">
        <Link className="navbar-brand" to="/" onClick={closeNavbar}> {/* ADDED onClick */}
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

          <ul className="navbar-nav mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" to="/" onClick={closeNavbar}> {/* ADDED onClick */}
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products" onClick={closeNavbar}> {/* ADDED onClick */}
                Sneakers
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/brands" onClick={closeNavbar}> {/* ADDED onClick */}
                Brands
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact" onClick={closeNavbar}> {/* ADDED onClick */}
                Contact
              </Link>
            </li>
            <li className="nav-item dropdown">
              <button
                className={`nav-link dropdown-toggle btn btn-link ${
                  isDropdownOpen ? "show" : ""
                }`}
                id="navbarDropdown"
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
                ref={dropdownRef}
              >
                <li>
                  <Link className="dropdown-item" to="/coming-soon" onClick={closeNavbar}> {/* ADDED onClick */}
                    Promotions
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/coming-soon" onClick={closeNavbar}> {/* ADDED onClick */}
                    About Us
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/coming-soon" onClick={closeNavbar}> {/* ADDED onClick */}
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/order-history" onClick={closeNavbar}> {/* ADDED onClick */}
                    My Orders
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item admin-link" to="/admin/products" onClick={closeNavbar}> {/* ADDED onClick */}
                    Manage Products (Admin)
                  </Link>
                </li>
              </ul>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link cart-icon-link" to="/cart" onClick={closeNavbar}> {/* ADDED onClick */}
                🛒 Cart{" "}
                {cartItemCount > 0 && (
                  <span className="cart-badge">{cartItemCount}</span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}