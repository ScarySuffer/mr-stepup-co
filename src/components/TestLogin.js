// src/components/TestLogin.js
import React, { useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export default function TestLogin() {
  useEffect(() => {
    async function testLogin() {
      try {
        const email = "dynamicgenholdings@gmail.com";
        const password = "@Dynamic1619"; // replace with real password
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Login success:", userCredential.user);
      } catch (error) {
        console.error("Login failed:", error.code, error.message);
      }
    }
    testLogin();
  }, []);

  return <div>Testing login... Check console for results</div>;
}
