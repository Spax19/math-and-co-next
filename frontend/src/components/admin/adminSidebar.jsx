"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  Users,
  Settings, // Keep Settings icon for the unified page
  LogOut,
  Calendar,
  UserCog, // Specifically for profile-like settings
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const AdminSidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    window.location.href = "/";
  };

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: Home },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Events", href: "/admin/events", icon: Calendar },
    { name: "Users", href: "/admin/users", icon: Users },
    // Changed 'Profile' to point to the new unified page, and removed separate 'Settings'
    {
      name: "Profile & Settings",
      href: "/admin/profile-settings",
      icon: UserCog,
    },
  ];

  return (
    <div className="flex flex-col bg-gray-800 text-white w-64 min-h-screen shadow-lg">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-semibold text-[#d4b26a]">Admin Panel</h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200
              ${
                pathname === item.href
                  ? "bg-[#d4b26a] text-white"
                  : "hover:bg-gray-700 text-gray-300"
              }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="text-lg">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Sidebar Footer - Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 rounded-md text-gray-300 hover:bg-gray-700 transition-colors duration-200"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="text-lg">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
