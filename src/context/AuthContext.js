// src/context/AuthContext.js
import React, { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig"; // Assuming 'auth' is exported directly
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false); // Set loading to false once auth state is determined
      setAuthError(null);

      // --- RETAIN THIS BLOCK: If a user logs in WHILE on the /login page, navigate to home ---
      if (user) {
        if (window.location.pathname === "/login" || window.location.pathname === "/signup") {
          navigate("/"); // Redirect to home if user just logged in/signed up from auth page
        }
      }
    });
    return unsubscribe;
  }, [navigate]); // Added `auth` to dependency array to ensure consistent listener if 'auth' instance ever changed. **Correction: `auth` is a stable reference from firebaseConfig, so it usually doesn't need to be in the dependency array unless you expect it to change.** `Maps` is sufficient.

  const signIn = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // setLoading(false); // Handled by onAuthStateChanged listener
    } catch (error) {
      setAuthError(error.message);
      setLoading(false); // Only set loading to false here if onAuthStateChanged doesn't immediately fire for an error
      throw error;
    }
  };

  const signUp = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // setLoading(false); // Handled by onAuthStateChanged listener
    } catch (error) {
      setAuthError(error.message);
      setLoading(false); // Only set loading to false here if onAuthStateChanged doesn't immediately fire for an error
      throw error;
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      // setLoading(false); // Handled by onAuthStateChanged listener
    } catch (error) {
      setAuthError(error.message);
      setLoading(false); // Only set loading to false here if onAuthStateChanged doesn't immediately fire for an error
    }
  };

  // The loading animation component
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading authentication status...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ currentUser, signIn, signUp, signOut, authError, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}