// src/context/ThemeContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { AuthContext } from './AuthContext';

export const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const { currentUser, authLoading } = useContext(AuthContext); // use authLoading
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return; // wait for auth state to finish

    const loadTheme = async () => {
      if (currentUser) {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().theme) {
            setTheme(docSnap.data().theme);
          } else {
            setTheme('light');
          }
        } catch (error) {
          console.error('Error loading theme from Firestore:', error);
          const storedTheme = localStorage.getItem('theme');
          setTheme(storedTheme || 'light');
        }
      } else {
        const storedTheme = localStorage.getItem('theme');
        setTheme(storedTheme || 'light');
      }
      setLoading(false);
    };

    loadTheme();
  }, [authLoading, currentUser]);

  useEffect(() => {
    if (loading) return;

    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (currentUser) {
      const saveTheme = async () => {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          await setDoc(docRef, { theme }, { merge: true });
        } catch (error) {
          console.error('Error saving theme to Firestore:', error);
        }
      };
      saveTheme();
    }
  }, [theme, currentUser, loading]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  if (loading || authLoading) return <div>Loading theme...</div>;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
