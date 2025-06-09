// components/ProtectedRoute.js
'use client';
import {useState, useEffect} from 'react';
import { useAuth } from '../context/AuthContext';
import LoginForm from './auth/loginForm';

export default function ProtectedRoute({ children, requiredRole = 'user' }) {
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (!user || (requiredRole !== 'user' && user.userType !== requiredRole)) {
      setShowLogin(true);
    }
  }, [user, requiredRole]);

  if (showLogin) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md">
          <LoginForm 
            onSuccess={() => setShowLogin(false)}
          />
        </div>
      </div>
    );
  }

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return children;
}