"use client";
import { useState, useEffect, useRef } from "react"; // Import useRef for debounce
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext"; // Import useAuth
import { db } from "../firebase/config"; // Import Firestore instance
import {
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore"; // Firestore functions

const Cart = ({ isOpen, onClose, cart, setCart }) => {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth(); // Get user and auth state
  const debounceTimeoutRef = useRef(null); // Ref for debounce timer

  // Effect to load cart from Firestore and set up real-time listener
  useEffect(() => {
    if (!isAuthenticated || loading || !user) {
      // Clear cart if user logs out or is not authenticated
      setCart([]);
      return;
    }

    const userCartDocRef = doc(db, "users", user.uid, "cart", "currentCart");

    // Set up real-time listener for the user's cart
    const unsubscribe = onSnapshot(
      userCartDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const firestoreCart = docSnap.data().items || [];
          // Only update if the Firestore cart is different from current local state
          // This prevents infinite loops if local state changes trigger Firestore writes
          if (JSON.stringify(firestoreCart) !== JSON.stringify(cart)) {
            setCart(firestoreCart);
          }
        } else {
          // If no cart document exists, initialize an empty cart locally
          setCart([]);
        }
      },
      (error) => {
        console.error("Error listening to cart changes:", error);
        toast.error("Failed to load cart. Please try again.");
      }
    );

    // Cleanup listener on component unmount or user change
    return () => unsubscribe();
  }, [user, isAuthenticated, loading]); // Depend on user, isAuthenticated, loading

  // Effect to save local cart changes to Firestore (with debounce)
  useEffect(() => {
    if (!isAuthenticated || loading || !user || cart === null) {
      // Do not save if not authenticated, still loading, or cart is not yet loaded
      return;
    }

    // Clear previous debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set a new debounce timeout
    debounceTimeoutRef.current = setTimeout(async () => {
      try {
        const userCartDocRef = doc(
          db,
          "users",
          user.uid,
          "cart",
          "currentCart"
        );
        if (cart.length > 0) {
          await setDoc(userCartDocRef, {
            items: cart,
            lastUpdated: serverTimestamp(),
          });
        } else {
          // If cart is empty, delete the document to keep database clean
          await deleteDoc(userCartDocRef);
        }
        // console.log("Cart saved to Firestore."); // For debugging
      } catch (error) {
        console.error("Error saving cart to Firestore:", error);
        toast.error("Failed to save cart changes.");
      }
    }, 500); // Debounce for 500ms

    // Cleanup debounce on component unmount
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [cart, user, isAuthenticated, loading]); // Depend on cart, user, isAuthenticated, loading

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart); // This will trigger the useEffect to save to Firestore
    toast.success("Item removed from cart");
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;

    const newCart = [...cart];
    newCart[index].quantity = newQuantity;
    setCart(newCart); // This will trigger the useEffect to save to Firestore
  };

  const calculateTotal = () => {
    return cart
      .reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
      .toFixed(2);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to proceed to checkout.");
      router.push("/main/login"); // Redirect to login if not authenticated
      onClose();
      return;
    }
    if (cart.length === 0) {
      toast.error("Your cart is empty. Add items before checking out.");
      return;
    }
    router.push("/main/checkout"); // Navigate to the new checkout page
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white p-6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Cart ({cart.length})</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Your cart is empty
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Start shopping to add items to your cart.
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {cart.map((item, index) => (
                <div key={item.id || index} className="py-4 flex">
                  {" "}
                  {/* Use item.id if available, fallback to index */}
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-24 w-24 flex-shrink-0 rounded-md object-cover"
                  />
                  <div className="ml-4 flex-1">
                    <div>
                      <h3 className="text-base font-medium">{item.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        R{item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-end justify-between text-sm mt-4">
                      <div className="flex items-center">
                        <button
                          onClick={() =>
                            updateQuantity(index, (item.quantity || 1) - 1)
                          }
                          className="w-8 h-8 border rounded-l flex items-center justify-center"
                          disabled={(item.quantity || 1) <= 1}
                        >
                          -
                        </button>
                        <span className="w-10 h-8 border-t border-b flex items-center justify-center">
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(index, (item.quantity || 1) + 1)
                          }
                          className="w-8 h-8 border rounded-r flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 mt-6 pt-6">
              <div className="flex justify-between text-base font-medium">
                <p>Subtotal</p>
                <p>R{calculateTotal()}</p>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-[#d4b26a] text-white py-3 rounded-md hover:bg-[#c4a25a] mt-6"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
