// context/AuthContext.js
'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { verifyToken } from '../lib/jwt';
import { setToken, removeToken } from "../lib/auth/token.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('auth-token='))
          ?.split('=')[1];
        
        if (token) {
          const userData = await verifyToken(token);
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    removeToken();
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.userType === 'admin',
    isWebAdmin: user?.userType === 'webadmin',
    login,
    logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}