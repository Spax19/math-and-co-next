"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import Navbar from "../../../components/navbar";
import Footer from "../../../components/footer";
import Cart from "../../../components/cart";
import { useAuth } from "../../../context/AuthContext";
import { db } from "../../../firebase/config";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
} from "firebase/firestore"; // Import collection

export default function OrderSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { user, isAuthenticated, loading } = useAuth();

  const [orderStatus, setOrderStatus] = useState("verifying"); // verifying, success, failed
  const [orderId, setOrderId] = useState(null);
  const [cart, setCart] = useState([]); // Keep cart state for Navbar/Cart modal
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error("Please log in to view your order status.");
      router.push("/main/login");
      return;
    }

    const verifyPaymentAndSaveOrder = async () => {
      if (!sessionId || !user) {
        setOrderStatus("failed");
        toast.error("Invalid payment session. Please try again.");
        return;
      }

      try {
        // Call a Next.js API route to verify the Stripe session and save the order
        const response = await fetch("/api/verify-stripe-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
          body: JSON.stringify({ sessionId, userId: user.uid }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Payment verification failed.");
        }

        const data = await response.json();
        setOrderId(data.orderId);
        setOrderStatus("success");
        toast.success("Payment successful! Your order has been placed.");

        // Optionally clear the local cart state here, as it should be cleared on backend
        setCart([]);
      } catch (error) {
        console.error("Order verification error:", error);
        setOrderStatus("failed");
        toast.error(
          "Failed to verify payment or save order. Please contact support."
        );
      }
    };

    if (!loading && isAuthenticated && sessionId) {
      verifyPaymentAndSaveOrder();
    } else if (!sessionId && !loading) {
      setOrderStatus("failed");
      toast.error("No session ID found. Invalid access to order success page.");
      router.push("/main/shop"); // Redirect if no session ID
    }
  }, [sessionId, user, isAuthenticated, loading, router, setCart]);

  const renderContent = () => {
    switch (orderStatus) {
      case "verifying":
        return (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#d4b26a] mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800">
              Verifying your payment...
            </h2>
            <p className="text-gray-600 mt-2">
              Please do not close this window.
            </p>
          </div>
        );
      case "success":
        return (
          <div className="text-center py-20">
            <svg
              className="mx-auto h-24 w-24 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h2 className="text-3xl font-bold text-green-700 mt-4">
              Order Placed Successfully!
            </h2>
            <p className="text-gray-700 mt-2">
              Your order #{orderId} has been confirmed.
            </p>
            <p className="text-gray-600 mt-1">
              A confirmation email has been sent to your inbox.
            </p>
            <div className="mt-8 space-x-4">
              <button
                onClick={() => router.push("/main/shop")}
                className="px-6 py-3 bg-[#d4b26a] text-white rounded-md hover:bg-[#c4a25a] font-medium"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => router.push("/main/profile?tab=orders")}
                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-medium"
              >
                View My Orders
              </button>
            </div>
          </div>
        );
      case "failed":
        return (
          <div className="text-center py-20">
            <svg
              className="mx-auto h-24 w-24 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h2 className="text-3xl font-bold text-red-700 mt-4">
              Payment Failed
            </h2>
            <p className="text-gray-700 mt-2">
              There was an issue processing your payment.
            </p>
            <p className="text-gray-600 mt-1">
              Please try again or contact support if the problem persists.
            </p>
            <div className="mt-8">
              <button
                onClick={() => router.push("/main/checkout")}
                className="px-6 py-3 bg-[#d4b26a] text-white rounded-md hover:bg-[#c4a25a] font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar cart={cart} setIsCartOpen={setIsCartOpen} />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-3xl w-full bg-white rounded-xl shadow-md overflow-hidden">
          {renderContent()}
        </div>
      </div>
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        setCart={setCart}
      />
      <Footer />
    </>
  );
}
