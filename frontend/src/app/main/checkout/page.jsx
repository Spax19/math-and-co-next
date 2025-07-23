"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Navbar from "../../../components/navbar";
import Footer from "../../../components/footer";
import Cart from "../../../components/cart"; // Keep cart component for consistency
import { useAuth } from "../../../context/AuthContext";
import { db } from "../../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { loadStripe } from "@stripe/stripe-js"; // For Stripe.js on the frontend

// Make sure to replace with your actual Stripe Publishable Key
// This should ideally be loaded from an environment variable
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [cart, setCart] = useState([]); // Local cart state for this page
  const [isCartOpen, setIsCartOpen] = useState(false); // For the cart modal
  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "South Africa", // Default to South Africa
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Redirect if not authenticated or cart is empty
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error("Please log in to proceed to checkout.");
      router.push("/");
    }
  }, [isAuthenticated, loading, router]);

  // Fetch user's cart and profile details on page load
  useEffect(() => {
    const fetchCheckoutData = async () => {
      if (user && isAuthenticated) {
        try {
          setIsPageLoading(true);

          // Fetch user's cart from Firestore
          const cartDocRef = doc(db, "users", user.uid, "cart", "currentCart");
          const cartSnap = await getDoc(cartDocRef);
          if (cartSnap.exists()) {
            setCart(cartSnap.data().items || []);
          } else {
            setCart([]);
            toast.error("Your cart is empty. Redirecting to shop.");
            router.push("/main/shop");
            return;
          }

          // Fetch user's profile for pre-filling shipping details
          const userDocRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setShippingDetails({
              fullName: userData.displayName || user.displayName || "",
              email: userData.email || user.email || "",
              phone: userData.phone || "",
              addressLine1: userData.address?.line1 || "", // Assuming address is an object
              addressLine2: userData.address?.line2 || "",
              city: userData.address?.city || "",
              state: userData.address?.state || "",
              zipCode: userData.address?.zipCode || "",
              country: userData.address?.country || "South Africa",
            });
          }
        } catch (error) {
          console.error("Error fetching checkout data:", error);
          toast.error("Failed to load checkout data.");
        } finally {
          setIsPageLoading(false);
        }
      }
    };

    if (!loading && isAuthenticated) {
      fetchCheckoutData();
    }
  }, [user, isAuthenticated, loading, router]);

  const handleShippingInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    return cart.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );
  };

  const handlePayment = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      router.push("/main/shop");
      return;
    }

    // Basic validation for shipping details
    if (
      !shippingDetails.fullName ||
      !shippingDetails.email ||
      !shippingDetails.addressLine1 ||
      !shippingDetails.city ||
      !shippingDetails.zipCode
    ) {
      toast.error("Please fill in all required shipping details.");
      return;
    }

    setIsProcessingPayment(true);
    try {
      const stripe = await stripePromise;
      const idToken = await user.getIdToken(); // Get the token here

      console.log("ID Token being sent:", idToken); // <-- ADD THIS LINE

      const response = await fetch("/api/create-stripe-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`, // Use the logged token
        },
        body: JSON.stringify({
          cartItems: cart,
          shippingDetails: shippingDetails,
          userId: user.uid,
          userEmail: user.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to create checkout session."
        );
      }

      const session = await response.json();

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        toast.error(result.error.message);
        console.error("Stripe redirect error:", result.error);
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error("Payment failed. Please try again. " + error.message);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (isPageLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d4b26a]"></div>
      </div>
    );
  }

  if (!isAuthenticated || cart.length === 0) {
    return null; // Redirect handled by useEffect
  }

  return (
    <>
      <Navbar cart={cart} setIsCartOpen={setIsCartOpen} />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Shipping Details Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Shipping Details</h2>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={shippingDetails.fullName}
                  onChange={handleShippingInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#d4b26a] focus:border-[#d4b26a]"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={shippingDetails.email}
                  onChange={handleShippingInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#d4b26a] focus:border-[#d4b26a]"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={shippingDetails.phone}
                  onChange={handleShippingInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#d4b26a] focus:border-[#d4b26a]"
                />
              </div>
              <div>
                <label
                  htmlFor="addressLine1"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address Line 1
                </label>
                <input
                  type="text"
                  id="addressLine1"
                  name="addressLine1"
                  value={shippingDetails.addressLine1}
                  onChange={handleShippingInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#d4b26a] focus:border-[#d4b26a]"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="addressLine2"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  id="addressLine2"
                  name="addressLine2"
                  value={shippingDetails.addressLine2}
                  onChange={handleShippingInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#d4b26a] focus:border-[#d4b26a]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={shippingDetails.city}
                    onChange={handleShippingInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#d4b26a] focus:border-[#d4b26a]"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700"
                  >
                    State/Province
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={shippingDetails.state}
                    onChange={handleShippingInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#d4b26a] focus:border-[#d4b26a]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="zipCode"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Zip/Postal Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={shippingDetails.zipCode}
                    onChange={handleShippingInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#d4b26a] focus:border-[#d4b26a]"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={shippingDetails.country}
                    onChange={handleShippingInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#d4b26a] focus:border-[#d4b26a]"
                    required
                    readOnly // Assuming country is fixed or selected from a dropdown
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <div className="divide-y divide-gray-200">
              {cart.map((item, index) => (
                <div key={item.id || index} className="py-4 flex items-center">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-16 w-16 flex-shrink-0 rounded-md object-cover mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="text-base font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-base font-medium">
                    R{(item.price * (item.quantity || 1)).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 mt-6 pt-6">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>R{calculateTotal().toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-base font-medium text-gray-900 mt-2">
                <p>Shipping</p>
                <p>R0.00</p> {/* Placeholder for shipping cost */}
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 mt-4">
                <p>Order Total</p>
                <p>R{calculateTotal().toFixed(2)}</p>
              </div>
              <button
                onClick={handlePayment}
                disabled={isProcessingPayment || cart.length === 0}
                className="w-full bg-[#d4b26a] text-white py-3 rounded-md hover:bg-[#c4a25a] mt-6 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessingPayment ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing Payment...
                  </span>
                ) : (
                  "Proceed to Payment"
                )}
              </button>
            </div>
          </div>
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
