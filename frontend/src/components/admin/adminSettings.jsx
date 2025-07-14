"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { Settings, Globe, Users, DollarSign, Palette } from "lucide-react"; // Icons

const AdminSiteSettingsSection = () => {
  // Dummy Site Settings Data (replace with actual fetch from API)
  const [siteSettings, setSiteSettings] = useState({
    siteName: "Math & Co. Winery",
    contactEmail: "contact@mathandco.com",
    defaultCurrency: "USD",
    enableUserRegistration: true,
    requireEmailVerification: false,
    defaultShippingRate: 15.0,
    inventoryLowThreshold: 20,
    // Add more settings as needed
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSiteSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      // Simulate API call to save settings
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay
      // In a real app: make PUT /api/admin/settings call
      // const response = await fetch("/api/admin/settings", { method: "PUT", body: JSON.stringify(siteSettings), ... });
      // if (!response.ok) throw new Error("Failed to save settings");

      toast.success("Site settings updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to save site settings.");
      console.error("Site Settings Save Error:", error);
    } finally {
      setIsSavingSettings(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-8">
      {/* General Site Settings */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Globe className="w-5 h-5 mr-2 text-gray-600" /> General Site Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="siteName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Site Name
            </label>
            <input
              type="text"
              id="siteName"
              name="siteName"
              value={siteSettings.siteName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#d4b26a] focus:border-[#d4b26a]"
            />
          </div>
          <div>
            <label
              htmlFor="contactEmail"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contact Email
            </label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={siteSettings.contactEmail}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#d4b26a] focus:border-[#d4b26a]"
            />
          </div>
          <div>
            <label
              htmlFor="defaultCurrency"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Default Currency
            </label>
            <select
              id="defaultCurrency"
              name="defaultCurrency"
              value={siteSettings.defaultCurrency}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#d4b26a] focus:border-[#d4b26a]"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="ZAR">ZAR (South African Rand)</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Management Settings */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-gray-600" /> User Management
          Settings
        </h2>
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableUserRegistration"
              name="enableUserRegistration"
              checked={siteSettings.enableUserRegistration}
              onChange={handleChange}
              className="h-4 w-4 text-[#d4b26a] focus:ring-[#d4b26a] border-gray-300 rounded"
            />
            <label
              htmlFor="enableUserRegistration"
              className="ml-2 block text-sm text-gray-900"
            >
              Enable New User Registration
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="requireEmailVerification"
              name="requireEmailVerification"
              checked={siteSettings.requireEmailVerification}
              onChange={handleChange}
              className="h-4 w-4 text-[#d4b26a] focus:ring-[#d4b26a] border-gray-300 rounded"
            />
            <label
              htmlFor="requireEmailVerification"
              className="ml-2 block text-sm text-gray-900"
            >
              Require Email Verification for New Users
            </label>
          </div>
        </div>
      </div>

      {/* Inventory & Order Settings */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-gray-600" /> Inventory &
          Order Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="defaultShippingRate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Default Shipping Rate ($)
            </label>
            <input
              type="number"
              id="defaultShippingRate"
              name="defaultShippingRate"
              value={siteSettings.defaultShippingRate}
              onChange={handleChange}
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#d4b26a] focus:border-[#d4b26a]"
            />
          </div>
          <div>
            <label
              htmlFor="inventoryLowThreshold"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Inventory Low Stock Threshold
            </label>
            <input
              type="number"
              id="inventoryLowThreshold"
              name="inventoryLowThreshold"
              value={siteSettings.inventoryLowThreshold}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#d4b26a] focus:border-[#d4b26a]"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          onClick={handleSaveSettings}
          disabled={isSavingSettings}
          className="px-6 py-2 bg-[#d4b26a] text-white rounded-md font-medium hover:bg-[#c4a25a] disabled:opacity-50 transition-colors"
        >
          {isSavingSettings ? "Saving..." : "Save All Settings"}
        </button>
      </div>
    </div>
  );
};

export default AdminSiteSettingsSection;
