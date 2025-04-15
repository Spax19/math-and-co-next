"use client";
import React, {useState} from "react";

function MainComponent() {
  const [selectedTier, setSelectedTier] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    tier: "",
  });

  const membershipTiers = [
    {
      name: "Explorer",
      price: 50,
      frequency: "Monthly",
      benefits: [
        "2 curated wines monthly",
        "10% off all purchases",
        "Basic event access",
      ],
      color: "bg-[#8B4513]",
    },
    {
      name: "Connoisseur",
      price: 100,
      frequency: "Monthly",
      benefits: [
        "4 premium wines monthly",
        "15% off all purchases",
        "Priority event access",
        "Quarterly winemaker sessions",
      ],
      color: "bg-[#800020]",
    },
    {
      name: "Reserve",
      price: 200,
      frequency: "Monthly",
      benefits: [
        "6 exclusive wines monthly",
        "20% off all purchases",
        "VIP event access",
        "Private tastings quarterly",
      ],
      color: "bg-[#4B0082]",
    },
  ];

  const upcomingEvents = [
    {
      title: "July Wine Preview",
      date: "June 28, 2025",
      description: "First look at next month's exclusive wine selections",
      type: "Preview",
    },
    {
      title: "Harvest Experience",
      date: "August 15, 2025",
      description: "Join us for an exclusive grape harvesting experience",
      type: "Special Event",
    },
    {
      title: "Limited Release Tasting",
      date: "July 10, 2025",
      description: "Members-only tasting of our newest limited releases",
      type: "Exclusive",
    },
    {
      title: "Winemaker Dinner",
      date: "July 25, 2025",
      description: "Intimate dinner with our head winemaker",
      type: "VIP",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.error("Form submission requires backend integration");
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#1a1a1a] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-crimson-text mb-4">
            Wine Club Membership
          </h1>
          <p className="text-xl text-[#d4b26a]">
            Join our exclusive community of wine enthusiasts
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="mb-16">
          <h2 className="text-3xl font-crimson-text text-center mb-12">
            Membership Tiers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {membershipTiers.map((tier) => (
              <div
                key={tier.name}
                className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div
                  className={`${tier.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <span className="text-white font-crimson-text text-xl">
                    {tier.name}
                  </span>
                </div>
                <h3 className="text-2xl font-crimson-text text-center mb-4">
                  {tier.name}
                </h3>
                <p className="text-3xl text-center mb-2">${tier.price}</p>
                <p className="text-gray-600 text-center mb-6">
                  {tier.frequency}
                </p>
                <ul className="space-y-2 mb-6">
                  {tier.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center">
                      <i className="fas fa-check text-[#d4b26a] mr-2"></i>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setSelectedTier(tier.name)}
                  className="w-full bg-[#d4b26a] text-white py-2 rounded hover:bg-[#c4a25a] transition-colors"
                >
                  Select {tier.name}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-crimson-text text-center mb-8">
            Benefits Calculator
          </h2>
          <div className="bg-[#f9f9f9] p-6 rounded-lg max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-crimson-text mb-4">
                  Monthly Savings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2">
                      Average Monthly Purchases ($)
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      placeholder="Enter amount"
                    />
                  </div>
                  <div className="text-lg">
                    Potential Savings:{" "}
                    <span className="text-[#d4b26a]">$0</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-crimson-text mb-4">
                  Reward Points
                </h3>
                <div className="space-y-4">
                  <div className="text-lg">
                    Monthly Points: <span className="text-[#d4b26a]">0</span>
                  </div>
                  <div className="text-lg">
                    Annual Points: <span className="text-[#d4b26a]">0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-crimson-text text-center mb-8">
            Member Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <img
                src="/member1.jpg"
                alt="Wine club member enjoying a tasting"
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h3 className="text-xl font-crimson-text mb-2">
                Sarah's Journey
              </h3>
              <p className="text-gray-600 mb-4">
                "The wine club has transformed my appreciation for fine wines.
                The monthly selections are always exceptional!"
              </p>
              <p className="text-[#d4b26a]">Favorite: 2022 Reserve Cabernet</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <img
                src="/member2.jpg"
                alt="Member participating in harvest"
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h3 className="text-xl font-crimson-text mb-2">
                Michael's Experience
              </h3>
              <p className="text-gray-600 mb-4">
                "Being part of the harvest experience was unforgettable. The
                community here is amazing!"
              </p>
              <p className="text-[#d4b26a]">Favorite: 2023 Estate Chardonnay</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <img
                src="/member3.jpg"
                alt="Wine club member at exclusive event"
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h3 className="text-xl font-crimson-text mb-2">Lisa's Story</h3>
              <p className="text-gray-600 mb-4">
                "The exclusive events and tastings have made this membership
                invaluable to me."
              </p>
              <p className="text-[#d4b26a]">
                Favorite: 2024 Limited Pinot Noir
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-crimson-text text-center mb-8">
            Upcoming Member Exclusives
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="bg-[#f9f9f9] p-6 rounded-lg">
                <div className="text-[#d4b26a] text-sm mb-2">{event.type}</div>
                <h3 className="text-xl font-crimson-text mb-2">
                  {event.title}
                </h3>
                <p className="text-[#d4b26a] mb-2">{event.date}</p>
                <p className="text-gray-600">{event.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-crimson-text text-center mb-8">
            Join Our Wine Club
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 border rounded focus:outline-none focus:border-[#d4b26a]"
                required
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 border rounded focus:outline-none focus:border-[#d4b26a]"
                required
              />
            </div>
            <div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-3 border rounded focus:outline-none focus:border-[#d4b26a]"
                required
              />
            </div>
            <div>
              <textarea
                name="address"
                placeholder="Shipping Address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-3 border rounded focus:outline-none focus:border-[#d4b26a]"
                rows="3"
                required
              ></textarea>
            </div>
            <div>
              <select
                name="tier"
                value={formData.tier}
                onChange={handleInputChange}
                className="w-full p-3 border rounded focus:outline-none focus:border-[#d4b26a]"
                required
              >
                <option value="">Select Membership Tier</option>
                {membershipTiers.map((tier) => (
                  <option key={tier.name} value={tier.name}>
                    {tier.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-[#d4b26a] text-white py-3 rounded hover:bg-[#c4a25a] transition-colors text-lg"
            >
              Join Now
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default MainComponent;