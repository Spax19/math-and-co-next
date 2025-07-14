"use client";

import { useState } from "react";
import ProtectedRoute from "../../../components/protectedRoutes";
import AdminSidebar from "../../../components/admin/adminSidebar";
import AddEventModal from "../../../components/admin/addEvent"; 
import EditEventModal from "../../../components/admin/editEvent"; 
import DeleteEventModal from "../../../components/admin/deleteEvent"; 
import "../../globals.css";
import {
  Calendar,
  Edit,
  Trash2,
  PlusCircle,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
} from "lucide-react"; // Icons
import { toast } from "react-toastify"; // For notifications

export default function AdminEventsPage() {
  // Dummy Event Data
  const [events, setEvents] = useState([
    {
      id: 1,
      name: "Annual Wine Tasting Gala",
      date: "2025-08-10",
      time: "18:00",
      location: "Grand Ballroom, City Center",
      phoneNo: "011-123-4567",
      email: "info@winetasting.com",
      description:
        "Join us for an exquisite evening of wine tasting featuring rare vintages and gourmet pairings.",
      active: true,
      imageUrl: "https://placehold.co/400x250/d4b26a/fff?text=Wine+Gala",
    },
    {
      id: 2,
      name: "Harvest Festival Celebration",
      date: "2025-09-20",
      time: "10:00",
      location: "Vineyard Estate, Countryside",
      phoneNo: "011-987-6543",
      email: "harvest@winery.com",
      description:
        "A family-friendly festival celebrating the grape harvest with live music, food stalls, and vineyard tours.",
      active: true,
      imageUrl: "https://placehold.co/400x250/e8c87e/000?text=Harvest+Fest",
    },
    {
      id: 3,
      name: "Sommelier Workshop",
      date: "2025-10-05",
      time: "14:00",
      location: "Wine Academy, Downtown",
      phoneNo: "011-555-1234",
      email: "sommelier@academy.com",
      description:
        "An intensive workshop for aspiring sommeliers covering wine regions, tasting techniques, and food pairing.",
      active: false, // Example of an inactive event
      imageUrl: "https://placehold.co/400x250/a0522d/fff?text=Sommelier+Class",
    },
    {
      id: 4,
      name: "Sommelier Workshop",
      date: "2025-10-05",
      time: "14:00",
      location: "Wine Academy, Downtown",
      phoneNo: "011-555-1234",
      email: "sommelier@academy.com",
      description:
        "An intensive workshop for aspiring sommeliers covering wine regions, tasting techniques, and food pairing.",
      active: false, // Example of an inactive event
      imageUrl: "https://placehold.co/400x250/a0522d/fff?text=Sommelier+Class",
    },
   
  ]);

  // State for modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null); // Event currently being edited/deleted

  // Handlers for Add Modal
  const handleAddEventClick = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveNewEvent = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
    toast.success("Event added successfully!");
    setIsAddModalOpen(false);
  };

  // Handlers for Edit Modal
  const handleEditEventClick = (event) => {
    setSelectedEvent(event);
    setIsEditModal(true);
  };

  const handleSaveEditedEvent = (updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
    );
    toast.success("Event updated successfully!");
    setIsEditModal(false);
    setSelectedEvent(null);
  };

  // Handlers for Delete Modal
  const handleDeleteEventClick = (event) => {
    setSelectedEvent(event);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDeleteEvent = (eventId) => {
    setEvents((prevEvents) => prevEvents.filter((e) => e.id !== eventId));
    toast.success("Event deleted successfully!");
    setIsDeleteModalOpen(false);
    setSelectedEvent(null);
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

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen w-full bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 p-8 w-60">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
            <Calendar className="w-8 h-8 mr-3 text-[#d4b26a]" /> Event
            Management
          </h1>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Event List
              </h2>
              <button
                onClick={handleAddEventClick}
                className="flex items-center px-4 py-2 bg-[#d4b26a] text-white rounded-md font-medium hover:bg-[#c4a25a] transition-colors duration-200 shadow-sm"
              >
                <PlusCircle className="w-5 h-5 mr-2" /> Add New Event
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              Manage upcoming and past events.
            </p>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr key={event.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {event.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {event.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDateForDisplay(event.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {event.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {event.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${
                            event.active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {event.active ? (
                            <CheckCircle className="w-3 h-3 inline mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 inline mr-1" />
                          )}
                          {event.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditEventClick(event)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <Edit className="w-4 h-4 inline" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEventClick(event)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4 inline" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveNewEvent}
      />
      <EditEventModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModal(false)}
        event={selectedEvent}
        onSave={handleSaveEditedEvent}
      />
      <DeleteEventModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        event={selectedEvent}
        onDeleteConfirm={handleConfirmDeleteEvent}
      />
    </ProtectedRoute>
  );
}
