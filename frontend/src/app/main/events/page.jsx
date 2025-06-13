"use client";
import Footer from "../../../components/footer";
import Navbar from "../../../components/navbar";
import React, { useState } from "react";
import BookingModal from "../../../components/bookingModal";


function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventFilter, setEventFilter] = useState("upcoming"); // 'upcoming' or 'previous'
  const [bookingData, setBookingData] = useState({
    experience: "",
    eventName: "",
    eventType: "",
    price: 0,
    date: "",
    time: "",
    guests: 1,
    name: "",
    email: "",
    phone: "",
    specialRequests: "",
    availableTimes: [],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const events = [
    {
      id: 1,
      title: "Virtual Wine Tasting",
      date: "2025-03-15",
      category: "virtual",
      price: 45,
      image: "/images/banner.jpeg",
      description:
        "Join our sommelier for an interactive virtual tasting experience",
      spots: 20,
      type: "signature",
      duration: "3 hours",
      availableTimes: ["18:00", "18:30", "19:00"],
      highlights: [
        "5-course meal",
        "Premium wine pairings",
        "Private dining room"
      ]
    },
    {
      id: 2,
      title: "Winemaker Dinner",
      date: "2025-04-20",
      category: "dining",
      price: 150,
      image: "/images/banner.jpeg",
      description:
        "Five-course dinner with wine pairings and winemaker stories",
      spots: 30,
      type: "signature",
      duration: "3 hours",
      availableTimes: ["18:00", "18:30", "19:00"],
      highlights: [
        "5-course meal",
        "Premium wine pairings",
        "Private dining room"
      ]
    },
    {
      id: 3,
      title: "Harvest Experience",
      date: "2025-09-15",
      category: "seasonal",
      price: 95,
      image: "/images/banner.jpeg",
      description: "Hands-on harvest experience with lunch and wine",
      spots: 40,
      type: "signature",
      duration: "3 hours",
      availableTimes: ["18:00", "18:30", "19:00"],
      highlights: [
        "5-course meal",
        "Premium wine pairings",
        "Private dining room"
      ]
    },
    {
      id: 4,
      title: "Wine 101 Workshop",
      date: "2025-05-29",
      category: "education",
      price: 75,
      image: "/images/banner.jpeg",
      description: "Introduction to wine appreciation and tasting",
      spots: 25,
      type: "education",
      duration: "3 hours",
      availableTimes: ["18:00", "18:30", "19:00"],
      highlights: [
        "5-course meal",
        "Premium wine pairings",
        "Private dining room"
      ]
    },
    // Past events
    {
      id: 5,
      title: "Spring Wine Festival",
      date: "2025-04-10",
      category: "seasonal",
      price: 60,
      image: "/images/banner.jpeg",
      description: "Celebrate spring with our seasonal wine selection",
      spots: 0,
      type: "signature",
      duration: "3 hours",
      availableTimes: ["18:00", "18:30", "19:00"],
      highlights: [
        "5-course meal",
        "Premium wine pairings",
        "Private dining room"
      ]
    },
    {
      id: 6,
      title: "Holiday Wine Pairing",
      date: "2025-12-05",
      category: "dining",
      price: 120,
      image: "/images/banner.jpeg",
      description: "Special holiday menu with perfect wine matches",
      spots: 0,
      type: "signature",
      duration: "3 hours",
      availableTimes: ["18:00", "18:30", "19:00"],
      highlights: [
        "5-course meal",
        "Premium wine pairings",
        "Private dining room"
      ]
    },
  ];

  const categories = [
    { id: "all", name: "All Categories", icon: "fa-list" },
    { id: "virtual", name: "Virtual Events", icon: "fa-laptop" },
    { id: "dining", name: "Dining Events", icon: "fa-utensils" },
    { id: "seasonal", name: "Seasonal Events", icon: "fa-sun" },
    { id: "education", name: "Education", icon: "fa-graduation-cap" },
  ];

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Check if event is in the past
  const isPastEvent = (eventDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day

    const eventDay = new Date(eventDate);
    eventDay.setHours(0, 0, 0, 0); // Set to start of day

    return eventDay < today;
  };

  // Get min and max dates for the selected month
  const getMonthDateRange = (monthIndex) => {
    const year = new Date().getFullYear();
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    return {
      minDate: firstDay.toISOString().split("T")[0],
      maxDate: lastDay.toISOString().split("T")[0],
    };
  };
  const signatureExperiences = [
    {
      id: 1,
      title: "Winemaker Dinner",
      price: 150,
      icon: "fa-utensils",
      duration: "3 hours",
      availableTimes: ["18:00", "18:30", "19:00"],
      highlights: [
        "Five-course pairing menu",
        "Meet the winemaker",
        "Behind-the-scenes stories",
        "Exclusive wine access",
      ],
    },
    {
      id: 2,
      title: "Harvest Experience",
      price: 95,
      icon: "fa-wine-bottle",
      duration: "4 hours",
      availableTimes: ["09:00", "10:00", "11:00"],
      highlights: [
        "Hands-on grape picking",
        "Traditional foot stomping",
        "Farm-to-table lunch",
        "Take-home bottle",
      ],
    },
    {
      id: 3,
      title: "Vineyard Tour & Tasting",
      price: 65,
      icon: "fa-vine",
      duration: "2 hours",
      availableTimes: ["10:00", "12:00", "14:00", "16:00"],
      highlights: [
        "Guided vineyard walk",
        "Barrel room experience",
        "Premium tasting flight",
        "Scenic photo opportunities",
      ],
    },
  ];

  const filteredEvents = events
    .filter((event) => {
      const eventDate = new Date(event.date);
      const eventMonth = eventDate.getMonth();

      // Filter by event time (upcoming or previous)
      const timeMatch =
        (eventFilter === "upcoming" && !isPastEvent(event.date)) ||
        (eventFilter === "previous" && isPastEvent(event.date));

      // Filter by category
      const categoryMatch =
        selectedCategory === "all" || event.category === selectedCategory;

      // Filter by month
      const monthMatch = eventMonth === selectedMonth;

      // Filter by selected date if any
      const dateMatch =
        !selectedDate ||
        eventDate.toDateString() === new Date(selectedDate).toDateString();

      return timeMatch && categoryMatch && monthMatch && dateMatch;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const clearDateFilter = () => {
    setSelectedDate(null);
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedMonth(new Date().getMonth());
    setSelectedDate(null);
    setEventFilter("upcoming");
  };

  const monthRange = getMonthDateRange(selectedMonth);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^[0-9]{10,15}$/;
    return re.test(phone);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!bookingData.date) newErrors.date = "Please select a date";
    if (!bookingData.time) newErrors.time = "Please select a time";
    if (bookingData.guests < 1 || bookingData.guests > 12)
      newErrors.guests = "Please enter 1-12 guests";
    if (!bookingData.name.trim()) newErrors.name = "Please enter your name";
    if (!validateEmail(bookingData.email))
      newErrors.email = "Please enter a valid email";
    if (!validatePhone(bookingData.phone))
      newErrors.phone = "Please enter a valid phone number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update the handleBookingClick function to include all event details
  const handleBookingClick = (event, customPrice = null) => {
    setBookingData({
      experience: event.title,
      eventName: event.title,
      eventType: event.type || "event",
      price: customPrice !== null ? customPrice : event.price,
      availableTimes: event.availableTimes || [],
      date: event.date, // Pre-fill with event date
      time: "",
      guests: 1,
      name: "",
      email: "",
      phone: "",
      specialRequests: "",
      duration: event.duration,
      highlights: event.highlights,
      description: event.description,
      image: event.image
    });
    setShowBookingModal(true);
  };


  const handleInputChange = (field, value) => {
    setBookingData({ ...bookingData, [field]: value });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (validateForm()) {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setShowBookingModal(false);
        setBookingData({
          ...bookingData,
          date: "",
          time: "",
          guests: 1,
          name: "",
          email: "",
          phone: "",
          specialRequests: "",
        });
        setIsSubmitted(false);
      } finally {
        setIsLoading(false);
      }
    }
  };
  return (
    <>
      <Navbar />
      <div className="events-page">
        {/* Hero Section */}
        <div className="events-hero">
          <div className="events-hero-content">
            <div className="events-title-container">
              <h1 className="events-title">
                Our <span className="events-title-highlight">Events</span>
              </h1>
              <div className="events-title-underline"></div>
            </div>
            <p className="events-subtitle">
              Create unforgettable memories in our scenic vineyard
            </p>
            <div className="events-divider"></div>
          </div>
        </div>

        <div className="events-container">
          {/* Event Type Filters */}
          <div className="combined-filters">
            {/* Event Type Filters */}
            <div className="event-type-filters">
              <button
                onClick={() => {
                  setEventFilter("upcoming");
                  setSelectedDate(null);
                }}
                className={`event-type-btn ${eventFilter === "upcoming" ? "active" : ""
                  }`}
              >
                <i className="fas fa-calendar-check"></i> Upcoming
              </button>
              <button
                onClick={() => {
                  setEventFilter("previous");
                  setSelectedDate(null);
                }}
                className={`event-type-btn ${eventFilter === "previous" ? "active" : ""
                  }`}
              >
                <i className="fas fa-history"></i> Previous
              </button>
              {/* Month Dropdown */}
              <div className="month-dropdown">
                <select
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(parseInt(e.target.value));
                    setSelectedDate(null);
                  }}
                  className="month-select"
                >
                  {/* <i className="fas fa-calendar-day"></i> */}
                  {monthNames.map((month, index) => (
                    <option key={month} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date Picker */}
            {/* <div className="date-picker-container">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="date-picker-btn"
              >
                <i className="fas fa-calendar-day"></i>
                {selectedDate
                  ? new Date(selectedDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  : "Pick Date"}
              </button>

              {showDatePicker && (
                <div className="date-picker-popup">
                  <input
                    type="date"
                    min={monthRange.minDate}
                    max={monthRange.maxDate}
                    onChange={(e) => handleDateSelect(e.target.value)}
                    className="date-picker-input"
                  />
                </div>
              )}
            </div> */}
          </div>

          {/* Category Filters */}
          {/* <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`category-btn ${
                  selectedCategory === category.id ? "active" : ""
                }`}
              >
                <i className={`fas ${category.icon}`}></i>
                {category.name}
              </button>
            ))}
          </div> */}

          {/* Month and Date Filters */}
          {/* <div className="month-date-filters">
            <div className="month-filters">
              {monthNames.map((month, index) => (
                <button
                  key={month}
                  onClick={() => {
                    setSelectedMonth(index);
                    setSelectedDate(null);
                  }}
                  className={`month-btn ${
                    selectedMonth === index ? "active" : ""
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>
          </div> */}

          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <div className="events-grid">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className={`event-card ${isPastEvent(event.date) ? "past-event" : ""
                    }`}
                  onClick={() => {
                    if (!isPastEvent(event.date)) {
                      setSelectedEvent(event);
                      setShowEventModal(true);
                      handleBookingClick(event);
                    }
                  }}
                >
                  <div className="event-date-badge">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <img
                    src={event.image}
                    alt={event.title}
                    className="event-image"
                  />
                  <div className="event-content">
                    {/* {isPastEvent(event.date) && (
                      <div className="event-badge past">Past Event</div>
                    )} */}
                    <h3 className="event-title">{event.title}</h3>
                    <p className="event-description">{event.description}</p>
                    <div className="event-footer">
                      <span className="event-price">R {event.price}</span>
                      {!isPastEvent(event.date) ? (
                        <button className="event-book-btn">
                          <i className="fas fa-calendar-check"></i>
                        </button>
                      ) : (
                        <span className="event-status">Event Completed</span>
                      )}
                    </div>
                    {!isPastEvent(event.date) && (
                      <p className="event-spots">
                        {event.spots} spots available
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-events-message">
              <i className="fas fa-calendar-times"></i>
              <h3>No events found matching your criteria</h3>
              <p>
                Try adjusting your filters or check back later for new events
              </p>
              <button onClick={resetFilters} className="reset-filters-btn">
                {/* <i className="fas fa-sync-alt"></i>*/} Reset All Filters
              </button>
            </div>
          )}

          {/* Private Events Section */}
          <div className="private-events-section">
            <h2 className="section-title">Plan Your Private Event</h2>
            <div className="private-events-grid">
              <div className="private-event-card">
                <i className="fas fa-glass-cheers private-event-icon"></i>
                <h3 className="private-event-title">Venue Capacity</h3>
                <ul className="private-event-list">
                  <li>Indoor Dining: 120 guests</li>
                  <li>Outdoor Terrace: 200 guests</li>
                  <li>Barrel Room: 80 guests</li>
                  <li>Private Tasting Room: 20 guests</li>
                </ul>
              </div>
              <div className="private-event-card">
                <i className="fas fa-utensils private-event-icon"></i>
                <h3 className="private-event-title">Sample Menus</h3>
                <ul className="private-event-list">
                  <li>Cocktail Reception</li>
                  <li>Plated Dinner Service</li>
                  <li>Wine Pairing Menu</li>
                  <li>Custom Menu Options</li>
                </ul>
              </div>
              <div className="private-event-card">
                <i className="fas fa-video private-event-icon"></i>
                <h3 className="private-event-title">Virtual Tour</h3>
                <p className="private-event-description">
                  Experience our venues before booking
                </p>
                <button className="private-event-btn">Schedule Tour</button>
              </div>
            </div>
            <button
              onClick={() =>
                handleBookingClick(
                  {
                    title: "Private Event Inquiry",
                    type: "private",
                    availableTimes: [],
                  },
                  150
                )
              }
              className="contact-planner-btn"
            >
              Contact Event Planner
            </button>
          </div>
        </div>
        {/* Booking Modal */}
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setErrors({});
            setIsSubmitted(false);
          }}
          bookingData={bookingData}
          onSubmit={handleBookingSubmit}
          errors={errors}
          isSubmitted={isSubmitted}
          isLoading={isLoading}
          onInputChange={handleInputChange}
        />
      </div>
      <Footer />
    </>
  );
}

export default EventsPage;
