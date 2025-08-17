import React, { useState, useEffect } from "react";
import "./BrandCarousel.css";

const logos = [
  `${process.env.PUBLIC_URL}/assets/logoz/jordan-logo.jpg`,
  `${process.env.PUBLIC_URL}/assets/logoz/adidas-logo.jpg`,
  `${process.env.PUBLIC_URL}/assets/logoz/converse-logo.jpg`,
  `${process.env.PUBLIC_URL}/assets/logoz/new-balance-logo.jpg`,
  `${process.env.PUBLIC_URL}/assets/logoz/timberland-logo.jpg`,
  `${process.env.PUBLIC_URL}/assets/logoz/nike-logo.jpg`,
  `${process.env.PUBLIC_URL}/assets/logoz/reebok-logo.jpg`,
  `${process.env.PUBLIC_URL}/assets/logoz/puma-logo.jpg`,
];

export default function BrandCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % logos.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="brand-carousel">
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${currentIndex * 12.5}%)` }}
      >
        {logos.map((logo, idx) => (
          <div key={idx} className="logo-container">
            <img src={logo} alt={`Brand ${idx + 1}`} />
          </div>
        ))}
      </div>
    </section>
  );
}
