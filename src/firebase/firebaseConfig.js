// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCk2zzip9EqgsM_h3MgTenjvqpmtJWag7g",
  authDomain: "mr-stepup-store.firebaseapp.com",
  projectId: "mr-stepup-store",
  storageBucket: "mr-stepup-store.appspot.com",
  messagingSenderId: "14103586348",
  appId: "1:14103586348:web:6e66b38f3c80497e9c9389"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize and export Auth and Firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);
