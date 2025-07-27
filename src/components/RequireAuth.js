// src/components/RequireAuth.js
import React from 'react';
import { Link } from 'react-router-dom';

const RequireAuth = ({ user, children }) => {
  if (!user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>This page requires login.</h2>
        <p>
          <Link to="/login">
            <button style={{ padding: '10px 20px', marginTop: '20px' }}>
              Go to Login
            </button>
          </Link>
        </p>
      </div>
    );
  }
  return children;
};

export default RequireAuth;
