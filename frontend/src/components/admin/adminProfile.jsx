"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Image as ImageIcon,
} from "lucide-react"; // Icons

const AdminProfileSection = () => {
  // Dummy User Data (replace with actual fetch from API)
  const [userData, setUserData] = useState({
    username: "Admin User",
    email: "admin@example.com",
    phone: "081-123-4567",
    address: "123 Admin Street, Adminville, 12345",
    avatar: "https://placehold.co/100x100/d4b26a/fff?text=ADMIN", // Default admin avatar
    joinedDate: "2023-01-01",
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false); // Loading state for profile save

  const [newPassword, setNewPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false); // Loading state for password update

  // Utility to format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setNewPassword((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
      // In a real app: make PUT /api/profile call
      // const response = await fetch("/api/profile", { method: "PUT", ... });
      // if (!response.ok) throw new Error("Update failed");

      toast.success("Profile updated successfully");
      setIsEditingProfile(false);
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
      console.error("Profile Update Error:", error);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (newPassword.new !== newPassword.confirm) {
      toast.error("New passwords do not match");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
      // In a real app: make PUT /api/change-password call
      // const response = await fetch("/api/change-password", { method: "PUT", ... });
      // if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || "Password update failed"); }

      toast.success("Password updated successfully");
      setNewPassword({ current: "", new: "", confirm: "" });
    } catch (error) {
      toast.error(error.message || "Failed to update password");
      console.error("Password Update Error:", error);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size should be less than 2MB");
      return;
    }

    setIsSavingProfile(true); // Use profile saving state for avatar upload
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay
      // In a real app: make POST /api/upload-avatar call
      // const formData = new FormData(); formData.append("avatar", file);
      // const response = await fetch("/api/upload-avatar", { method: "POST", body: formData, ... });
      // if (!response.ok) throw new Error("Upload failed");
      // const data = await response.json();
      // setUserData((prev) => ({ ...prev, avatar: data.avatarUrl }));

      // For dummy, just use a placeholder
      setUserData((prev) => ({ ...prev, avatar: URL.createObjectURL(file) }));
      toast.success("Avatar updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to upload avatar");
      console.error("Avatar Upload Error:", error);
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-[#d4b26a] to-[#e8c87e] p-6 md:p-8 text-white rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row items-center">
          <div className="relative mb-4 md:mb-0 md:mr-6">
            <img
              src={userData.avatar}
              alt="Profile"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white border-opacity-80 object-cover shadow-lg"
            />
            {isEditingProfile && (
              <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  accept="image/*"
                />
                <ImageIcon className="w-5 h-5 text-[#d4b26a]" />
              </label>
            )}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold">
              {userData.username}
            </h1>
            <p className="text-white text-opacity-90 mt-1">{userData.email}</p>
            <p className="text-white text-opacity-80 text-sm mt-2">
              Member since {formatDate(userData.joinedDate)}
            </p>
          </div>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <User className="w-5 h-5 mr-2 text-gray-600" /> Personal Information
          </h2>
          {isEditingProfile ? (
            <div className="space-x-3">
              <button
                onClick={handleSaveProfile}
                disabled={isSavingProfile}
                className="px-4 py-2 bg-[#d4b26a] text-white rounded-md hover:bg-[#c4a25a] disabled:opacity-50 transition-colors"
              >
                {isSavingProfile ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="px-4 py-2 bg-[#d4b26a] text-white rounded-md hover:bg-[#c4a25a] transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            {isEditingProfile ? (
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
            {isEditingProfile ? (
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#d4b26a] focus:border-[#d4b26a]"
              />
            ) : (
              <p className="px-3 py-2 bg-gray-50 rounded-md">
                {userData.email}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            {isEditingProfile ? (
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shipping Address
            </label>
            {isEditingProfile ? (
              <textarea
                name="address"
                value={userData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#d4b26a] focus:border-[#d4b26a]"
              />
            ) : (
              <p className="px-3 py-2 bg-gray-50 rounded-md">
                {userData.address || "Not provided"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <Lock className="w-5 h-5 mr-2 text-gray-600" /> Change Password
        </h2>
        <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
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
              Password must be 8-13 characters long, contain at least one
              uppercase letter, one number, and one special character.
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
    </div>
  );
};

export default AdminProfileSection;
