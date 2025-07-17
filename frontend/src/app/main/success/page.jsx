// file: app/success/page.js
"use client";

import Link from "next/link";
import { useEffect } from "react";

// Assuming you have a global state management for the cart (e.g., Context, Zustand)
// Here we'll pass a dummy `setCart` function for demonstration.
// You should replace this with your actual cart clearing logic.
const SuccessPage = ({ setCart = () => {} }) => {
  useEffect(() => {
    // Clear the cart here after a successful purchase
    // setCart([]);
    console.log("Payment successful, cart should be cleared.");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold text-green-500 mb-4">
        Payment Successful!
      </h1>
      <p className="text-lg mb-8">
        Thank you for your order. We've sent a confirmation to your email.
      </p>
      <Link
        href="/"
        className="px-6 py-2 bg-[#d4b26a] text-white rounded hover:bg-[#c4a25a]"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default SuccessPage;
