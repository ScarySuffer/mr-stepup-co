import React, { useState, useContext, useEffect } from "react";
// REMOVED: import { auth } from "../firebase/firebaseConfig"; // No longer needed here as context handles auth instance
// REMOVED: import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, } from "firebase/auth"; // No longer needed as context provides methods
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; 

// Import React Icons
import { FaUserPlus, FaSignInAlt, FaSignOutAlt, FaEnvelope, FaLock, FaSpinner, FaUserCheck } from 'react-icons/fa';

import './Auth.css';

export default function Auth({ mode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(mode === 'signup');
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Local loading state for Auth component's forms

  // Correctly destructure all properties from AuthContext
  const { 
    currentUser, 
    signIn: authContextSignIn, 
    signUp: authContextSignUp, 
    signOut: authContextSignOut, 
    loading: authContextLoading // Use loading from context for initial state
  } = useContext(AuthContext); 

  const navigate = useNavigate();

  // Use this useEffect to ensure isRegister state matches the URL mode
  useEffect(() => {
    setIsRegister(mode === 'signup');
    setError(""); // Clear error when mode changes
  }, [mode]);

  // If user is already logged in, redirect them away from login/signup pages
  useEffect(() => {
    // Only redirect if authContextLoading is false (auth state is determined)
    if (!authContextLoading && currentUser) {
      navigate("/"); // Redirect to home if user is already logged in
    }
  }, [currentUser, navigate, authContextLoading]);


  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return false;
    }
    setError("");
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true); // Start local loading
    setError("");
    try {
      await authContextSignUp(email, password); // Use context's signUp method
      // AuthContext's useEffect will handle navigation after successful sign up
    } catch (err) {
      setError(err.message);
    }
    setLoading(false); // End local loading
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true); // Start local loading
    setError("");
    try {
      await authContextSignIn(email, password); // Use context's signIn method
      // AuthContext's useEffect will handle navigation after successful login
    } catch (err) {
      setError(err.message);
    }
    setLoading(false); // End local loading
  };

  const handleLogout = async () => {
    setLoading(true); // Start local loading
    try {
      await authContextSignOut(); // Use context's signOut method
      setEmail("");
      setPassword("");
      setError("");
      // AuthContext's useEffect will handle navigation after successful logout
    } catch (err) {
      setError(err.message);
    }
    setLoading(false); // End local loading
  };

  // Render when user is logged in (if they somehow navigate back to /login or /signup)
  if (currentUser) {
    return (
      <div className="auth-page-wrapper">
        <div className="auth-container logged-in-state">
          <p className="welcome-message">
            <FaUserCheck className="icon-large" /> Welcome, <strong>{currentUser.email}</strong>
          </p>
          <button
            onClick={handleLogout}
            className="auth-button logout-button"
            disabled={loading} // Use local loading state
            aria-busy={loading}
          >
            {loading ? <FaSpinner className="spinner" /> : <FaSignOutAlt className="mr-2" />}
            {loading ? "Logging out..." : "Logout"}
          </button>
          {error && (
            <p className="auth-error" aria-live="polite">{error}</p>
          )}
        </div>
      </div>
    );
  }

  // Render login/register form
  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <h3 className="auth-title">
          {isRegister ? <><FaUserPlus className="mr-2" /> Register</> : <><FaSignInAlt className="mr-2" /> Login</>}
        </h3>
        <form onSubmit={isRegister ? handleRegister : handleLogin} noValidate className="auth-form">
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              disabled={loading} // Use local loading state
              required
            />
          </div>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              disabled={loading} // Use local loading state
              required
            />
          </div>
          <button
            type="submit"
            className="auth-button"
            disabled={loading} // Use local loading state
            aria-busy={loading}
          >
            {loading ? (
              <FaSpinner className="spinner mr-2" />
            ) : (
              isRegister ? <FaUserPlus className="mr-2" /> : <FaSignInAlt className="mr-2" />
            )}
            {loading ? (isRegister ? "Registering..." : "Logging in...") : (isRegister ? "Register" : "Login")}
          </button>
        </form>

        {error && (
          <p className="auth-error" aria-live="polite">
            {error}
          </p>
        )}

        <p className="auth-toggle-text">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <button
                onClick={() => {
                  setIsRegister(false);
                  setError("");
                }}
                disabled={loading} // Use local loading state
                className="auth-toggle-button"
                type="button"
              >
                Login
              </button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => {
                  setIsRegister(true);
                  setError("");
                }}
                disabled={loading} // Use local loading state
                className="auth-toggle-button"
                type="button"
              >
                Register
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}