import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const navbarRef = useRef(null);

  // Toggle navbar collapse on toggler click
  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Close navbar if click outside or on a nav-link
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!navbarRef.current) return;

      // If clicked outside navbar, collapse it
      if (!navbarRef.current.contains(event.target)) {
        setIsCollapsed(true);
        return;
      }

      // If clicked on a nav-link inside navbar, collapse it
      if (event.target.classList.contains("nav-link")) {
        setIsCollapsed(true);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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
          <ul className="navbar-nav">
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
              <button
                className="nav-link dropdown-toggle btn btn-link"
                id="navbarDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                type="button"
              >
                Dropdown link
              </button>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <Link className="dropdown-item" to="/coming-soon">
                    Action
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/coming-soon">
                    Another action
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/coming-soon">
                    Something else here
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
