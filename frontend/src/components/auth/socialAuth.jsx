"use client";
import { toast } from "react-toastify";
import { auth } from "../../firebase/config"; // Adjust path as needed
import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const SocialAuth = ({ onSuccess }) => {
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("Signed in with Google successfully!");
      if (onSuccess) {
        onSuccess(); // Close modal on success
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      let errorMessage = "Failed to sign in with Google.";
      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Sign-in window closed. Please try again.";
      } else if (error.code === "auth/cancelled-popup-request") {
        errorMessage = "Sign-in request already in progress. Please wait.";
      } else if (
        error.code === "auth/account-exists-with-different-credential"
      ) {
        errorMessage =
          "An account with this email already exists using a different sign-in method.";
      }
      toast.error(errorMessage);
    }
  };

  const handleAppleSignIn = async () => {
    // Note: Apple Sign-In requires specific configuration in Firebase and Apple Developer Console.
    // It's recommended to test this thoroughly.
    // For web, it often requires a custom OAuth flow or specific domain setup.
    // Ensure your Firebase project is configured for Apple Sign-In.
    const provider = new OAuthProvider("apple.com");
    try {
      await signInWithPopup(auth, provider);
      toast.success("Signed in with Apple successfully!");
      if (onSuccess) {
        onSuccess(); // Close modal on success
      }
    } catch (error) {
      console.error("Apple Sign-In Error:", error);
      let errorMessage = "Failed to sign in with Apple.";
      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Sign-in window closed. Please try again.";
      } else if (error.code === "auth/cancelled-popup-request") {
        errorMessage = "Sign-in request already in progress. Please wait.";
      } else if (
        error.code === "auth/account-exists-with-different-credential"
      ) {
        errorMessage =
          "An account with this email already exists using a different sign-in method.";
      } else if (error.code === "auth/unauthorized-domain") {
        errorMessage =
          "Apple Sign-In is not authorized for this domain. Check Firebase configuration.";
      }
      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-y-3 mb-6 mt-6">
      <button
        type="button"
        onClick={handleGoogleSignIn}
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
        onClick={handleAppleSignIn}
        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
        Continue with Apple
      </button>
    </div>
  );
};

export default SocialAuth;
