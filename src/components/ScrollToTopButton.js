import React, { useState, useEffect } from 'react';
import { FaArrowCircleUp } from 'react-icons/fa';

/**
 * ScrollToTopButton is a component that renders a button to scroll the page to the top.
 * The button is only visible when the user has scrolled down a certain distance.
 */
const ScrollToTopButton = () => {
  // State to manage the visibility of the button
  const [isVisible, setIsVisible] = useState(false);

  // Function to toggle button visibility based on scroll position
  const toggleVisibility = () => {
    // Check if the user has scrolled down more than 300 pixels.
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Function to smoothly scroll the window to the top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // This provides a smooth scrolling animation.
    });
  };

  // Set up an effect to add and remove the scroll event listener.
  useEffect(() => {
    // Add event listener to track scrolling when the component mounts.
    window.addEventListener('scroll', toggleVisibility);

    // Clean up the event listener when the component unmounts to prevent memory leaks.
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []); // The empty dependency array ensures this effect runs only once.

  return (
    <>
      {/* Conditionally render the button only when it's visible */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="scroll-to-top-btn"
          aria-label="Scroll to top of the page"
          title="Scroll to Top"
        >
          {/* Using a React icon for the up arrow */}
          <FaArrowCircleUp />
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;