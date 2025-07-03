"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { verifyToken } from "../lib/jwt";
import { setToken, removeToken } from "../lib/auth/token.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("auth-token="))
          ?.split("=")[1];

        if (token) {
          const userData = await verifyToken(token);
          setUser(userData);

          if (!userData.address || !userData.phone) {
            setShowProfileModal(true);
          }
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);

    if (!userData.address || !userData.phone) {
      setShowProfileModal(true);
    }
  };

  const logout = () => {
    setUser(null);
    removeToken();
    setShowProfileModal(false);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    showProfileModal,
    setShowProfileModal,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isWebAdmin: user?.role === "web-admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
