
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer, toast } from 'react-toastify';
import { AuthProvider } from '../context/AuthContext';
import ThemeWrapper from '../context/themeContext';


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

  // const [showAuthModal, setShowAuthModal] = useState(false);
  // const [authMode, setAuthMode] = useState('login'); // 'login' or 'register

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ThemeWrapper>
            <ToastContainer
              position="top-right"
              autoClose={2500}
              hideProgressBar={false}
            />
            {children}
          
          </ThemeWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
