"use client";

import { useState } from "react";
import ProtectedRoute from "../../../components/protectedRoutes";
import AdminSidebar from "../../../components/admin/adminSidebar";
import UserDetailModal from "../../../components/admin/userDetails"; // Import the updated modal
import "../../globals.css";
import { Users, CheckCircle, XCircle, UserPlus, Eye } from "lucide-react"; // Icons

export default function AdminUsersPage() {
  // Dummy User Data (ensure 'id' is unique and matches dummy orders in modal)
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Alice Wonderland",
      email: "alice@example.com",
      role: "admin",
      status: "Active",
      joinedDate: "2024-01-15",
      phone: "123-456-7890",
      address: "123 Rabbit Hole, Fantasyland",
      avatar: "https://placehold.co/100x100/FFD700/000?text=A", // Example avatar
    },
    {
      id: 2,
      name: "Bob The Builder",
      email: "bob@example.com",
      role: "user",
      status: "Active",
      joinedDate: "2024-03-20",
      phone: "098-765-4321",
      address: "456 Construction Site, Builderville",
      avatar: "https://placehold.co/100x100/ADD8E6/000?text=B",
    },
    {
      id: 3,
      name: "Charlie Chaplin",
      email: "charlie@example.com",
      role: "user",
      status: "Inactive",
      joinedDate: "2024-02-10",
      phone: "", // No phone
      address: "789 Silent Film Studio, Hollywood",
      avatar: "https://placehold.co/100x100/D3D3D3/000?text=C",
    },
    {
      id: 4,
      name: "Diana Prince",
      email: "diana@example.com",
      role: "web-admin",
      status: "Active",
      joinedDate: "2023-11-01",
      phone: "555-123-4567",
      address: "Themyscira Embassy, Washington DC",
      avatar: "https://placehold.co/100x100/FF69B4/FFF?text=D",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleAddUser = () => {
    alert("Navigate to Add User form");
    // In a real app: navigate to add user form or open add modal
  };

  // Utility to format date for display in table
  const formatDateForTable = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return original if invalid
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 p-8 w-60">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
            <Users className="w-8 h-8 mr-3 text-[#d4b26a]" /> User Management
          </h1>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Registered Users
              </h2>
              <button
                onClick={handleAddUser}
                className="flex items-center px-4 py-2 bg-[#d4b26a] text-white rounded-md font-medium hover:bg-[#c4a25a] transition-colors duration-200 shadow-sm"
              >
                <UserPlus className="w-5 h-5 mr-2" /> Add New User
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              Manage user accounts, roles, and permissions.
            </p>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleViewUser(user)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm capitalize text-[#d4b26a] font-medium">
                        {user.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${
                            user.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.status === "Active" ? (
                            <CheckCircle className="w-3 h-3 inline mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 inline mr-1" />
                          )}
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDateForTable(user.joinedDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewUser(user);
                          }} // Stop propagation to prevent row click
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <Eye className="w-4 h-4 inline" /> View Orders
                        </button>
                        {/* Add Edit/Delete buttons if needed, similar to products page */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* User Detail Modal (now showing orders) */}
      <UserDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={selectedUser} // Pass the entire user object
      />
    </ProtectedRoute>
  );
}
