// src/context/ThemeContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { AuthContext } from './AuthContext'; // Ensure AuthContext is correctly imported

export const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const { currentUser, loading: authLoading } = useContext(AuthContext);
  const [theme, setTheme] = useState('light'); // Default to 'light' initially
  const [loading, setLoading] = useState(true); // Internal loading state for theme

  useEffect(() => {
    // Only proceed if AuthContext has finished loading its authentication state
    if (authLoading) return;

    const loadTheme = async () => {
      if (currentUser) {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().theme) {
            setTheme(docSnap.data().theme);
          } else {
            // If user exists but no theme saved in Firestore, default to 'light'
            // and save it to Firestore for consistency.
            setTheme('light');
            await setDoc(docRef, { theme: 'light' }, { merge: true });
          }
        } catch (error) {
          console.error('Error loading theme from Firestore:', error);
          // Fallback to localStorage if Firestore fails
          const storedTheme = localStorage.getItem('theme');
          setTheme(storedTheme || 'light');
        }
      } else {
        // No current user, load theme from localStorage
        const storedTheme = localStorage.getItem('theme');
        setTheme(storedTheme || 'light');
      }
      setLoading(false); // Theme loading is complete
    };

    loadTheme();
  }, [authLoading, currentUser]); // Rerun when auth state or currentUser changes

  useEffect(() => {
    // Only apply theme to DOM and save to localStorage/Firestore once theme is loaded
    if (loading) return; // Wait until initial theme loading is complete

    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme); // Apply to body too for better consistency
    localStorage.setItem('theme', theme);

    // Save to Firestore only if a user is logged in
    if (currentUser) {
      const saveTheme = async () => {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          await setDoc(docRef, { theme }, { merge: true });
        } catch (error) {
          console.error('Error saving theme to Firestore:', error);
        }
      };
      // Debounce saving to Firestore if desired, though immediate save is often fine for theme
      saveTheme();
    }
  }, [theme, currentUser, loading]); // Rerun when theme, user, or loading status changes

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  // Display loading animation if either AuthContext or ThemeContext is still loading
  if (loading || authLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading theme and user data...</p>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};