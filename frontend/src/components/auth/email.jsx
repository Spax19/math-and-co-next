// components/EmailSentModal.js
"use client"; // This component needs to be a client component

import React, { useEffect, useRef } from "react";
// Adjust this path to where your VerifyEmail.css is located relative to this modal component


// Icon for success message (re-using from previous examples)
const CheckCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="verify-email-success-icon"
  >
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
      clipRule="evenodd"
    />
  </svg>
);

const EmailSentModal = ({ isOpen, onClose, email }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (dialogRef.current) {
      if (isOpen) {
        dialogRef.current.showModal();
        document.body.style.overflow = "hidden"; // Prevent scrolling background
      } else {
        dialogRef.current.close();
        document.body.style.overflow = "unset"; // Restore scrolling
      }
    }
  }, [isOpen]);

  const handleBackdropClick = (event) => {
    if (dialogRef.current && event.target === dialogRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      className="verify-email-container"
      onClick={handleBackdropClick}
    >
      <div className="verify-email-card">
        <CheckCircleIcon />
        <h2 className="verify-email-success-title">Verification Email Sent!</h2>
        <p className="verify-email-description">
          We've sent a verification email to{" "}
          <span className="verify-email-highlight">{email}</span>. Please check
          your inbox (and spam folder) to activate your account.
        </p>

        <div className="verify-email-notice">
          <p className="verify-email-notice-text">
            The link in the email is valid for a limited time.
          </p>
        </div>

        <div className="verify-email-btn-group" style={{ marginTop: "1.5rem" }}>
          <button onClick={onClose} className="verify-email-primary-btn">
            Got It!
          </button>
          {/* <a href="../../main/login" className="verify-email-secondary-btn">
            Go to Login
          </a> */}
        </div>
      </div>
    </dialog>
  );
};

export default EmailSentModal;
