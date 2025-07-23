"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Import useSearchParams
import { toast } from "react-toastify";
import Navbar from "../../../components/navbar";
import Footer from "../../../components/footer";
import Cart from "../../../components/cart";
import { useAuth } from "../../../context/AuthContext";
import { auth, db } from "../../../firebase/config";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection, // Import collection
  query, // Import query
  where, // Import where
  onSnapshot, // Import onSnapshot
} from "firebase/firestore";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook to read URL query parameters
  const { user, isAuthenticated, loading, logout, emailVerified } = useAuth();

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    avatar: "/default-avatar.png", // Default avatar
    joinedDate: "",
  });
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("profile"); // Default tab
  const [isEditing, setIsEditing] = useState(false);

  // Separate loading states for different actions
  const [isPageLoading, setIsPageLoading] = useState(true); // For initial data fetch
  const [isSavingProfile, setIsSavingProfile] = useState(false); // For profile save button
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false); // For password update button
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false); // For avatar upload
  const [isOrdersLoading, setIsOrdersLoading] = useState(false); // New: For loading orders

  const [newPassword, setNewPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // Effect to read initial tab from URL query params
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["profile", "orders", "password"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/main/login"); // Redirect to login page if not authenticated
    }
  }, [isAuthenticated, loading, router]);

  // Fetch user profile data from Firestore
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          // Only set page loading if it's the initial load, not subsequent tab changes
          if (activeTab === "profile") {
            setIsPageLoading(true);
          }

          const userDocRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData({
              username: user.displayName || data.displayName || "",
              email: user.email || data.email || "",
              phone: data.phone || "",
              // Assuming address is an object with line1, city, etc.
              address: data.address || {
                line1: "",
                line2: "",
                city: "",
                state: "",
                zipCode: "",
                country: "",
              },
              avatar:
                data.avatar && data.avatar.startsWith("data:image/")
                  ? data.avatar
                  : user.photoURL || "/default-avatar.png",
              joinedDate: data.createdAt
                ? new Date(data.createdAt.toDate()).toLocaleDateString()
                : "N/A",
            });
          } else {
            // Create user document if it doesn't exist
            await setDoc(userDocRef, {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || "",
              createdAt: serverTimestamp(),
              emailVerified: user.emailVerified,
              roles: ["user"],
              avatar: user.photoURL || "/default-avatar.png",
              address: {
                line1: "",
                line2: "",
                city: "",
                state: "",
                zipCode: "",
                country: "",
              }, // Initialize address as object
            });
            setUserData({
              username: user.displayName || "",
              email: user.email || "",
              phone: "",
              address: {
                line1: "",
                line2: "",
                city: "",
                state: "",
                zipCode: "",
                country: "",
              },
              avatar: user.photoURL || "/default-avatar.png",
              joinedDate: new Date().toLocaleDateString(),
            });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          toast.error("Failed to load profile data.");
        } finally {
          setIsPageLoading(false); // Set page loading to false regardless of success/failure
        }
      }
    };

    if (!loading && isAuthenticated) {
      fetchUserProfile();
    }
  }, [user, isAuthenticated, loading]); // Depend on user, isAuthenticated, loading

  // Effect to fetch user orders from Firestore
  useEffect(() => {
    if (!isAuthenticated || loading || !user || activeTab !== "orders") {
      setOrders([]); // Clear orders if not authenticated or not on orders tab
      return;
    }

    setIsOrdersLoading(true); // Set loading state for orders

    // Create a query to get orders for the current user, ordered by date
    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid)
      // orderBy("orderDate", "desc") // Consider adding this, but requires Firestore index
    );

    // Set up real-time listener for orders
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedOrders = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id, // Document ID as order ID
            ...data,
            orderDate: data.orderDate?.toDate
              ? data.orderDate.toDate()
              : new Date(), // Convert Firestore Timestamp to Date object
            // Ensure totalAmount is a number for toFixed
            totalAmount:
              typeof data.totalAmount === "number"
                ? data.totalAmount
                : parseFloat(data.totalAmount || "0"),
          };
        });

        // Sort orders by date in descending order (most recent first)
        fetchedOrders.sort(
          (a, b) => b.orderDate.getTime() - a.orderDate.getTime()
        );

        setOrders(fetchedOrders);
        setIsOrdersLoading(false); // Reset loading state
      },
      (error) => {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load your orders.");
        setIsOrdersLoading(false); // Reset loading state on error
      }
    );

    // Cleanup listener on component unmount or dependencies change
    return () => unsubscribe();
  }, [user, isAuthenticated, loading, activeTab]); // Depend on user, isAuthenticated, loading, activeTab

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Handle nested address fields
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setUserData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setUserData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setNewPassword((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!user) {
      toast.error("User not authenticated.");
      return;
    }

    setIsSavingProfile(true); // Set saving state for profile form
    try {
      const updates = {};
      if (userData.username !== user.displayName) {
        updates.displayName = userData.username;
      }
      if (Object.keys(updates).length > 0) {
        await updateProfile(user, updates);
      }

      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        displayName: userData.username,
        phone: userData.phone,
        address: userData.address, // Save the entire address object
      });

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. " + error.message);
    } finally {
      setIsSavingProfile(false); // Reset saving state
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!user) {
      toast.error("User not authenticated.");
      return;
    }

    if (newPassword.new !== newPassword.confirm) {
      toast.error("New passwords do not match.");
      return;
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,13}$/;
    if (!passwordRegex.test(newPassword.new)) {
      toast.error(
        "New password must be 8-13 characters with uppercase, number, and special character."
      );
      return;
    }

    setIsUpdatingPassword(true); // Set loading state for password form
    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        newPassword.current
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword.new);

      toast.success("Password updated successfully!");
      setNewPassword({ current: "", new: "", confirm: "" });
    } catch (error) {
      console.error("Error updating password:", error);
      let errorMessage = "Failed to update password.";
      switch (error.code) {
        case "auth/wrong-password":
          errorMessage = "Current password is incorrect.";
          break;
        case "auth/user-not-found":
          errorMessage = "User not found. Please log in again.";
          break;
        case "auth/invalid-credential":
          errorMessage = "Invalid credentials. Please try again.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many attempts. Please try again later.";
          break;
        case "auth/requires-recent-login":
          errorMessage = "Please log in again to update your password.";
          break;
        case "auth/weak-password":
          errorMessage = "The new password is too weak.";
          break;
        default:
          errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsUpdatingPassword(false); // Reset loading state
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out.");
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    const MAX_FILE_SIZE_KB = 100;
    if (file.size > MAX_FILE_SIZE_KB * 1024) {
      toast.error(
        `File size should be less than ${MAX_FILE_SIZE_KB}KB for direct storage.`
      );
      return;
    }

    setIsUploadingAvatar(true); // Set loading state for avatar upload
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        const base64String = reader.result;

        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          avatar: base64String,
        });

        setUserData((prev) => ({ ...prev, avatar: base64String }));
        toast.success("Avatar updated successfully!");
        setIsUploadingAvatar(false); // Reset loading state on success
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        toast.error("Failed to read image file.");
        setIsUploadingAvatar(false); // Reset loading state on error
      };
    } catch (error) {
      console.error("Error saving avatar (Base64):", error);
      toast.error("Failed to save avatar. " + error.message);
      setIsUploadingAvatar(false); // Reset loading state on error
    }
  };

  const handleResendVerificationEmail = async () => {
    if (user && !emailVerified) {
      try {
        await sendEmailVerification(user);
        toast.info(
          "A new verification email has been sent. Please check your inbox."
        );
      } catch (error) {
        console.error("Error resending verification email:", error);
        toast.error(
          "Failed to resend verification email. Please try again later."
        );
      }
    }
  };

  if (isPageLoading || loading) {
    // Use isPageLoading for the full-page spinner
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d4b26a]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navbar cart={cart} setIsCartOpen={setIsCartOpen} />
      <div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-[#d4b26a] to-[#e8c87e] p-6 md:p-8 text-white">
              <div className="flex flex-col md:flex-row items-center">
                <div className="relative mb-4 md:mb-0 md:mr-6">
                  <img
                    src={userData.avatar}
                    alt="Profile"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white border-opacity-80 object-cover shadow-lg"
                  />
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100">
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleAvatarUpload}
                        accept="image/*"
                      />
                      {isUploadingAvatar ? ( // Show spinner when uploading avatar
                        <svg
                          className="animate-spin h-5 w-5 text-[#d4b26a]"
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
                      ) : (
                        <svg
                          className="w-5 h-5 text-[#d4b26a]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      )}
                    </label>
                  )}
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {userData.username}
                  </h1>
                  <p className="text-white text-opacity-90 mt-1">
                    {userData.email}
                  </p>
                  <p className="text-white text-opacity-80 text-sm mt-2">
                    Member since {userData.joinedDate}
                  </p>
                  <p className="text-white text-opacity-80 text-sm mt-2">
                    Email Verified:{" "}
                    {emailVerified ? (
                      <span className="text-green-300">Yes &#10003;</span>
                    ) : (
                      <span className="text-red-300">No &#10007;</span>
                    )}
                    {!emailVerified && (
                      <button
                        onClick={handleResendVerificationEmail}
                        className="ml-2 text-white text-opacity-90 underline hover:text-white"
                      >
                        Resend Verification
                      </button>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === "profile"
                      ? "border-[#d4b26a] text-[#d4b26a]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === "orders"
                      ? "border-[#d4b26a] text-[#d4b26a]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  My Orders
                </button>
                <button
                  onClick={() => setActiveTab("password")}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === "password"
                      ? "border-[#d4b26a] text-[#d4b26a]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Change Password
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-8">
              {activeTab === "profile" ? (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Personal Information
                    </h2>
                    {isEditing ? (
                      <div className="space-x-3">
                        <button
                          onClick={handleSaveProfile}
                          disabled={isSavingProfile}
                          className="px-4 py-2 bg-[#d4b26a] text-white rounded-md hover:bg-[#c4a25a] disabled:opacity-50"
                        >
                          {isSavingProfile ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-[#d4b26a] text-white rounded-md hover:bg-[#c4a25a]"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="username"
                          value={userData.username}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#d4b26a] focus:border-[#d4b26a]"
                        />
                      ) : (
                        <p className="px-3 py-2 bg-gray-50 rounded-md">
                          {userData.username}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <p className="px-3 py-2 bg-gray-50 rounded-md">
                        {userData.email}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={userData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#d4b26a] focus:border-[#d4b26a]"
                        />
                      ) : (
                        <p className="px-3 py-2 bg-gray-50 rounded-md">
                          {userData.phone || "Not provided"}
                        </p>
                      )}
                    </div>

                    {/* Shipping Address Fields */}
                    <h3 className="text-lg font-semibold text-gray-800 pt-4">
                      Shipping Address
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 1
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="address.line1"
                          value={userData.address?.line1 || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#d4b26a] focus:border-[#d4b26a]"
                        />
                      ) : (
                        <p className="px-3 py-2 bg-gray-50 rounded-md">
                          {userData.address?.line1 || "Not provided"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 2 (Optional)
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="address.line2"
                          value={userData.address?.line2 || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#d4b26a] focus:border-[#d4b26a]"
                        />
                      ) : (
                        <p className="px-3 py-2 bg-gray-50 rounded-md">
                          {userData.address?.line2 || "Not provided"}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="address.city"
                            value={userData.address?.city || ""}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#d4b26a] focus:border-[#d4b26a]"
                          />
                        ) : (
                          <p className="px-3 py-2 bg-gray-50 rounded-md">
                            {userData.address?.city || "Not provided"}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State/Province
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="address.state"
                            value={userData.address?.state || ""}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#d4b26a] focus:border-[#d4b26a]"
                          />
                        ) : (
                          <p className="px-3 py-2 bg-gray-50 rounded-md">
                            {userData.address?.state || "Not provided"}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Zip/Postal Code
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="address.zipCode"
                            value={userData.address?.zipCode || ""}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#d4b26a] focus:border-[#d4b26a]"
                          />
                        ) : (
                          <p className="px-3 py-2 bg-gray-50 rounded-md">
                            {userData.address?.zipCode || "Not provided"}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="address.country"
                            value={userData.address?.country || ""}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#d4b26a] focus:border-[#d4b26a]"
                          />
                        ) : (
                          <p className="px-3 py-2 bg-gray-50 rounded-md">
                            {userData.address?.country || "Not provided"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : activeTab === "orders" ? (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Recent Orders
                  </h2>
                  {isOrdersLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d4b26a] mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading orders...</p>
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Order #
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Items
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {orders.map((order) => (
                            <tr key={order.orderId}>
                              {" "}
                              {/* Use orderId from Firestore */}
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                #{order.orderId.substring(0, 8).toUpperCase()}{" "}
                                {/* Shorten for display */}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {order.orderDate.toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    order.status === "Delivered"
                                      ? "bg-green-100 text-green-800"
                                      : order.status === "Processing"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                R{order.totalAmount.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <ul className="list-disc list-inside">
                                  {order.items.map((item, itemIndex) => (
                                    <li key={itemIndex}>
                                      {item.name} (x{item.quantity})
                                    </li>
                                  ))}
                                </ul>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
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
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        ></path>
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No orders yet
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Your order history will appear here once you make
                        purchases.
                      </p>
                      <div className="mt-6">
                        <button
                          onClick={() => router.push("/main/shop")}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#d4b26a] hover:bg-[#c4a25a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4b26a]"
                        >
                          Start Shopping
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Change Password
                  </h2>
                  <form
                    onSubmit={handlePasswordUpdate}
                    className="space-y-4 max-w-md"
                  >
                    <div>
                      <label
                        htmlFor="current-password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="current-password"
                        name="current"
                        value={newPassword.current}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#d4b26a] focus:border-[#d4b26a]"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="new-password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        New Password
                      </label>
                      <input
                        type="password"
                        id="new-password"
                        name="new"
                        value={newPassword.new}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#d4b26a] focus:border-[#d4b26a]"
                        required
                        minLength={8}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Password must be 8-13 characters long, contain at least
                        one uppercase letter, one number, and one special
                        character.
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="confirm-password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirm-password"
                        name="confirm"
                        value={newPassword.confirm}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#d4b26a] focus:border-[#d4b26a]"
                        required
                        minLength={8}
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isUpdatingPassword}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#d4b26a] hover:bg-[#c4a25a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4b26a] disabled:opacity-50"
                      >
                        {isUpdatingPassword ? "Updating..." : "Update Password"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Footer with Logout */}
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sign Out
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
