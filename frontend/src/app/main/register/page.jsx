"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
// axios is not used in your provided code, so removing it if not needed elsewhere
// import axios from 'axios';

// Import the EmailSentModal component
import EmailSentModal from "../../../components/auth/email"; // Adjust path as needed

// You might need a LoadingSpinner component if you don't use the inline SVG one
import LoadingSpinner from "../../../components/loadingSpinner";

const RegisterForm = ({ switchToLogin }) => {
  // Removed onSuccess prop as modal handles success flow
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    inviteCode: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // State for the email sent modal
  const [isEmailSentModalOpen, setIsEmailSentModalOpen] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.confirmPassword.trim()
    ) {
      setError("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    setError(""); // Clear previous errors

    // Input validation using regex
    const nameRegex = /^[A-Za-z]{1,50}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,13}$/;

    if (!nameRegex.test(formData.username)) {
      toast.error("Name must be letters only and up to 50 characters.");
      setIsLoading(false);
      return;
    }

    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (!passwordRegex.test(formData.password)) {
      toast.error(
        "Password must be 8-13 characters with uppercase, number, and special character."
      );
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password.trim(),
          inviteCode: formData.inviteCode.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Success case: Open the modal
      setRegisteredEmail(formData.email); // Store email to pass to modal
      setIsEmailSentModalOpen(true); // Open the modal

      // Optionally clear form fields after successful registration
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        inviteCode: "",
      });

      //toast.success(data.message); // Show toast message from API
    } catch (err) {
      toast.error(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSentModalClose = () => {
    setIsEmailSentModalOpen(false);
    router.push("../../main/login"); // Redirect to login page after modal closes
  };

  return (
      <div className="w-full max-w-md mx-auto p-6 m-6 bg-white rounded-lg shadow-md">
          
      <div className="space-y-3 mb-6 mt-6">
        <button
          type="button"
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>
        <button
          type="button"
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          Continue with Apple
        </button>
      </div>
    
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Create Account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded text-gray-900"
            placeholder="John Doe"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Letters only, up to 50 characters
          </p>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded text-gray-900"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded text-gray-900"
            placeholder="••••••••"
            required
            minLength={8}
          />
          <p className="mt-1 text-xs text-gray-500">
            8-13 characters with uppercase, number, and special character
          </p>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded text-gray-900"
            placeholder="••••••••"
            required
            minLength={8}
          />
        </div>

        {/* <div>
          <label
            htmlFor="inviteCode"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Invite Code (optional)
          </label>
          <input
            type="text"
            id="inviteCode"
            name="inviteCode"
            value={formData.inviteCode}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded text-gray-900"
            placeholder="Enter invite code if you have one"
          />
          <p className="mt-1 text-xs text-gray-500">
            Required for admin registration
          </p>
        </div> */}

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 bg-[#d4b26a] text-white font-medium rounded-md hover:bg-[#c4a25a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4b26a] ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Registering...
            </span>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <a
        href="../../main/login"
          className="font-medium text-[#d4b26a] hover:underline focus:outline-none"
        >
          Sign in
        </a>
      </div>

      {/* Render the EmailSentModal */}
      <EmailSentModal
        isOpen={isEmailSentModalOpen}
        onClose={handleEmailSentModalClose}
        email={registeredEmail}
      />
    </div>
  );
};

export default RegisterForm;
