"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase/config";

// Create a Context for the auth state
const AuthContext = createContext(null);

// Custom hook to use the auth state
export const useAuth = () => useContext(AuthContext);

// The Auth Provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // This effect runs only once on the client to handle authentication
    useEffect(() => {
        // Sign in with the provided custom token or anonymously
        const authenticate = async () => {
            try {
                if (initialAuthToken) {
                    await signInWithCustomToken(auth, initialAuthToken);
                } else {
                    await signInAnonymously(auth);
                }
            } catch (error) {
                console.error("Firebase auth error:", error);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            setUser(authUser);
            setLoading(false);
        });

        authenticate();

        // Cleanup the subscription on unmount
        return () => unsubscribe();
    }, []);

    // Provide the user, auth, and db objects via context
    const value = {
        user,
        loading,
        auth,
        db
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

