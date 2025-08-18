import React, { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
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
      setLoading(false);
      setAuthError(null);

      if (user && (window.location.pathname === "/login" || window.location.pathname === "/signup")) {
        navigate("/");
      }
    });
    return unsubscribe;
  }, [navigate]);

  const signIn = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setAuthError(error.message);
      setLoading(false);
      throw error;
    }
    setLoading(false);
  };

  const signUp = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setAuthError(error.message);
      setLoading(false);
      throw error;
    }
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      setAuthError(error.message);
    }
    setLoading(false);
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

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
      value={{ currentUser, signIn, signUp, signOut, authError, loading, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}
