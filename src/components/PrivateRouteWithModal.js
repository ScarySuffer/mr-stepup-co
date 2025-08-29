import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";

export default function PrivateRouteWithModal({ children }) {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const handleClose = () => {
    navigate("/auth");
  };

  if (checkingAuth) return <p>Loading...</p>;

  if (!user) {
    return (
      <Modal show={true} onClose={handleClose} title="Login Required">
        <p>You need to be logged in to access this page.</p>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            onClick={handleClose}
            style={{
              padding: "10px 20px",
              backgroundColor: "#0d6efd",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Login
          </button>
        </div>
      </Modal>
    );
  }

  return children;
}
