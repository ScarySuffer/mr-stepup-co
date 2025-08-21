import React, { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore"; // <-- Added setDoc here
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthError(null);

      setIsAdmin(false);

      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setIsAdmin(userData.isAdmin || false);
          } else {
            // Optional: If user document doesn't exist, create a basic one
            // This can be useful for new sign-ups to ensure a document exists
            // await setDoc(userDocRef, { email: user.email, isAdmin: false });
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
        }

        if (window.location.pathname === "/login" || window.location.pathname === "/signup") {
          navigate("/");
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
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
  };

  const signUp = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Immediately create a user document in Firestore for new users
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: userCredential.user.email,
        isAdmin: false,
        createdAt: new Date(),
      });
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
      navigate("/login");
    } catch (error) {
      setAuthError(error.message);
      setLoading(false);
      throw error;
    }
  };

  const resetPassword = async (email) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="loading-container" style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        minHeight: '100vh', fontSize: '1.2em', color: '#555'
      }}>
        <div className="spinner" style={{
          border: '4px solid rgba(0, 0, 0, 0.1)',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}></div>
        <p>Loading authentication status...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ currentUser, isAdmin, signIn, signUp, signOut, authError, loading, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}