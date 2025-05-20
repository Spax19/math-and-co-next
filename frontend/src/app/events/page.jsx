"use client";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";
import React, { useState } from "react";

function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [sortBy, setSortBy] = useState("date");
  const [showBookingModal, setShowBookingModal] = useState(false);
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
    availableTimes: []
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
      description: "Join our sommelier for an interactive virtual tasting experience",
      spots: 20,
      type: "signature",
    },
    {
      id: 2,
      title: "Winemaker Dinner",
      date: "2025-04-20",
      category: "dining",
      price: 150,
      image: "/images/banner.jpeg",
      description: "Five-course dinner with wine pairings and winemaker stories",
      spots: 30,
      type: "signature",
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
    },
    {
      id: 4,
      title: "Wine 101 Workshop",
      date: "2025-05-01",
      category: "education",
      price: 75,
      image: "/images/banner.jpeg",
      description: "Introduction to wine appreciation and tasting",
      spots: 25,
      type: "education",
    },
  ];

  const categories = [
    { id: "all", name: "All Events", icon: "fa-calendar-alt" },
    { id: "virtual", name: "Virtual Events", icon: "fa-laptop" },
    { id: "dining", name: "Dining Events", icon: "fa-utensils" },
    { id: "seasonal", name: "Seasonal Events", icon: "fa-sun" },
    { id: "education", name: "Education", icon: "fa-graduation-cap" },
  ];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

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
        "Exclusive wine access"
      ]
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
        "Take-home bottle"
      ]
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
        "Scenic photo opportunities"
      ]
    }
  ];

  const sortEvents = (events) => {
    return [...events].sort((a, b) => {
      if (sortBy === "date") return new Date(a.date) - new Date(b.date);
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "availability") return b.spots - a.spots;
      return 0;
    });
  };

  const filteredEvents = sortEvents(
    events.filter(
      (event) => selectedCategory === "all" || event.category === selectedCategory
    )
  );

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
    if (bookingData.guests < 1 || bookingData.guests > 12) newErrors.guests = "Please enter 1-12 guests";
    if (!bookingData.name.trim()) newErrors.name = "Please enter your name";
    if (!validateEmail(bookingData.email)) newErrors.email = "Please enter a valid email";
    if (!validatePhone(bookingData.phone)) newErrors.phone = "Please enter a valid phone number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    let isValid = true;
    switch (field) {
      case 'email': isValid = validateEmail(value); break;
      case 'phone': isValid = validatePhone(value); break;
      case 'name': isValid = value.trim().length > 0; break;
      case 'guests': isValid = value >= 1 && value <= 12; break;
      case 'date': isValid = value !== ""; break;
      case 'time': isValid = value !== ""; break;
    }
    setBookingData({ ...bookingData, [field]: value });
  };

  const handleBookingClick = (experience, customPrice = null) => {
    setBookingData({
      experience: experience.title,
      eventName: experience.title,
      eventType: experience.type || "private",
      price: customPrice !== null ? customPrice : experience.price,
      availableTimes: experience.availableTimes || [],
      date: "",
      time: "",
      guests: 1,
      name: "",
      email: "",
      phone: "",
      specialRequests: ""
    });
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (validateForm()) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setShowBookingModal(false);
        setBookingData({
          ...bookingData,
          date: "",
          time: "",
          guests: 1,
          name: "",
          email: "",
          phone: "",
          specialRequests: ""
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
          {/* Signature Experiences Section */}
          <section className="events-section">
            <div className="signature-experiences-grid">
              {signatureExperiences.map((experience) => (
                <div key={experience.id} className="experience-card">
                  <i className={`fas ${experience.icon} experience-icon`}></i>
                  <h3 className="experience-title">{experience.title}</h3>
                  <div className="experience-details">
                    <span className="experience-price">R {experience.price}/person</span>
                    <span className="experience-duration">{experience.duration}</span>
                  </div>
                  <ul className="experience-highlights">
                    {experience.highlights.map((highlight, i) => (
                      <li key={i} className="highlight-item">
                        <i className="fas fa-check highlight-icon"></i>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleBookingClick(experience)}
                    className="book-now-btn"
                  >
                    <i className="fas fa-calendar-check"></i>
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Category Filters */}
          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`category-btn ${selectedCategory === category.id ? "active" : ""}`}
              >
                <i className={`fas ${category.icon}`}></i>
                {category.name}
              </button>
            ))}
          </div>

          {/* Month Filters */}
          <div className="month-filters-container">
            <div className="month-filters">
              {monthNames.map((month, index) => (
                <button
                  key={month}
                  onClick={() => setSelectedMonth(index)}
                  className={`month-btn ${selectedMonth === index ? "active" : ""}`}
                >
                  {month}
                </button>
              ))}
            </div>

            <div className="sort-dropdown">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="date">Sort by Date</option>
                <option value="price">Sort by Price</option>
                <option value="availability">Sort by Availability</option>
              </select>
            </div>
          </div>

          {/* Events Grid */}
          <div className="events-grid">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="event-card"
                onClick={() => {
                  setSelectedEvent(event);
                  setShowEventModal(true);
                  handleBookingClick(event);
                }}
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="event-image"
                />
                <div className="event-content">
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-description">{event.description}</p>
                  <div className="event-footer">
                    <div>
                      <span className="event-price">R {event.price}</span>
                      <span className="event-date">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    </div>
                    <button className="event-book-btn">
                      <i className="fas fa-calendar-check"></i>
                    </button>
                  </div>
                  <p className="event-spots">{event.spots} spots available</p>
                </div>
              </div>
            ))}
          </div>

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
                <button className="private-event-btn">
                  Schedule Tour
                </button>
              </div>
            </div>
            <button
              onClick={() => handleBookingClick({
                title: "Private Event Inquiry",
                type: "private",
                availableTimes: []
              }, 150)}
              className="contact-planner-btn"
            >
              Contact Event Planner
            </button>
          </div>
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="booking-modal">
            <div className="modal-content">
              <button
                onClick={() => {
                  setShowBookingModal(false);
                  setErrors({});
                  setIsSubmitted(false);
                }}
                className="modal-close-btn"
              >
                <i className="fas fa-times"></i>
              </button>

              <div className="modal-body">
                <div className="modal-header">
                  <h3 className="modal-title">{bookingData.eventName}</h3>
                  <p className="modal-subtitle">{bookingData.eventType} Experience</p>
                </div>

                <form onSubmit={handleBookingSubmit} noValidate>
                  <div className="modal-form-grid">
                    {/* Left Column - Booking Details */}
                    <div className="form-column">
                      <h4 className="form-section-title">Booking Details</h4>

                      <div className="form-group">
                        <label className="form-label">
                          Date <span className="required">*</span>
                        </label>
                        <input
                          type="date"
                          className={`form-input ${(isSubmitted && errors.date) ? 'error' : ''}`}
                          value={bookingData.date}
                          onChange={(e) => handleInputChange('date', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                        {isSubmitted && errors.date && (
                          <p className="error-message">{errors.date}</p>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Time <span className="required">*</span>
                        </label>
                        <select
                          className={`form-input ${(isSubmitted && errors.time) ? 'error' : ''}`}
                          value={bookingData.time}
                          onChange={(e) => handleInputChange('time', e.target.value)}
                          required
                        >
                          <option value="">Select a time</option>
                          {bookingData.availableTimes.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                        {isSubmitted && errors.time && (
                          <p className="error-message">{errors.time}</p>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Number of Guests <span className="required">*</span>
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="12"
                          className={`form-input ${(isSubmitted && errors.guests) ? 'error' : ''}`}
                          value={bookingData.guests}
                          onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                          required
                        />
                        {isSubmitted && errors.guests && (
                          <p className="error-message">{errors.guests}</p>
                        )}
                      </div>

                      <div className="price-summary">
                        <div className="price-row">
                          <span>Price per person:</span>
                          <span>R{bookingData.price}</span>
                        </div>
                        <div className="price-total">
                          <span>Total:</span>
                          <span>R{bookingData.price * bookingData.guests}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Personal Information */}
                    <div className="form-column">
                      <h4 className="form-section-title">Your Information</h4>

                      <div className="form-group">
                        <label className="form-label">
                          Full Name <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-input ${(isSubmitted && errors.name) ? 'error' : ''}`}
                          value={bookingData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                        />
                        {isSubmitted && errors.name && (
                          <p className="error-message">{errors.name}</p>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Email Address <span className="required">*</span>
                        </label>
                        <input
                          type="email"
                          className={`form-input ${(isSubmitted && errors.email) ? 'error' : ''}`}
                          value={bookingData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                        />
                        {isSubmitted && errors.email && (
                          <p className="error-message">{errors.email}</p>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Phone Number <span className="required">*</span>
                        </label>
                        <input
                          type="tel"
                          className={`form-input ${(isSubmitted && errors.phone) ? 'error' : ''}`}
                          value={bookingData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          required
                        />
                        {isSubmitted && errors.phone && (
                          <p className="error-message">{errors.phone}</p>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Special Requests
                        </label>
                        <textarea
                          className="form-textarea"
                          rows="3"
                          placeholder="Dietary restrictions, accessibility needs, etc."
                          value={bookingData.specialRequests}
                          onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="submit"
                      className={`submit-btn ${isLoading ? 'loading' : ''}`}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i>
                          Processing...
                        </>
                      ) : (
                        `Confirm Booking for ${bookingData.eventName}`
                      )}
                    </button>

                    {isSubmitted && Object.keys(errors).length > 0 && (
                      <p className="form-error-message">
                        Please fix the errors above to continue
                      </p>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default EventsPage;