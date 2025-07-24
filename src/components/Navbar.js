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

  const toggleDropdown = (e) => {
    // Prevent the default button behavior if it interferes with React state
    e.preventDefault();
    e.stopPropagation(); // Stop event from bubbling up to document click outside listener
    setIsDropdownOpen(prev => !prev);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (window.location.pathname !== '/products') {
        navigate('/products');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (window.location.pathname !== '/products') {
        navigate('/products');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close main navbar if click outside navbarRef
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsCollapsed(true);
      }

      // Close dropdown if click outside dropdown button or menu
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

    document.addEventListener("mousedown", handleClickOutside); // Use mousedown for better outside click detection
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCollapsed, isDropdownOpen]); // Depend on these states to re-add listener if they change

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary" ref={navbarRef}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
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
          className={`collapse navbar-collapse ${isCollapsed ? "" : "show"}`}
          id="navbarNavDropdown"
        >
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item search-bar-item">
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

            <li className="nav-item">
              <Link className="nav-link active" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products">
                Sneakers
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/brands">
                Brands
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Contact
              </Link>
            </li>
            <li className="nav-item dropdown">
              {/* This button now directly controls the dropdown state */}
              <button
                className={`nav-link dropdown-toggle btn btn-link ${isDropdownOpen ? 'show' : ''}`}
                id="navbarDropdown"
                aria-expanded={isDropdownOpen} // Set aria-expanded based on state
                type="button"
                onClick={toggleDropdown} // Use React's onClick to toggle dropdown
                ref={dropdownButtonRef} // Attach ref to button
              >
                More
              </button>
              {/* Apply 'show' class conditionally based on state */}
              <ul
                className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}
                aria-labelledby="navbarDropdown"
                ref={dropdownRef} // Attach ref to menu
              >
                <li>
                  <Link className="dropdown-item" to="/coming-soon">
                    Promotions
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/coming-soon">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/coming-soon">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/order-history">
                    My Orders
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item admin-link" to="/admin/products">
                    Manage Products (Admin)
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link cart-icon-link" to="/cart">
                🛒 Cart {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}