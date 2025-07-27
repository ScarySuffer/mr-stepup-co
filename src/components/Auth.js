import React, { useState, useContext, useEffect } from "react";
import { auth } from "../firebase/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Import useNavigate

// Import React Icons
import { FaUserPlus, FaSignInAlt, FaSignOutAlt, FaEnvelope, FaLock, FaSpinner, FaUserCheck } from 'react-icons/fa';

import './Auth.css';

export default function Auth({ mode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(mode === 'signup');
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { currentUser, signIn: authContextSignIn, signUp: authContextSignUp, signOut: authContextSignOut } = useContext(AuthContext);
  const navigate = useNavigate(); // Get navigate from react-router-dom

  // Use this useEffect to ensure isRegister state matches the URL mode
  useEffect(() => {
    setIsRegister(mode === 'signup');
    setError(""); // Clear error when mode changes
  }, [mode]);

  // If user is already logged in, redirect them away from login/signup pages
  useEffect(() => {
    if (currentUser) {
      navigate("/"); // Redirect to home if user is already logged in
    }
  }, [currentUser, navigate]);


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
    setLoading(true);
    setError("");
    try {
      await authContextSignUp(email, password); // Use context's signUp method
      // Context will handle navigation after successful sign up
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError("");
    try {
      await authContextSignIn(email, password); // Use context's signIn method
      // Context will handle navigation after successful login
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await authContextSignOut(); // Use context's signOut method
      setEmail("");
      setPassword("");
      setError("");
      // Context will handle navigation after successful logout
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Render when user is logged in (if they somehow navigate back to /login or /signup)
  if (currentUser) {
    return (
      // New full-screen wrapper for the Auth component
      <div className="auth-page-wrapper">
        <div className="auth-container logged-in-state">
          <p className="welcome-message">
            <FaUserCheck className="icon-large" /> Welcome, <strong>{currentUser.email}</strong>
          </p>
          <button
            onClick={handleLogout}
            className="auth-button logout-button"
            disabled={loading}
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
    // New full-screen wrapper for the Auth component
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
              disabled={loading}
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
              disabled={loading}
              required
            />
          </div>
          <button
            type="submit"
            className="auth-button"
            disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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