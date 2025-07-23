import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Products from "./components/Products";
import Brands from "./components/Brands"; // Import the new page
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ComingSoon from "./components/ComingSoon";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/brands" element={<Brands />} /> {/* New route */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
