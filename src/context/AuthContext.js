// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // will include role and other data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      // Get user document from Firestore
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      let userData;
      if (!docSnap.exists()) {
        // Create default user document if none exists
        userData = {
          cart: [],
          pastOrders: [],
          theme: "light",
          role: "user", // default role
        };
        await setDoc(userRef, userData);
      } else {
        userData = docSnap.data();
      }

      // Merge Firebase Auth user info with Firestore data
      setCurrentUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        ...userData,
      });

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
