"use client";

import ProtectedRoute from "../../../components/protectedRoutes";
import AdminSidebar from "../../../components/admin/adminSidebar";
import "../../globals.css"; // Ensure your global styles (including Tailwind) are imported
import { Settings } from "lucide-react"; // Icon for settings

export default function AdminSettingsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
            <Settings className="w-8 h-8 mr-3 text-[#d4b26a]" /> Admin Settings
          </h1>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              General Settings
            </h2>
            <p className="text-gray-600 mb-4">
              Configure various aspects of the administration panel and overall
              application behavior.
            </p>
            {/* Placeholder for settings forms */}
            <div className="border border-gray-200 rounded-md p-4 text-center text-gray-500">
              <p>Settings forms and options will be here.</p>
              <button className="mt-4 px-4 py-2 bg-[#d4b26a] text-white rounded-md hover:bg-[#c4a25a]">
                Save Settings
              </button>
            </div>
          </div>

          {/* Add more sections for email settings, integrations, etc. */}
        </main>
      </div>
    </ProtectedRoute>
  );
}
