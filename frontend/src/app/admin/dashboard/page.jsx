"use client";

import ProtectedRoute from "../../../components/protectedRoutes";
import AdminSidebar from "../../../components/admin/adminSidebar"; // Adjust path
import AdminDashboardContent from "../../../components/admin/dashboardContent"; // Adjust path
import "../../globals.css"; // Ensure your global styles (including Tailwind) are imported

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen bg-gray-50">
        {" "}
        {/* Flex container for sidebar and content */}
        <AdminSidebar />
        <main className="flex-1">
          {" "}
          {/* Main content area takes remaining space */}
          <AdminDashboardContent />
        </main>
      </div>
    </ProtectedRoute>
  );
}
