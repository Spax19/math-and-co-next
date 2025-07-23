// src/app/layout.js

// ... other imports
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer, toast } from "react-toastify";
import { AuthProvider } from "../context/AuthContext"; // <--- Make sure it's a NAMED import with curly braces

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <AuthProvider>
          <ToastContainer
            position="top-right"
            autoClose={2500}
            hideProgressBar={false}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
