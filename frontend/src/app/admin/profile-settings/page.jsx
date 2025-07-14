"use client";

import { useState } from "react";
import ProtectedRoute from "../../../components/protectedRoutes";
import AdminSidebar from "../../../components/admin/adminSidebar";
import AdminProfileSection from "../../../components/admin/adminProfile"; // New Import
import AdminSiteSettingsSection from "../../../components/admin/adminSettings"; // New Import
import "../../globals.css"; // Ensure your global styles (including Tailwind) are imported
import { User, Settings } from "lucide-react"; // Icons for tabs

export default function AdminProfileSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' or 'site-settings'

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Admin Profile & Settings
          </h1>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-3 px-6 text-center border-b-2 font-medium text-lg flex items-center
                  ${
                    activeTab === "profile"
                      ? "border-[#d4b26a] text-[#d4b26a]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                <User className="w-5 h-5 mr-2" /> Personal Profile
              </button>
              <button
                onClick={() => setActiveTab("site-settings")}
                className={`py-3 px-6 text-center border-b-2 font-medium text-lg flex items-center
                  ${
                    activeTab === "site-settings"
                      ? "border-[#d4b26a] text-[#d4b26a]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                <Settings className="w-5 h-5 mr-2" /> Site Settings
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === "profile" && <AdminProfileSection />}
            {activeTab === "site-settings" && <AdminSiteSettingsSection />}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
