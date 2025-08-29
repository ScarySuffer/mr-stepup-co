// src/components/Auth.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import "./Auth.css";

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // "login" | "signup" | "forgot"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/");
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/");
      } else if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, email, password);
        navigate("/");
      } else if (mode === "forgot") {
        await sendPasswordResetEmail(auth, email);
        setMessage("Password reset email sent! Check your inbox.");
      }
    } catch (err) {
      console.error(err);
      // friendly error message
      if (err.code === "auth/user-not-found") setMessage("User not found.");
      else if (err.code === "auth/wrong-password") setMessage("Incorrect password.");
      else if (err.code === "auth/email-already-in-use") setMessage("Email already registered.");
      else setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>
        {mode === "login" ? "Login" : mode === "signup" ? "Sign Up" : "Reset Password"}
      </h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {mode !== "forgot" && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        )}
        <button type="submit" disabled={loading}>
          {loading
            ? "Processing..."
            : mode === "login"
            ? "Login"
            : mode === "signup"
            ? "Sign Up"
            : "Send Reset Email"}
        </button>
        {message && <p className="auth-message">{message}</p>}
      </form>

      <div className="auth-switch">
        {mode === "login" && (
          <>
            <p>
              Don't have an account?{" "}
              <span onClick={() => setMode("signup")}>Sign Up</span>
            </p>
            <p>
              Forgot your password?{" "}
              <span onClick={() => setMode("forgot")}>Reset Password</span>
            </p>
          </>
        )}
        {mode === "signup" && (
          <p>
            Already have an account?{" "}
            <span onClick={() => setMode("login")}>Login</span>
          </p>
        )}
        {mode === "forgot" && (
          <p>
            Remembered your password?{" "}
            <span onClick={() => setMode("login")}>Login</span>
          </p>
        )}
      </div>
    </div>
  );
}
