"use client";

import React, { useState, useEffect } from "react";
import { X, Edit, Calendar, MapPin, Phone, Mail, FileText } from "lucide-react";
import { toast } from "react-toastify";

const EditEventModal = ({ isOpen, onClose, event, onSave }) => {
  const [formData, setFormData] = useState(event || {});
  const [imagePreview, setImagePreview] = useState(event?.imageUrl || null);

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        // Ensure date is in YYYY-MM-DD format for input type="date"
        date: event.date
          ? new Date(event.date).toISOString().split("T")[0]
          : "",
      });
      setImagePreview(event.imageUrl || null);
    }
  }, [event]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    const requiredFields = [
      "name",
      "time",
      "location",
      "phoneNo",
      "email",
      "date",
      "description",
    ];
    for (let field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill in the '${field}' field.`);
        return;
      }
    }
    // For image, if a new file is selected, it's in formData.image.
    // If not, it means the existing image path (imagePreview) should be used.
    // In a real app, you'd handle file upload if formData.image is a File object.
    const updatedEvent = {
      ...formData,
      // If a new file was selected, formData.image is a File object.
      // Otherwise, it's the original string path.
      // For dummy data, we'll just use the preview.
      imageUrl:
        formData.image instanceof File
          ? imagePreview
          : formData.imageUrl || imagePreview,
    };

    onSave(updatedEvent);
  };

  if (!isOpen) {
    return null;
  }

  if (!event) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl relative transform transition-all duration-300 scale-100 opacity-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3 flex items-center">
          <Edit className="w-6 h-6 mr-2 text-[#d4b26a]" /> Edit Event
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="edit-name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Event Name
              </label>
              <input
                type="text"
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#d4b26a] focus:border-[#d4b26a]"
                required
              />
            </div>
            <div>
              <label
                htmlFor="edit-date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date
              </label>
              <input
                type="date"
                id="edit-date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#d4b26a] focus:border-[#d4b26a]"
                required
              />
            </div>
            <div>
              <label
                htmlFor="edit-time"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Time
              </label>
              <input
                type="time"
                id="edit-time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#d4b26a] focus:border-[#d4b26a]"
                required
              />
            </div>
            <div>
              <label
                htmlFor="edit-location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Location
              </label>
              <input
                type="text"
                id="edit-location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#d4b26a] focus:border-[#d4b26a]"
                required
              />
            </div>
            <div>
              <label
                htmlFor="edit-phoneNo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="edit-phoneNo"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#d4b26a] focus:border-[#d4b26a]"
                required
              />
            </div>
            <div>
              <label
                htmlFor="edit-email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="edit-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#d4b26a] focus:border-[#d4b26a]"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="edit-description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="edit-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#d4b26a] focus:border-[#d4b26a]"
              required
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="edit-image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Event Image
            </label>
            <input
              type="file"
              id="edit-image"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#d4b26a] focus:border-[#d4b26a]"
            />
            {imagePreview && (
              <div className="mt-2 text-center">
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="max-w-xs max-h-32 object-contain mx-auto rounded-md shadow"
                />
                <p className="text-xs text-gray-500 mt-1">Current Image</p>
              </div>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="edit-active"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="h-4 w-4 text-[#d4b26a] focus:ring-[#d4b26a] border-gray-300 rounded"
            />
            <label
              htmlFor="edit-active"
              className="ml-2 block text-sm text-gray-900"
            >
              Active Event
            </label>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#d4b26a] text-white rounded-md hover:bg-[#c4a25a] transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;
