// src/context/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Create context
const ThemeContext = createContext();

// Provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(true);

  // Load theme from Firestore (if logged in) or localStorage
  useEffect(() => {
    const loadTheme = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists() && docSnap.data().theme) {
          setTheme(docSnap.data().theme);
        } else {
          setTheme(localStorage.getItem("theme") || "light");
        }
      } else {
        setTheme(localStorage.getItem("theme") || "light");
      }
      setLoading(false);
    };
    loadTheme();
  }, []);

  // Apply theme to document root & persist
  useEffect(() => {
    if (loading) return;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    // Save theme in Firestore if user is logged in
    const saveTheme = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(userRef, { theme }, { merge: true });
      }
    };
    saveTheme();
  }, [theme, loading]);

  // Toggle between 'light' and 'dark'
  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook for easy access
export const useTheme = () => useContext(ThemeContext);
