// app/admin/layout.jsx
"use client";
import ProtectedRoute from '../../components/ProtectedRoute';

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="admin-layout">
        {/* Admin sidebar/navigation */}
        {children}
      </div>
    </ProtectedRoute>
  );
}