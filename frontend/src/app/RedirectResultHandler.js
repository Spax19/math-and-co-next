"use client";
import { useEffect } from "react";
import { getRedirectResult } from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "../firebase/config"; // Adjust the path to your Firebase config

const RedirectResultHandler = () => {
  useEffect(() => {
    const handleAuthRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);

        if (result) {
          // A user has just signed in via redirect!
          const user = result.user;
          console.log("User signed in via redirect:", user);

          // Display a success toast and take other actions
          toast.success("Signed in successfully!");

          // You can redirect the user to another page here if needed
          // For example:
          // router.push("/dashboard");
        }
      } catch (error) {
        // Handle any errors that occurred during the redirect
        console.error("Redirect Sign-In Error:", error);
        toast.error("Failed to sign in. Please try again.");
      }
    };

    handleAuthRedirect();
  }, []);

  return null; // This component is for logic and doesn't render any UI
};

export default RedirectResultHandler;
