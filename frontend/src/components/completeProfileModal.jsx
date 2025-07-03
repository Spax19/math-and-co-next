"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function ProfileCompletionModal() {
  const router = useRouter();
  const { user, setShowProfileModal } = useAuth();

  const handleCompleteNow = () => {
    setShowProfileModal(false);
    // Redirect to profile page based on role
    const redirectPath =
      user?.role === "admin"
        ? "/admin/profile"
        : user?.role === "web-admin"
        ? "/web-admin/profile"
        : "/main/profile";
    router.push(redirectPath);
  };

  const handleLater = () => {
    setShowProfileModal(false);
    toast.success("You're now logged in!");
    // Redirect to dashboard based on role
    router.push(
      user?.role === "admin"
        ? "/admin/dashboard"
        : user?.role === "web-admin"
        ? "/web-admin/dashboard"
        : "/"
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1002]">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Complete Your Profile</h2>
       
        <div className="flex justify-end gap-4">
          <button
            onClick={handleLater}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Maybe Later
          </button>
          <button
            onClick={handleCompleteNow}
            className="px-4 py-2 bg-[#d4b26a] text-white rounded-md hover:bg-[#c4a25a]"
          >
            Complete Profile
          </button>
        </div>
      </div>
    </div>
  );
}
