// src/components/RequireAuth.js

import React, { useContext } from 'react';
// ➡️ Import Outlet for nested routes
import { Link, Outlet } from 'react-router-dom'; 
import { AuthContext } from '../context/AuthContext';
import './RequireAuth.css';

// ➡️ Remove the children prop from the function signature
const RequireAuth = ({ isAdminOnly = false }) => {
  const { currentUser, isAdmin, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>🔒 Access Denied</h2>
        <p>This page requires you to be logged in.</p>
        <p>
          <Link to="/login">
            <button style={{
              padding: '10px 20px',
              marginTop: '20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1em'
            }}>
              Go to Login
            </button>
          </Link>
        </p>
      </div>
    );
  }

  if (isAdminOnly && !isAdmin) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>🛑 Unauthorized Access</h2>
        <p>You do not have the necessary permissions to view this page.</p>
        <p>
          <Link to="/">
            <button style={{
              padding: '10px 20px',
              marginTop: '20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1em'
            }}>
              Go to Homepage
            </button>
          </Link>
        </p>
      </div>
    );
  }

  // ➡️ Render the Outlet component to show the matched child route
  return <Outlet />;
};

export default RequireAuth;