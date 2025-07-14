"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileCompletionModal({ onClose }) {
  const router = useRouter();

  const handleCompleteNow = () => {
    router.push("/main/profile");
    onClose();
  };

  const handleLater = () => {
    router.push("/");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Complete Your Profile
          </h2>
          <p className="text-gray-600 mb-6">
            Your profile is incomplete. Completing it now will unlock the best
            experience and personalized features.
          </p>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={handleLater}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 text-gray-700 transition-colors font-medium"
          >
            Maybe Later
          </button>
          <button
            onClick={handleCompleteNow}
            className="px-6 py-2 bg-[#d4b26a] hover:bg-[#c4a25a] text-white rounded-md transition-colors font-medium shadow-sm"
          >
            Complete Profile
          </button>
        </div>
      </div>
    </div>
  );
}
