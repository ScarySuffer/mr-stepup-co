// src/context/AuthContext.js
import React, { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig"; // Assuming 'auth' is exported directly
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom"; // Keep useNavigate for potential future use or if signIn/signUp need to trigger it

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const navigate = useNavigate(); // Keep navigate if you use it in signIn/signUp/signOut for post-action redirects

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      setAuthError(null);

      // --- RETAIN THIS BLOCK: If a user logs in WHILE on the /login page, navigate to home ---
      if (user) {
        if (window.location.pathname === "/login" || window.location.pathname === "/signup") {
          navigate("/"); // Redirect to home if user just logged in/signed up from auth page
        }
      }
      // --- REMOVE THE 'ELSE' BLOCK FOR GLOBAL REDIRECT ---
      // The previous 'else' block that redirected to /login if !user is removed.
      // Now, if no user, currentUser will be null, and public pages will load normally.
      // Protected pages will use RequireAuth to handle unauthenticated access.
    });
    return unsubscribe;
  }, [navigate]); // Added `auth` to dependency array to ensure consistent listener if 'auth' instance ever changed

  const signIn = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      // Optional: Add a navigate here after successful login if you want to force navigation
      // navigate('/');
    } catch (error) {
      setAuthError(error.message);
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setLoading(false);
      // Optional: Add a navigate here after successful signup if you want to force navigation
      // navigate('/');
    } catch (error) {
      setAuthError(error.message);
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setLoading(false);
      // Optional: Navigate to home or login page after logout
      // navigate('/login'); // Or navigate('/');
    } catch (error) {
      setAuthError(error.message);
      setLoading(false);
    }
  };

  // Keep the loading spinner/message, it's good practice
  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        Loading authentication status...
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