import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "../context/AuthContext";
import ThemeWrapper from "../context/themeContext";
import RedirectResultHandler from "./RedirectResultHandler"; // <-- Import the new component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Math&Co",
  description: "The Taste of Nature.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>
        <AuthProvider>
          <RedirectResultHandler /> {/* <-- Render the new handler here */}
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
