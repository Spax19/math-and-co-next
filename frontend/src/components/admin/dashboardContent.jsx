"use client";

import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Users,
  Package,
  ShoppingCart,
  Clock,
  AlertTriangle,
  PlusCircle,
  Eye,
  Trash2,
} from "lucide-react"; // Using lucide-react for professional icons
import { toast } from "react-toastify";

const AdminDashboardContent = () => {
  // Mock Data (replace with actual API fetches later)
  const [totalSales, setTotalSales] = useState(12450.75);
  const [totalUsers, setTotalUsers] = useState(150);
  const [totalOrders, setTotalOrders] = useState(75);
  const [recentOrders, setRecentOrders] = useState([
    {
      id: 1,
      orderId: "ORD001",
      customer: "Alice Smith",
      amount: 120.5,
      status: "Processing",
      date: "2025-07-12",
    },
    {
      id: 2,
      orderId: "ORD002",
      customer: "Bob Johnson",
      amount: 75.0,
      status: "Shipped",
      date: "2025-07-11",
    },
    {
      id: 3,
      orderId: "ORD003",
      customer: "Charlie Brown",
      amount: 210.25,
      status: "Delivered",
      date: "2025-07-10",
    },
    {
      id: 4,
      orderId: "ORD004",
      customer: "Diana Prince",
      amount: 99.99,
      status: "Pending",
      date: "2025-07-09",
    },
  ]);
  const [lowStockItems, setLowStockItems] = useState([
    { id: 1, name: "Vintage Merlot 2020", stock: 5, threshold: 10 },
    { id: 2, name: "Sparkling Rosé", stock: 8, threshold: 10 },
  ]);

  // Utility to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Utility to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle actions (mock functions for now)
  const handleViewOrder = (orderId) => {
    toast.info(`Viewing order: ${orderId}`);
    // Implement actual navigation or modal for order details
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm(`Are you sure you want to delete order ${orderId}?`)) {
      setRecentOrders((prev) =>
        prev.filter((order) => order.orderId !== orderId)
      );
      toast.success(`Order ${orderId} deleted.`);
      // Implement actual API call for deletion
    }
  };

  const handleAddProduct = () => {
    toast.info("Navigating to Add Product page/modal.");
    // router.push('/admin/products/add'); // Example navigation
  };

  const handleViewAllUsers = () => {
    toast.info("Navigating to Users Management page.");
    // router.push('/admin/users'); // Example navigation
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Dashboard Overview
      </h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4">
          <div className="p-3 bg-[#d4b26a] rounded-full text-white">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Sales</p>
            <h2 className="text-2xl font-semibold text-gray-900">
              {formatCurrency(totalSales)}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4">
          <div className="p-3 bg-blue-500 rounded-full text-white">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Users</p>
            <h2 className="text-2xl font-semibold text-gray-900">
              {totalUsers}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4">
          <div className="p-3 bg-green-500 rounded-full text-white">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Orders</p>
            <h2 className="text-2xl font-semibold text-gray-900">
              {totalOrders}
            </h2>
          </div>
        </div>
      </div>

      {/* Recent Orders and Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-gray-600" /> Recent Orders
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.orderId}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {order.customer}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatCurrency(order.amount)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Shipped"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "Processing"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewOrder(order.orderId)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <Eye className="w-4 h-4 inline" /> View
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.orderId)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4 inline" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-4 text-center text-gray-500"
                    >
                      No recent orders.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-500" /> Low Stock
            Alerts
          </h3>
          {lowStockItems.length > 0 ? (
            <ul className="space-y-3">
              {lowStockItems.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between bg-red-50 p-3 rounded-md border border-red-200"
                >
                  <span className="font-medium text-red-800">{item.name}</span>
                  <span className="text-red-600">
                    {item.stock} bottles left (Threshold: {item.threshold})
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No low stock items. Inventory looks good!
            </p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleAddProduct}
            className="flex items-center px-6 py-3 bg-[#d4b26a] text-white rounded-md font-medium hover:bg-[#c4a25a] transition-colors duration-200 shadow-sm"
          >
            <PlusCircle className="w-5 h-5 mr-2" /> Add New Product
          </button>
          <button
            onClick={handleViewAllUsers}
            className="flex items-center px-6 py-3 bg-gray-700 text-white rounded-md font-medium hover:bg-gray-600 transition-colors duration-200 shadow-sm"
          >
            <Users className="w-5 h-5 mr-2" /> View All Users
          </button>
          {/* Add more quick action buttons as needed */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardContent;
