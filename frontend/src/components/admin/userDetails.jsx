"use client";

import React, { useEffect, useState } from "react";
import { X, ShoppingCart, DollarSign, Calendar, Package } from "lucide-react"; // Icons for order details
import { toast } from "react-toastify";

const UserDetailModal = ({ isOpen, onClose, user }) => {
  // Dummy Order Data for the selected user
  // In a real app, you would fetch this data from an API based on user.id
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    if (isOpen && user) {
      document.body.style.overflow = "hidden"; // Prevent background scroll

      // Simulate fetching orders for the selected user
      // Replace this with an actual API call:
      // fetch(`/api/users/${user.id}/orders`)
      //   .then(res => res.json())
      //   .then(data => setUserOrders(data.orders))
      //   .catch(error => console.error("Failed to fetch user orders:", error));

      // Dummy Data based on user ID for demonstration
      const dummyOrders = {
        1: [
          // Alice Wonderland's orders
          {
            id: "O1",
            orderNumber: "ORD-A101",
            date: "2025-06-25",
            total: 120.5,
            status: "Delivered",
            items: [{ name: "Cabernet Sauvignon", qty: 2, price: 50.0 }],
          },
          {
            id: "O2",
            orderNumber: "ORD-A102",
            date: "2025-07-01",
            total: 75.0,
            status: "Processing",
            items: [{ name: "Chardonnay", qty: 3, price: 25.0 }],
          },
        ],
        2: [
          // Bob The Builder's orders
          {
            id: "O3",
            orderNumber: "ORD-B201",
            date: "2025-05-10",
            total: 250.0,
            status: "Delivered",
            items: [{ name: "Pinot Noir", qty: 5, price: 45.0 }],
          },
        ],
        3: [], // Charlie Chaplin has no orders
        4: [
          // Diana Prince's orders
          {
            id: "O4",
            orderNumber: "ORD-D401",
            date: "2025-07-11",
            total: 88.75,
            status: "Shipped",
            items: [{ name: "Sauvignon Blanc", qty: 4, price: 22.0 }],
          },
          {
            id: "O5",
            orderNumber: "ORD-D402",
            date: "2025-07-13",
            total: 15.99,
            status: "Pending",
            items: [{ name: "Merlot", qty: 1, price: 15.99 }],
          },
        ],
      };
      setUserOrders(dummyOrders[user.id] || []);
    } else {
      document.body.style.overflow = "unset"; // Restore background scroll
      setUserOrders([]); // Clear orders when modal closes
    }
  }, [isOpen, user]); // Re-run when modal opens or user changes

  // Utility to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Utility to format date for display
  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!isOpen) {
    return null;
  }

  if (!user) {
    return null; // Should not happen if isOpen is true, but good safeguard
  }

  return (
    // Full-screen backdrop
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={onClose} // Click outside to close
    >
      {/* Centered modal content */}
      <div
        className="bg-white rounded-lg shadow-xl p-8 w-full max-w-3xl relative transform transition-all duration-300 scale-100 opacity-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close order history"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3 flex items-center">
          <ShoppingCart className="w-6 h-6 mr-2 text-[#d4b26a]" /> Order History
          for {user.name}
        </h2>

        {/* User Info (Optional, can be removed if only orders are needed) */}
        <div className="flex items-center space-x-4 mb-6 pb-4 border-b border-gray-100">
          <img
            src={user.avatar || "/images/default-avatar.jpg"}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#d4b26a]"
          />
          <div>
            <p className="text-lg font-semibold text-gray-900">{user.email}</p>
            <p className="text-gray-600 text-sm capitalize">
              Role: {user.role}
            </p>
          </div>
        </div>

        {/* Order History Table */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Orders
          </h3>
          {userOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDateForDisplay(order.date)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatCurrency(order.total)}
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
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {order.items && order.items.length > 0 ? (
                          <ul className="list-disc list-inside text-xs">
                            {order.items.map((item, idx) => (
                              <li key={idx}>
                                {item.name} (x{item.qty})
                              </li>
                            ))}
                          </ul>
                        ) : (
                          "N/A"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No orders found for this user.
            </p>
          )}
        </div>

        {/* Close button at the bottom (optional, as backdrop click also closes) */}
        {/* <div className="mt-6 border-t pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default UserDetailModal;
