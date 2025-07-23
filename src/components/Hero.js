import React, { useState, useEffect } from "react";
import "./Hero.css";

// Combine local logo images and Unsplash images
const heroImages = [
  // Local brand logos
  "/assets/logoz/jordan-logo.jpg",
  "/assets/logoz/adidas-logo.jpg",
  "/assets/logoz/converse-logo.jpg",
  "/assets/logoz/new-balance-logo.jpg",
  "/assets/logoz/timberland-logo.jpg",
  "/assets/logoz/Converse old- logo.png",
  "/assets/logoz/nike-logo.jpg",
  "/assets/logoz/reebok-logo.jpg",
  "/assets/logoz/puma-logo.jpg",
  "/assets/logoz/nike2-logo.png",

  // Unsplash sneakers backgrounds
  "https://images.unsplash.com/photo-1528701800489-2c91f7be4979?auto=format&fit=crop&w=1350&q=80",
  "https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?auto=format&fit=crop&w=1350&q=80",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1350&q=80",
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  return (
    <section className="hero-section">
      {heroImages.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`Slide ${i + 1}`}
          className={`hero-image ${i === currentSlide ? "active" : ""}`}
          draggable={false}
        />
      ))}

      <button className="arrow left-arrow" onClick={prevSlide} aria-label="Previous Slide">
        &#8592;
      </button>
      <button className="arrow right-arrow" onClick={nextSlide} aria-label="Next Slide">
        &#8594;
      </button>

      <div className="hero-content">
        <h1>Step Up Your Sneaker Game</h1>
        <a href="#products" className="cta-button">Shop Now</a>
      </div>
    </section>
  );
}
