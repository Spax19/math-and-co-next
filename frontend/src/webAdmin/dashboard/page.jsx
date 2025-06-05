// app/webadmin/layout.jsx
"use client";
import ProtectedRoute from '../../components/ProtectedRoute';

export default function WebAdminLayout({ children }) {
  return (
    <ProtectedRoute requiredRole="webadmin">
      <div className="webadmin-layout">
        {/* WebAdmin sidebar/navigation */}
        {children}
      </div>
    </ProtectedRoute>
  );
}