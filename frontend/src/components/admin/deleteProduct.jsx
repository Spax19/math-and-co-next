"use client";

import React, { useEffect } from "react";
import { X, Trash2, AlertTriangle } from "lucide-react";

const DeleteProductModal = ({ isOpen, onClose, product, onDeleteConfirm }) => {
  // Control body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  // If the modal is not open, return null immediately.
  if (!isOpen) {
    return null;
  }

  // Don't render if no product is selected
  if (!product) {
    return null;
  }

  return (
    // This div acts as the full-screen backdrop
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={onClose} // Click outside to close
    >
      {/* This div is the actual modal content container */}
      <div
        className="bg-white rounded-lg shadow-xl p-8 w-full max-w-sm relative
                   transform transition-all duration-300 scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing the modal
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Confirm Deletion
          </h2>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "
            <span className="font-semibold">{product.name}</span>"? This action
            cannot be undone.
          </p>
        </div>

        <div className="flex justify-center space-x-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onDeleteConfirm(product.id)}
            className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
          >
            <Trash2 className="w-5 h-5 mr-2" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProductModal;
