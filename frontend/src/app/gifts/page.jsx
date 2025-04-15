"use client";
import React, {useState} from "react";

function MainComponent() {
  const [selectedCategory, setSelectedCategory] = useState("collections");
  const [selectedWines, setSelectedWines] = useState([]);
  const [selectedPackaging, setSelectedPackaging] = useState("");
  const [giftNote, setGiftNote] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");

  const toggleWine = (wineId) => {
    setSelectedWines((prev) =>
      prev.includes(wineId)
        ? prev.filter((id) => id !== wineId)
        : [...prev, wineId]
    );
  };

  const giftCollections = {
    "Celebration Packages": [
      {
        title: "Anniversary Selection",
        image: "/images/anniversary-gift.jpg",
        price: 150,
        description:
          "A romantic selection of wines perfect for celebrating anniversaries",
      },
      {
        title: "Birthday Surprise",
        image: "/images/birthday-gift.jpg",
        price: 100,
        description: "Festive wine package for birthday celebrations",
      },
      {
        title: "Congratulations Set",
        image: "/images/congrats-gift.jpg",
        price: 125,
        description: "Special wines to mark achievements and milestones",
      },
    ],
    "Corporate Gifts": [
      {
        title: "Client Appreciation",
        image: "/images/client-gift.jpg",
        price: 200,
        description: "Premium wines to show gratitude to valued clients",
      },
      {
        title: "Team Recognition",
        image: "/images/team-gift.jpg",
        price: 500,
        description: "Luxury wine sets for employee recognition",
      },
      {
        title: "Custom Corporate",
        image: "/images/corporate-custom.jpg",
        price: 1000,
        description: "Bespoke corporate gifting solutions",
      },
    ],
    "Special Occasions": [
      {
        title: "Wedding Toast",
        image: "/images/wedding-gift.jpg",
        price: 300,
        description: "Elegant wine selection for wedding celebrations",
      },
      {
        title: "Holiday Cheer",
        image: "/images/holiday-gift.jpg",
        price: 175,
        description: "Festive wines for holiday season gifting",
      },
      {
        title: "Thank You Package",
        image: "/images/thank-you-gift.jpg",
        price: 75,
        description: "Thoughtful wine gifts to express gratitude",
      },
    ],
  };

  const wines = [
    { id: 1, name: "Cabernet Sauvignon Reserve" },
    { id: 2, name: "Chardonnay Estate" },
    { id: 3, name: "Pinot Noir Select" },
    { id: 4, name: "Merlot Premium" },
    { id: 5, name: "Sauvignon Blanc Classic" },
    { id: 6, name: "Rosé Special" },
  ];

  const packagingOptions = [
    { id: "classic", name: "Classic Wood Box" },
    { id: "premium", name: "Premium Gift Basket" },
    { id: "luxury", name: "Luxury Leather Case" },
    { id: "custom", name: "Custom Branded Package" },
  ];

  const digitalOptions = [
    {
      title: "Instant Gift Cards",
      icon: "fa-gift",
      description: "Digital gift cards delivered instantly via email",
    },
    {
      title: "Virtual Tasting Tickets",
      icon: "fa-glass-cheers",
      description: "Access to exclusive online wine tasting events",
    },
    {
      title: "Event Vouchers",
      icon: "fa-ticket-alt",
      description: "Redeemable vouchers for winery events and experiences",
    },
    {
      title: "Club Memberships",
      icon: "fa-users",
      description: "Gift a premium wine club membership",
    },
  ];

  const addOnItems = [
    {
      title: "Wine Accessories",
      image: "/images/accessories.jpg",
      price: 45,
      description: "Premium corkscrews, stoppers, and aerators",
    },
    {
      title: "Gourmet Foods",
      image: "/images/gourmet.jpg",
      price: 65,
      description: "Artisanal chocolates, cheeses, and crackers",
    },
    {
      title: "Local Artisan Products",
      image: "/images/artisan.jpg",
      price: 55,
      description: "Handcrafted items from local artisans",
    },
    {
      title: "Gift Wrapping",
      image: "/images/wrapping.jpg",
      price: 15,
      description: "Luxury gift wrapping service",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-[60vh]">
        <img
          src="/images/wine-gift-hero.jpg"
          alt="Elegant wine gift packaging with ribbon and custom box"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl text-white font-crimson-text text-center">
            Wine Gifts & Special Occasions
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <nav className="flex flex-wrap gap-4 justify-center mb-12">
          {["collections", "giftBuilder", "digital", "addons"].map(
            (category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full ${
                  selectedCategory === category
                    ? "bg-[#d4b26a] text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {category === "giftBuilder"
                  ? "Gift Builder"
                  : category === "digital"
                  ? "Digital Gifts"
                  : category === "addons"
                  ? "Add-Ons"
                  : "Collections"}
              </button>
            )
          )}
        </nav>

        {selectedCategory === "collections" && (
          <div>
            <h2 className="text-3xl font-crimson-text mb-8 text-center">
              Curated Gift Collections
            </h2>
            {Object.entries(giftCollections).map(([category, items]) => (
              <div key={category} className="mb-12">
                <h3 className="text-2xl font-crimson-text mb-6">{category}</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-lg overflow-hidden"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-6">
                        <h4 className="text-xl font-crimson-text mb-2">
                          {item.title}
                        </h4>
                        <p className="text-gray-600 mb-4">{item.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-[#d4b26a]">${item.price}</span>
                          <button className="bg-[#1a1a1a] text-white px-4 py-2 rounded hover:bg-[#333]">
                            Select
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedCategory === "giftBuilder" && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-crimson-text mb-8 text-center">
              Custom Gift Builder
            </h2>
            <div className="bg-[#f9f9f9] rounded-lg p-8">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl mb-4">1. Choose Wines</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {wines.map((wine, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`wine-${index}`}
                          checked={selectedWines.includes(wine.id)}
                          onChange={() => toggleWine(wine.id)}
                        />
                        <label htmlFor={`wine-${index}`}>{wine.name}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl mb-4">2. Select Packaging</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {packagingOptions.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="packaging"
                          id={`packaging-${index}`}
                          value={option.id}
                          checked={selectedPackaging === option.id}
                          onChange={(e) => setSelectedPackaging(e.target.value)}
                        />
                        <label htmlFor={`packaging-${index}`}>
                          {option.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl mb-4">3. Add Personal Note</h3>
                  <textarea
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    className="w-full p-2 border rounded"
                    rows="4"
                    placeholder="Enter your personal message..."
                  />
                </div>

                <div>
                  <h3 className="text-xl mb-4">4. Schedule Delivery</h3>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full p-2 border rounded"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <button className="w-full bg-[#d4b26a] text-white py-3 rounded hover:bg-[#c4a25a]">
                  Create Gift Package
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedCategory === "digital" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {digitalOptions.map((option, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <i
                    className={`fas ${option.icon} text-4xl text-[#d4b26a] mb-4`}
                  ></i>
                  <h3 className="text-xl font-crimson-text mb-2">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{option.description}</p>
                  <button className="w-full bg-[#1a1a1a] text-white px-4 py-2 rounded hover:bg-[#333]">
                    Purchase
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedCategory === "addons" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {addOnItems.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-crimson-text mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[#d4b26a]">${item.price}</span>
                    <button className="bg-[#1a1a1a] text-white px-4 py-2 rounded hover:bg-[#333]">
                      Add to Gift
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MainComponent;