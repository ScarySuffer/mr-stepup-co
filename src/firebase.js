// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // <-- Add Firestore

const firebaseConfig = {
  apiKey: "AIzaSyAdeHNumdvhzhOEDIK6q-du6p-hjN38rJw",
  authDomain: "mrstepupdb.firebaseapp.com",
  projectId: "mrstepupdb",
  storageBucket: "mrstepupdb.firebasestorage.app",
  messagingSenderId: "795500912129",
  appId: "1:795500912129:web:6381ffec8a450c4666aa00",
  measurementId: "G-P18MLX9M9B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // <-- Export Firestore
