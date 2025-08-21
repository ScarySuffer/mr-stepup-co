import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAdminOnly = false }) => {
  const { currentUser, isAdmin, loading } = useContext(AuthContext);

  // If AuthContext is still loading, you might want to show a loading indicator
  // or simply return null until the auth state is determined.
  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <p>Checking authentication status...</p>
      </div>
    );
  }

  // If no user is logged in, redirect to the login page
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If the route requires admin privileges and the current user is not an admin,
  // redirect them to the home page or an unauthorized access page.
  if (isAdminOnly && !isAdmin) {
    // You could also navigate to a specific "/unauthorized" page if you have one
    return <Navigate to="/" replace />;
  }

  // If all checks pass (user is logged in, and if required, is admin), render the children
  return children;
};

export default ProtectedRoute;