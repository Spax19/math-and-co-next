'use client';
import ProtectedRoute from '../../../components/protectedRoutes';

export default function AdminDashboard() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        {/* Admin content */}
      </div>
    </ProtectedRoute>
  );
}