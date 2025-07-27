import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    // Redirect to login page if not logged in
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
