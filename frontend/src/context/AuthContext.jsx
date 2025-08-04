"use client"; // This must be at the very top of the file

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/config"; // Your Firebase app initialization
import { onAuthStateChanged, signOut } from "firebase/auth";

const AuthContext = createContext();

// Create the custom hook for consuming the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Create the Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isWebAdmin, setIsWebAdmin] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [authService, setAuthService] = useState(null);

  useEffect(() => {
    let unsubscribe;

    const initializeFirebase = async () => {
      try {
        // Use dynamic import to ensure this code is only loaded on the client
        const { initializeApp, getApps } = await import("firebase/app");
        const { getAuth, onAuthStateChanged } = await import("firebase/auth");

        const app = !getApps().length
          ? initializeApp(firebaseConfig)
          : getApps()[0];
        const auth = getAuth(app);
        setAuthService(auth); // Store the auth service in state

        // The onAuthStateChanged listener handles all state changes for us
        unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
          setUser(currentUser);
          setIsAuthenticated(!!currentUser);

          if (currentUser) {
            try {
              await currentUser.reload();
              setEmailVerified(currentUser.emailVerified);
              const idTokenResult = await currentUser.getIdTokenResult();
              setIsAdmin(idTokenResult.claims.admin || false);
              setIsWebAdmin(idTokenResult.claims.webAdmin || false);
            } catch (error) {
              console.error("Failed to get token claims:", error);
              setIsAdmin(false);
              setIsWebAdmin(false);
            }
          } else {
            setIsAdmin(false);
            setIsWebAdmin(false);
            setEmailVerified(false);
          }
          setLoading(false);
        });
      } catch (error) {
        console.error("Firebase dynamic import failed:", error);
        setLoading(false);
      }
    };

    initializeFirebase();

    // Cleanup the listener on component unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const logout = async () => {
    // Only attempt to sign out if the auth service is available
    if (authService) {
      const { signOut } = await import("firebase/auth");
      return signOut(authService);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isAdmin,
    isWebAdmin,
    logout,
    loading,
    emailVerified,
  };

  // Only render children when we are not loading the Firebase SDK
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};