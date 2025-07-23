"use client";
import { useState, useEffect, useRef } from "react";
import LoginForm from "./loginForm";
import RegisterForm from "./registerForm";
import SocialAuth from "./socialAuth"; // Import the new SocialAuth component
import AuthDivider from "./authDivider"; // Import your AuthDivider component

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAuthSuccess = () => {
    onClose(); // Close the modal on successful authentication (from any method)
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Blurred Background - needs higher z-index than navbar */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[1001]"
        onClick={onClose}
      />

      {/* Modal Container - needs to be above the overlay */}
      <div
        ref={modalRef} // Attach ref for outside click detection
        className="absolute w-full max-w-md bg-white rounded-lg shadow-xl z-[1002] mx-auto top-8 transform transition-all duration-300 scale-100 opacity-100" // Added transition classes
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Auth Form Content */}
        <div className="p-8">
          {/* Social Auth Buttons */}
          <SocialAuth onSuccess={handleAuthSuccess} />{" "}
          {/* Pass onSuccess to SocialAuth */}
          {/* Divider */}
          <AuthDivider />
          {/* Email/Password Forms */}
          {isLogin ? (
            <LoginForm
              onSuccess={handleAuthSuccess}
              switchToRegister={() => setIsLogin(false)}
            />
          ) : (
            <RegisterForm
              onSuccess={handleAuthSuccess}
              switchToLogin={() => setIsLogin(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
