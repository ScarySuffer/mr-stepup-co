import React, { useState, useContext, useEffect, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FaUserPlus,
  FaSignInAlt,
  FaSignOutAlt,
  FaEnvelope,
  FaLock,
  FaSpinner,
  FaUserCheck,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import "./Auth.css";

export default function Auth({ mode: initialMode }) {
  // Use a single state for the current mode, allowing direct manipulation
  const [currentMode, setCurrentMode] = useState(initialMode || "login"); // 'login', 'signup', 'forgot-password'

  // Consolidate form data into a single object
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [passwordValid, setPasswordValid] = useState({
    length: false,
    digit: false,
    special: false,
    uppercase: false,
    lowercase: false,
  });

  const {
    currentUser,
    signIn: authContextSignIn,
    signUp: authContextSignUp,
    signOut: authContextSignOut,
    resetPassword: authContextResetPassword,
    loading: authContextLoading,
  } = useContext(AuthContext);

  const navigate = useNavigate();

  // Effect to sync external `mode` prop with internal `currentMode` state
  useEffect(() => {
    setCurrentMode(initialMode || "login");
    // Also clear states when mode changes from parent
    setFormData({ email: "", password: "" });
    setError("");
    setSuccessMessage("");
    setShowPassword(false);
    setPasswordValid({
      length: false, digit: false, special: false, uppercase: false, lowercase: false,
    });
  }, [initialMode]);

  // Effect for redirection after successful authentication
  useEffect(() => {
    if (!authContextLoading && currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate, authContextLoading]);

  // Handle input changes, updating the formData state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Live password validation for signup mode
    if (name === "password" && currentMode === "signup") {
      validatePasswordStrength(value);
    }
  };

  // Password strength validation logic
  const validatePasswordStrength = useCallback((pwd) => {
    const validations = {
      length: pwd.length >= 8,
      digit: /\d/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
    };
    setPasswordValid(validations);
    return Object.values(validations).every(Boolean);
  }, []);

  // Centralized form validation
  const validateForm = useCallback(() => {
    setError(""); // Clear previous errors
    setSuccessMessage(""); // Clear previous success messages

    if (!formData.email.trim()) {
      setError("Email is required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (currentMode === "login" || currentMode === "signup") {
      if (!formData.password.trim()) {
        setError("Password is required.");
        return false;
      }
    }

    if (currentMode === "signup") {
      if (!validatePasswordStrength(formData.password)) {
        setError("Password does not meet all requirements.");
        return false;
      }
    }
    return true;
  }, [currentMode, formData.email, formData.password, validatePasswordStrength]);

  // Function to switch between modes and reset relevant states
  const handleModeSwitch = useCallback((newMode) => {
    setCurrentMode(newMode);
    setFormData({ email: "", password: "" }); // Reset form data
    setError(""); // Clear errors
    setSuccessMessage(""); // Clear success messages
    setShowPassword(false); // Reset password visibility
    setPasswordValid({ // Reset password validation for register
      length: false, digit: false, special: false, uppercase: false, lowercase: false,
    });
  }, []);

  // Single function to handle all form submissions
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    if (currentMode !== "forgot-password" && !validateForm()) {
        setLoading(false);
        return;
    }
    // Specific validation for forgot password as it only needs email
    if (currentMode === "forgot-password" && !formData.email.trim()) {
        setError("Please enter your email to reset password.");
        setLoading(false);
        return;
    }
    if (currentMode === "forgot-password" && !/\S+@\S+\.\S+/.test(formData.email)) {
        setError("Please enter a valid email address for password reset.");
        setLoading(false);
        return;
    }


    try {
      if (currentMode === "login") {
        await authContextSignIn(formData.email, formData.password);
        setSuccessMessage("Login successful! Redirecting...");
      } else if (currentMode === "signup") {
        await authContextSignUp(formData.email, formData.password);
        setSuccessMessage("Registration successful! Please login.");
        // Optionally switch to login mode after successful registration
        setTimeout(() => handleModeSwitch("login"), 2000);
      } else if (currentMode === "forgot-password") {
        await authContextResetPassword(formData.email);
        setSuccessMessage("Password reset email sent! Check your inbox.");
        // Optionally switch back to login mode after successful reset request
        setTimeout(() => handleModeSwitch("login"), 5000);
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    setLoading(true);
    try {
      await authContextSignOut();
      // Reset all states after logout
      setFormData({ email: "", password: "" });
      setError("");
      setSuccessMessage("You have been successfully logged out.");
      setCurrentMode("login"); // Default to login page after logout
    } catch (err) {
      setError(err.message || "Failed to log out.");
    } finally {
      setLoading(false);
    }
  };

  // Helper for input class (optional, could be handled in CSS with :valid/:invalid)
  const getInputClass = (field) => {
    if (!formData[field]) return "auth-input";
    if (field === "email") {
      return /\S+@\S+\.\S+/.test(formData.email) ? "auth-input valid" : "auth-input invalid";
    }
    if (field === "password" && currentMode === "signup") {
      return validatePasswordStrength(formData.password) ? "auth-input valid" : "auth-input invalid";
    }
    return "auth-input"; // Default for login password
  };

  // Render content based on authentication status
  if (currentUser) {
    return (
      <div className="auth-page-wrapper">
        <div className="auth-container logged-in-state">
          <p className="welcome-message">
            <FaUserCheck className="icon-large" /> Welcome, <strong>{currentUser.email}</strong>
          </p>
          <button
            onClick={handleLogout}
            className="auth-button logout-button"
            disabled={loading || authContextLoading}
            aria-busy={loading || authContextLoading}
          >
            {(loading || authContextLoading) ? <FaSpinner className="spinner" /> : <FaSignOutAlt className="mr-2" />}
            {(loading || authContextLoading) ? "Logging out..." : "Logout"}
          </button>
          {error && <p className="auth-error" aria-live="polite">{error}</p>}
        </div>
      </div>
    );
  }

  // Render authentication forms
  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <h3 className="auth-title">
          {currentMode === "forgot-password" ? (
            <>
              <FaEnvelope className="mr-2" /> Reset Password
            </>
          ) : currentMode === "signup" ? (
            <>
              <FaUserPlus className="mr-2" /> Register
            </>
          ) : (
            <>
              <FaSignInAlt className="mr-2" /> Login
            </>
          )}
        </h3>

        <div className="auth-form-wrapper">
          {/* Form for Login and Register */}
          <form
            onSubmit={handleSubmit}
            className={`auth-form-inner ${currentMode === "forgot-password" ? "auth-form-hidden" : "auth-form-visible"}`}
          >
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={getInputClass("email")}
                disabled={loading}
                required
              />
            </div>

            {/* Password input visible only for login and signup modes */}
            {currentMode !== "forgot-password" && (
              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={getInputClass("password")}
                  disabled={loading}
                  required
                />
                <span className="password-toggle" onClick={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            )}

            {/* Password requirements only for registration mode */}
            {currentMode === "signup" && (
              <div className="password-requirements">
                <p className={passwordValid.length ? "valid-msg" : "invalid-msg"}>• At least 8 characters</p>
                <p className={passwordValid.digit ? "valid-msg" : "invalid-msg"}>• At least 1 digit</p>
                <p className={passwordValid.special ? "valid-msg" : "invalid-msg"}>• At least 1 special character</p>
                <p className={passwordValid.uppercase ? "valid-msg" : "invalid-msg"}>• At least 1 uppercase letter</p>
                <p className={passwordValid.lowercase ? "valid-msg" : "invalid-msg"}>• At least 1 lowercase letter</p>
              </div>
            )}

            {/* Submit button for Login/Register */}
            {currentMode !== "forgot-password" && ( // Ensure button is only shown for these modes
              <button
                type="submit"
                className="auth-button"
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? (
                  <FaSpinner className="spinner mr-2" />
                ) : currentMode === "signup" ? (
                  <FaUserPlus className="mr-2" />
                ) : (
                  <FaSignInAlt className="mr-2" />
                )}
                {loading
                  ? currentMode === "signup"
                    ? "Registering..."
                    : "Logging in..."
                  : currentMode === "signup"
                    ? "Register"
                    : "Login"}
              </button>
            )}

            {/* Forgot Password Link - Only shown in login mode */}
            {currentMode === "login" && (
              <p className="forgot-password-text">
                <button
                  type="button"
                  className="auth-toggle-button"
                  onClick={() => handleModeSwitch("forgot-password")}
                  disabled={loading}
                >
                  Forgot Password?
                </button>
              </p>
            )}
          </form>

          {/* Forgot Password Form (separate form for onSubmit but shares email input) */}
          <form
            onSubmit={handleSubmit} // Re-using handleSubmit for forgot password
            className={`auth-form-inner ${currentMode === "forgot-password" ? "auth-form-visible" : "auth-form-hidden"}`}
          >
            {/* Email input for Forgot Password mode */}
            {currentMode === "forgot-password" && (
              <div className="input-group">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={getInputClass("email")}
                  disabled={loading}
                  required
                />
              </div>
            )}

            {/* Only show button for forgot password form */}
            {currentMode === "forgot-password" && (
              <button type="submit" className="auth-button" disabled={loading} aria-busy={loading}>
                {loading ? <FaSpinner className="spinner mr-2" /> : <FaEnvelope className="mr-2" />}
                {loading ? "Sending..." : "Reset Password"}
              </button>
            )}

            {/* Only show "Back to Login" for forgot password form */}
            {currentMode === "forgot-password" && (
              <p className="forgot-password-text">
                <button
                  type="button"
                  className="auth-toggle-button"
                  onClick={() => handleModeSwitch("login")}
                  disabled={loading}
                >
                  Back to Login
                </button>
              </p>
            )}
          </form>
        </div>

        {error && <p className="auth-error" aria-live="polite">{error}</p>}
        {successMessage && <p className="forgot-password-success" aria-live="polite">{successMessage}</p>}

        {/* Toggle links for login/register - hidden in forgot password mode */}
        {currentMode !== "forgot-password" && (
          <p className="auth-toggle-text">
            {currentMode === "signup" ? (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => handleModeSwitch("login")}
                  disabled={loading}
                  className="auth-toggle-button"
                  type="button"
                >
                  Login
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => handleModeSwitch("signup")}
                  disabled={loading}
                  className="auth-toggle-button"
                  type="button"
                >
                  Register
                </button>
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
}