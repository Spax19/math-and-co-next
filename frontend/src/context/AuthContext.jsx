"use client"
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/config"; // Your Firebase app initialization
import { onAuthStateChanged, signOut } from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isWebAdmin, setIsWebAdmin] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);
      if (currentUser) {
        // Refresh user token to get latest claims and emailVerified status
        await currentUser.reload(); 
        setEmailVerified(currentUser.emailVerified); 

        const idTokenResult = await currentUser.getIdTokenResult();
        setIsAdmin(idTokenResult.claims.admin || false);
        setIsWebAdmin(idTokenResult.claims.webAdmin || false);
      } else {
        setIsAdmin(false);
        setIsWebAdmin(false);
        setEmailVerified(false); // Reset on logout
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = () => {
    return signOut(auth);
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

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
