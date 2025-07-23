"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { auth } from "../../firebase/config"; // Adjust path as needed
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginForm = ({ onSuccess, switchToRegister }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

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
    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Use Firebase signInWithEmailAndPassword
      await signInWithEmailAndPassword(auth, formData.email, formData.password);

      toast.success("Logged in successfully!");
      if (onSuccess) {
        onSuccess(); // Close the modal
      }
      // Firebase Auth state listener in AuthContext will handle redirection
      // based on authentication status.
    } catch (err) {
      console.error("Firebase login error:", err.code, err.message);
      let errorMessage = "Login failed. Please check your credentials.";

      switch (err.code) {
        case "auth/invalid-email":
          errorMessage = "The email address is not valid.";
          break;
        case "auth/user-disabled":
          errorMessage = "This user account has been disabled.";
          break;
        case "auth/user-not-found":
        case "auth/wrong-password":
          errorMessage = "Invalid email or password.";
          break;
        case "auth/too-many-requests":
          errorMessage =
            "Too many failed login attempts. Please try again later.";
          break;
        default:
          errorMessage = err.message || errorMessage;
      }
      toast.error(errorMessage);
      setError(errorMessage); // Update local error state
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Sign In
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          />
        </div>

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
              Logging in...
            </span>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <button
          onClick={switchToRegister}
          className="font-medium text-[#d4b26a] hover:underline focus:outline-none"
        >
          Sign up
        </button>
      </div>
      {/* You might add a "Forgot Password" link here */}
      {/* <div className="mt-2 text-center text-sm">
                <button
                    onClick={() => console.log('Forgot password')}
                    className="text-gray-600 hover:underline"
                >
                    Forgot Password?
                </button>
            </div> */}
    </div>
  );
};

export default LoginForm;
