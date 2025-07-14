// src/components/protectedRoutes.jsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // For App Router
import LoadingSpinner from "./loadingSpinner";
//import LoginForm from "./loginForm"; // The login form component you're seeing

export default function ProtectedRoute({ children, requiredRole }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true); // Ensure loading state is active

      try {
        // Make API call to get user data. Browser automatically sends HttpOnly cookie.
        const response = await fetch("/api/auth/login"); // Call your new API route
        const data = await response.json(); // Expects { success: true, user: { userId, email, role } }

        // --- DEBUGGING: Browser Console Logs ---
        console.log(
          "ProtectedRoute: /api/auth/login response status:",
          response.status
        );
        console.log("ProtectedRoute: /api/auth/login response data:", data);
        console.log("ProtectedRoute: Expected requiredRole:", requiredRole);
        // --- END DEBUGGING ---

        if (response.ok && data.success && data.user) {
          // User is authenticated by the server
          const actualRole = data.user.role;

          // --- DEBUGGING: Browser Console Logs ---
          console.log("ProtectedRoute: Actual role from API:", actualRole);
          // --- END DEBUGGING ---

          if (actualRole === requiredRole) {
            setIsAuthenticated(true);
            setUserRole(actualRole);
            console.log(
              "ProtectedRoute: Access granted to",
              requiredRole,
              "route."
            );
          } else {
            // Authenticated, but wrong role for this specific route
            console.warn(
              "ProtectedRoute: Role mismatch. User is",
              actualRole,
              "but needs",
              requiredRole
            );
            router.replace("/main/unauthorized"); // Redirect to unauthorized page
            setIsAuthenticated(false); // Ensure state reflects no access
          }
        } else {
          // Not authenticated (e.g., no token, invalid token, API returned success:false)
          console.log(
            "ProtectedRoute: User not authenticated via /api/auth/login. Redirecting to login."
          );
          // Clear any stale local storage items (though not strictly necessary if HttpOnly)
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          router.replace("/main/login"); // Redirect to the login page
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error(
          "ProtectedRoute: Error during /api/auth/login fetch:",
          error
        );
        // On network errors, assume unauthenticated and redirect
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        router.replace("/main/login");
        setIsAuthenticated(false);
      } finally {
        setLoading(false); // Always set loading to false when check is complete
      }
    };

    checkAuth();
  }, [requiredRole, router]); // Dependencies

  // What to render based on state
  if (loading) {
    return <LoadingSpinner />;
  }

  // If not authenticated or role doesn't match, render the fallback UI
  if (!isAuthenticated || userRole !== requiredRole) {
    return (
      <div className="auth-fallback-container">
        <h2>Authentication Required</h2>
        <p>Please log in to access this page.</p>
        
      </div>
    );
  }

  // If authenticated and role matches, render the children (your Dashboard content)
  return <>{children}</>;
}
