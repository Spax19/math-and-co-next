"use client";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";
import React, { useState } from "react";

function MainComponent() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [sortBy, setSortBy] = useState("date");

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
      (event) =>
        selectedCategory === "all" || event.category === selectedCategory
    )
  );

  // const signatureExperiences = [
  //   {
  //     id: 1,
  //     title: "Winemaker Dinner",
  //     price: 150,
  //     icon: "fa-utensils",
  //     highlights: [
  //       "Five-course pairing menu",
  //       "Meet the winemaker",
  //       "Behind-the-scenes stories",
  //       "Exclusive wine access"
  //     ],
  //     buttonText: "Reserve Dinner"
  //   },
  //   {
  //     id: 2,
  //     title: "Harvest Experience",
  //     price: 95,
  //     icon: "fa-wine-bottle",
  //     highlights: [
  //       "Hands-on grape picking",
  //       "Traditional foot stomping",
  //       "Farm-to-table lunch",
  //       "Take-home bottle"
  //     ],
  //     buttonText: "Join Harvest"
  //   },
  //   {
  //     id: 3,
  //     title: "Vineyard Tour & Tasting",
  //     price: 65,
  //     icon: "fa-vine",
  //     highlights: [
  //       "Guided vineyard walk",
  //       "Barrel room experience",
  //       "Premium tasting flight",
  //       "Scenic photo opportunities"
  //     ],
  //     buttonText: "Book Tour"
  //   }
  // ];

  // Educational series data
  const educationalSeries = [
    {
      id: 1,
      title: "Wine 101 Workshop",
      icon: "fa-glass-martini-alt",
      description: "Perfect for beginners",
      buttonText: "Learn More"
    },
    {
      id: 2,
      title: "Regional Deep Dives",
      icon: "fa-globe-americas",
      description: "Explore wine regions",
      buttonText: "Learn More"
    },
    {
      id: 3,
      title: "Food Pairing Masterclass",
      icon: "fa-concierge-bell",
      description: "Master food and wine",
      buttonText: "Learn More"
    }
  ];


  // Booking modal state
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

  const initialBookingState = {
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
  };

  // Educational materials state
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  // Signature experiences data
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

  // Educational materials data
  const educationalMaterials = {
    "Wine 101 Workshop": {
      title: "Wine Fundamentals Guide",
      description: "Complete beginner's guide to wine tasting and appreciation",
      content: [
        "Understanding wine varieties",
        "Proper tasting techniques",
        "Reading wine labels",
        "Basic food pairing principles"
      ],
      resources: [
        { type: "pdf", title: "Wine 101 Handbook", url: "#" },
        { type: "video", title: "Tasting Techniques", url: "#" }
      ]
    },
    "Regional Deep Dives": {
      title: "World Wine Regions Guide",
      description: "Explore famous wine regions and their characteristics",
      content: [
        "Old World vs New World wines",
        "Terroir and its influence",
        "Signature grapes by region",
        "Regional winemaking traditions"
      ],
      resources: [
        { type: "interactive", title: "Region Explorer", url: "#" },
        { type: "pdf", title: "Regional Cheat Sheet", url: "#" }
      ]
    },
    "Food Pairing Masterclass": {
      title: "Perfect Pairings Guide",
      description: "Master the art of matching food and wine",
      content: [
        "Flavor interaction principles",
        "Classic pairing combinations",
        "Handling difficult ingredients",
        "Creating pairing menus"
      ],
      resources: [
        { type: "pdf", title: "Pairing Handbook", url: "#" },
        { type: "video", title: "Demo: Pairing Session", url: "#" }
      ]
    }
  };

  const handleBookingClick = (experience, customPrice = null) => {
    setBookingData({
      ...initialBookingState,
      experience: experience.title,
      eventName: experience.title,
      eventType: experience.type || "private", // default to private for event planner
      price: customPrice !== null ? customPrice : experience.price,
      availableTimes: experience.availableTimes || []
    });
    setShowBookingModal(true);
  };

  const handleMaterialClick = (materialTitle) => {
    setSelectedMaterial(educationalMaterials[materialTitle]);
    setShowMaterialModal(true);
  };

  // const handleBookingSubmit = (e) => {
  //   e.preventDefault();
  //   // Here you would typically send the booking data to your backend
  //   console.log("Booking submitted:", bookingData);
  //   setShowBookingModal(false);
  //   // Reset form or show success message
  // };

  // State for form validation
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Booking modal state with initial validation states
  //  const [bookingData, setBookingData] = useState({
  //    eventName: "",
  //    eventType: "",
  //    price: 0,
  //    date: "",
  //    time: "",
  //    guests: 1,
  //    name: "",
  //    email: "",
  //    phone: "",
  //    specialRequests: "",
  //    // Validation states
  //    dateValid: false,
  //    timeValid: false,
  //    guestsValid: true,
  //    nameValid: false,
  //    emailValid: false,
  //    phoneValid: false
  //  });

  // Validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Validate phone number (basic validation)
  const validatePhone = (phone) => {
    const re = /^[0-9]{10,15}$/;
    return re.test(phone);
  };

  // Validate all fields
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

  // Handle field changes with validation
  const handleInputChange = (field, value) => {
    let isValid = true;

    switch (field) {
      case 'email':
        isValid = validateEmail(value);
        break;
      case 'phone':
        isValid = validatePhone(value);
        break;
      case 'name':
        isValid = value.trim().length > 0;
        break;
      case 'guests':
        isValid = value >= 1 && value <= 12;
        break;
      case 'date':
        isValid = value !== "";
        break;
      case 'time':
        isValid = value !== "";
        break;
    }

    setBookingData({
      ...bookingData,
      [field]: value,
      [`${field}Valid`]: isValid
    });
  };

  // Handle form submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (validateForm()) {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("Booking submitted:", bookingData);
        // Show success message or redirect
        setShowBookingModal(false);
        // Reset form
        setBookingData({
          ...initialBookingState,
          eventName: bookingData.eventName,
          eventType: bookingData.eventType,
          price: bookingData.price
        });
        setIsSubmitted(false);
      } catch (error) {
        console.error("Booking error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };




  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        <div className="w-full bg-gradient-to-r from-[#d4b26a] to-black text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-block relative">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 relative z-10">
                Our <span className="text-[#d4b26a]">Events</span>
              </h1>
              <div className="absolute -bottom-2 left-0 right-0 h-3 bg-amber-100/70 z-0"></div>
            </div>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mt-4">
              Create unforgettable memories in our scenic vineyard
            </p>
            <div className="w-24 h-1 bg-[#d4b26a] mx-auto mt-6 rounded-full"></div>
          </div>
        </div>


        <div className="container mx-auto px-4 py-12 mt-8">

          {/* Signature Experiences Section */}
          <section className="mb-20">
            {/* <h2 className="text-3xl font-crimson-text text-center mb-12">
              Signature Experiences
            </h2> */}
            <div className="grid md:grid-cols-3 gap-8">
              {signatureExperiences.map((experience) => (
                <div key={experience.id} className="bg-white rounded-lg shadow-lg p-6">
                  <i className={`fas ${experience.icon} text-4xl text-[#d4b26a] mb-4`}></i>
                  <h3 className="font-crimson-text text-xl mb-2">
                    {experience.title}
                  </h3>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">R {experience.price}/person</span>
                    <span className="text-sm text-gray-500">{experience.duration}</span>
                  </div>
                  <ul className="text-gray-600 mb-4 space-y-2">
                    {experience.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-center">
                        <i className="fas fa-check text-[#d4b26a] mr-2"></i>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleBookingClick(experience)}
                    className="w-full bg-[#d4b26a]  text-white px-4 py-2 rounded hover:bg-[#c4a25a] transition-colors"
                  >
                    <i className="fas fa-calendar-check mr-2"></i>
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Updated Category Filters */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full flex items-center gap-2 text-sm transition-colors ${selectedCategory === category.id
                  ? "bg-gradient-to-r from-[#d4b26a] to-black text-white"
                  : "bg-gray-100 hover:bg-gray-200"
                  }`}
              >
                <i className={`fas ${category.icon}`}></i>
                {category.name}
              </button>
            ))}
          </div>

          {/* Updated Month Filters with Centered Layout on Desktop */}
          <div className="flex flex-col gap-4 mb-8">
            {/* Month Filters Container - Now Centered on Desktop */}
            <div className="w-full flex justify-center">
              <div className="flex flex-nowrap gap-3 overflow-x-auto pb-2 md:overflow-visible md:flex-wrap md:justify-center">
                {monthNames.map((month, index) => (
                  <button
                    key={month}
                    onClick={() => setSelectedMonth(index)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm transition-colors ${selectedMonth === index
                      ? "bg-gradient-to-r from-[#d4b26a] to-black text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                      }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Dropdown - Still Aligned Right */}
            <div className="flex justify-end">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gradient-to-r from-[#d4b26a] to-black text-white px-4 py-2 rounded-lg border border-gray-200"
              >
                <option value="date" className="text-black">Sort by Date</option>
                <option value="price" className="text-black">Sort by Price</option>
                <option value="availability" className="text-black">Sort by Availability</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6 flex flex-col justify-between">
                  <h3 className="text-xl font-crimson-text mb-2">
                    {event.title}
                  </h3>
                  <wbr className="text-gray-600 mb-4" />{event.description}<wbr />
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[#d4b26a] font-bold">
                        R {event.price}
                      </span>
                      <span className="text-gray-500 text-sm ml-2">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowEventModal(true);
                        handleBookingClick(event)
                      }}
                      className="bg-[#d4b26a]  text-white px-4 py-2 rounded hover:bg-[#c4a25a] transition-colors"
                    >
                      <i className="fas fa-calendar-check"></i>
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {event.spots} spots available
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Educational Series Section */}
          {/* <section className="mb-20 mt-8">
            <h2 className="text-3xl font-crimson-text text-center mb-12">
              Educational Series
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {Object.keys(educationalMaterials).map((title) => (
                <div key={title} className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <i className={`fas ${title.includes("101") ? "fa-glass-martini-alt" :
                    title.includes("Regional") ? "fa-globe-americas" : "fa-concierge-bell"
                    } text-4xl text-[#d4b26a] mb-4`}></i>
                  <h3 className="font-crimson-text text-xl mb-2">
                    {title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {educationalMaterials[title].description}
                  </p>
                  <button
                    onClick={() => handleMaterialClick(title)}
                    className="w-full bg-[#d4b26a]  text-white px-4 py-2 rounded hover:bg-[#c4a25a] transition-colors"
                  >
                    Access Materials
                  </button>
                </div>
              ))}
            </div>
          </section> */}

          <div className="mt-16 text-center">
            <h2 className="text-3xl font-crimson-text mb-6">
              Plan Your Private Event
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 bg-white rounded-lg shadow-lg">
                <i className="fas fa-glass-cheers text-4xl text-[#d4b26a] mb-4"></i>
                <h3 className="font-crimson-text text-xl mb-2">Venue Capacity</h3>
                <ul className="text-gray-600 space-y-2 text-left">
                  <li>Indoor Dining: 120 guests</li>
                  <li>Outdoor Terrace: 200 guests</li>
                  <li>Barrel Room: 80 guests</li>
                  <li>Private Tasting Room: 20 guests</li>
                </ul>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-lg">
                <i className="fas fa-utensils text-4xl text-[#d4b26a] mb-4"></i>
                <h3 className="font-crimson-text text-xl mb-2">Sample Menus</h3>
                <ul className="text-gray-600 space-y-2 text-left">
                  <li>Cocktail Reception</li>
                  <li>Plated Dinner Service</li>
                  <li>Wine Pairing Menu</li>
                  <li>Custom Menu Options</li>
                </ul>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-lg">
                <i className="fas fa-video text-4xl text-[#d4b26a] mb-4"></i>
                <h3 className="font-crimson-text text-xl mb-2">Virtual Tour</h3>
                <p className="text-gray-600 mb-4">
                  Experience our venues before booking
                </p>
                <button className="bg-[#d4b26a]  text-white px-6 py-2 rounded hover:bg-[#c4a25a] transition-colors">
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
              className="mt-8 bg-[#d4b26a] text-white px-8 py-3 rounded-lg hover:bg-[#c4a25a] transition-colors"
            >
              Contact Event Planner
            </button>
          </div>
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
              <button
                onClick={() => {
                  setShowBookingModal(false);
                  setErrors({});
                  setIsSubmitted(false);
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-50 bg-white rounded-full p-2"
              >
                <i className="fas fa-times text-2xl"></i>
              </button>

              <div className="p-6">
                <div className="flex justify-between items-center mb-6 pt-2">
                  <div>
                    <h3 className="text-2xl font-bold">{bookingData.eventName}</h3>
                    <p className="text-gray-600 capitalize">{bookingData.eventType} Experience</p>
                  </div>
                </div>

                <form onSubmit={handleBookingSubmit} noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column - Booking Details */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-[#6B2737] border-b pb-2">
                        Booking Details
                      </h4>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          className={`w-full p-2 border rounded focus:ring-[#6B2737] focus:border-[#6B2737] ${(isSubmitted && errors.date) ? 'border-red-500' : ''
                            }`}
                          value={bookingData.date}
                          onChange={(e) => handleInputChange('date', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                        {isSubmitted && errors.date && (
                          <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Time <span className="text-red-500">*</span>
                        </label>
                        <select
                          className={`w-full p-2 border rounded focus:ring-[#6B2737] focus:border-[#6B2737] ${(isSubmitted && errors.time) ? 'border-red-500' : ''
                            }`}
                          value={bookingData.time}
                          onChange={(e) => handleInputChange('time', e.target.value)}
                          required
                        >
                          <option value="">Select a time</option>
                          {bookingData.availableTimes && bookingData.availableTimes.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                        {isSubmitted && errors.time && (
                          <p className="mt-1 text-sm text-red-600">{errors.time}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Number of Guests <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="12"
                          className={`w-full p-2 border rounded focus:ring-[#6B2737] focus:border-[#6B2737] ${(isSubmitted && errors.guests) ? 'border-red-500' : ''
                            }`}
                          value={bookingData.guests}
                          onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                          required
                        />
                        {isSubmitted && errors.guests && (
                          <p className="mt-1 text-sm text-red-600">{errors.guests}</p>
                        )}
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">Price per person:</span>
                          <span className="font-medium">R{bookingData.price}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total:</span>
                          <span className="text-[#6B2737]">
                            R{bookingData.price * bookingData.guests}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Personal Information */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-[#6B2737] border-b pb-2">
                        Your Information
                      </h4>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className={`w-full p-2 border rounded focus:ring-[#6B2737] focus:border-[#6B2737] ${(isSubmitted && errors.name) ? 'border-red-500' : ''
                            }`}
                          value={bookingData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                        />
                        {isSubmitted && errors.name && (
                          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          className={`w-full p-2 border rounded focus:ring-[#6B2737] focus:border-[#6B2737] ${(isSubmitted && errors.email) ? 'border-red-500' : ''
                            }`}
                          value={bookingData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                        />
                        {isSubmitted && errors.email && (
                          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          className={`w-full p-2 border rounded focus:ring-[#6B2737] focus:border-[#6B2737] ${(isSubmitted && errors.phone) ? 'border-red-500' : ''
                            }`}
                          value={bookingData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          required
                        />
                        {isSubmitted && errors.phone && (
                          <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Special Requests
                        </label>
                        <textarea
                          className="w-full p-2 border rounded focus:ring-[#6B2737] focus:border-[#6B2737]"
                          rows="3"
                          placeholder="Dietary restrictions, accessibility needs, etc."
                          value={bookingData.specialRequests}
                          onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t sticky bottom-0 bg-white">
                    <button
                      type="submit"
                      className={`w-full bg-[#d4b26a] text-white py-3 rounded-lg hover:bg-[#c4a25a]  transition-colors font-medium ${isLoading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Processing...
                        </>
                      ) : (
                        `Confirm Booking for ${bookingData.eventName}`
                      )}
                    </button>

                    {isSubmitted && Object.keys(errors).length > 0 && (
                      <p className="mt-2 text-sm text-red-600 text-center">
                        Please fix the errors above to continue
                      </p>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Educational Material Modal */}
        {showMaterialModal && selectedMaterial && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">{selectedMaterial.title}</h3>
                <button
                  onClick={() => setShowMaterialModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <p className="text-gray-600 mb-4">{selectedMaterial.description}</p>

              <div className="mb-6">
                <h4 className="font-semibold mb-2">What You'll Learn:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {selectedMaterial.content.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Resources:</h4>
                <div className="space-y-2">
                  {selectedMaterial.resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      className="flex items-center p-3 border rounded hover:bg-gray-50"
                    >
                      <i className={`fas fa-${resource.type === 'pdf' ? 'file-pdf' :
                        resource.type === 'video' ? 'video' : 'mouse-pointer'
                        } text-[#d4b26a] mr-2`}></i>
                      {resource.title}
                    </a>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setShowMaterialModal(false)}
                  className="w-full bg-[#d4b26a] text-white py-2 rounded hover:bg-[#5a1f2d]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
      <Footer />
    </>
  );
}

export default MainComponent;