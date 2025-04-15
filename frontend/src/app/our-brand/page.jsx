"use client";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";
import React from "react";

function BrandPage() {
  const brandPillars = [
    {
      title: "Discover Wine Distributors",
      description: "Order before noon and get your order the next day with our premium delivery service.",
      icon: "fa-truck-fast"
    },
    {
      title: "Wine Trading & Tours",
      description: "Hundreds of curated wines selected with real passion and craftsmanship.",
      icon: "fa-wine-glass"
    },
    {
      title: "Wine for Each Occasion",
      description: "For memorable moments and quality you won't find elsewhere at home prices.",
      icon: "fa-calendar-check"
    },
    {
      title: "Recycled Packaging",
      description: "We use 100% recycled materials to ensure our environmental footprint is minimal.",
      icon: "fa-recycle"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="w-full bg-gradient-to-r from-[#d4b26a] to-black text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-block relative">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 relative z-10">
                What Makes <span className="text-[#d4b26a]">Math&Co</span> Different
              </h1>
              <div className="absolute -bottom-2 left-0 right-0 h-3 bg-amber-100/70 z-0"></div>
            </div>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mt-4">
              Where passion for wine meets exceptional craftsmanship
            </p>
            <div className="w-24 h-1 bg-[#d4b26a] mx-auto mt-6 rounded-full"></div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          {/* Brand Pillars with Icons */}
          <section className="mb-20">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {brandPillars.map((pillar, index) => (
                <div key={index} className="bg-[#f9f9f9] p-6 rounded-lg hover:shadow-lg transition-shadow text-center">
                  <div className="flex justify-center mb-4">
                    <i className={`fas ${pillar.icon} text-4xl text-[#d4b26a]`}></i>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{pillar.title}</h3>
                  <p>{pillar.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Rest of the sections remain the same */}
          <section className="mb-20">
            <h2 className="text-4xl font-crimson-text text-center mb-12">
              It Started With a Small Idea...
            </h2>
            <div className="grid md:grid-cols-2 gap-8 items-stretch">
              {/* Video Container - Left Side */}
              <div className="relative h-full min-h-[400px] w-full rounded-lg overflow-hidden shadow-md bg-black">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  poster="/images/video-poster.jpg" // Fallback image
                >
                  <source src="/images/about.mp4" type="video/mp4" />

                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Text Content - Right Side */}
              <div className="flex flex-col justify-center p-6 md:p-8 lg:p-10">
                <div className="space-y-6">
                  <p className="text-lg leading-relaxed text-gray-700">
                    Mush&Co epitomizes leadership and inclusivity, fostering unity among colleagues, companies, and co-workers.
                  </p>
                  <p className="text-lg leading-relaxed text-gray-700">
                    The "Co" signifies the essence of togetherness, derived from the Latin word "co" meaning joint or jointly. Mush&Co embraces this spirit of harmony, drawing inspiration from a rich heritage that values unity, leadership, wisdom, and the profound appreciation of life itself.
                  </p>
                  <p className="text-lg leading-relaxed text-gray-700">
                    Mush&Co is a unique wine business that specializes in bringing the perfect pairing of great wines together. Our carefully curated selection of wines are sure to delight your taste buds.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-20 bg-[#f9f9f9] p-8 sm:p-12 rounded-lg">
            <h2 className="text-3xl sm:text-4xl font-crimson-text text-center mb-8 sm:mb-12">
              Our Service Isn't Just Personal, It's Hyper-Personally Exquisite
            </h2>
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-stretch">
              {/* Text Content - Left Side */}
              <div className="flex flex-col justify-center space-y-6 p-4 sm:p-6">
                <p className="text-lg leading-relaxed text-gray-700">
                  Mush&Co has diversified its product range to accommodate all categories of the general public while still giving each wine a sophisticated quality taste and the deserved experience of a lifetime.
                </p>
                <p className="text-lg leading-relaxed text-gray-700">
                  Mush&Co goes above and beyond to provide a premium experience. We offer both premium wines and entry-level quality wines, creating not just a product but a lifestyle.
                </p>
              </div>

              {/* Image Container - Right Side */}
              <div className="relative aspect-square md:aspect-auto h-full min-h-[400px] w-full rounded-lg overflow-hidden shadow-lg">
                <img
                  src="/images/about1.jpeg"
                  alt="Mush&Co wine service"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </section>

          <section className="text-center py-12">
            <h2 className="text-4xl font-crimson-text mb-6">Savor Our Wines</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Experience the taste of nature with Mush&Co - where every bottle tells a story.
            </p>
            <button className="bg-[#d4b26a] hover:bg-[#c0a05a] text-white font-bold py-3 px-8 rounded-full transition-colors">
              Explore Our Collection
            </button>
          </section>

          {/* Get in Touch Form Section */}
          <section className="mt-20 bg-gradient-to-r from-[#d4b26a]/10 to-black/10 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-[#d4b26a]  mb-4">Get in Touch With Us</h2>
                <div className="w-24 h-1 bg-[#d4b26a] mx-auto rounded-full"></div>
                <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                  Have questions about our wines? Want to plan a special order? Reach out and we'll respond promptly.
                </p>
              </div>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b26a] focus:border-[#d4b26a]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                    <input
                      type="email"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b26a] focus:border-[#d4b26a]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b26a] focus:border-[#d4b26a]"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b26a] focus:border-[#d4b26a]">
                      <option>General Inquiry</option>
                      <option>Wholesale Orders</option>
                      <option>Private Events</option>
                      <option>Wine Recommendations</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message*</label>
                    <textarea
                      rows="4"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4b26a] focus:border-[#d4b26a]"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#d4b26a] to-black text-white py-3 px-6 rounded-lg hover:from-[#c4a25a] hover:to-gray-800 transition-all font-medium"
                  >
                    Send Message
                  </button>
                </div>
              </form>

              {/* Contact Info */}
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <i className="fas fa-phone-alt text-2xl text-[#d4b26a] mb-3"></i>
                  <h3 className="font-medium mb-1">Call Us</h3>
                  <p className="text-gray-600">+27 67 963 4795</p>
                </div>

                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <i className="fas fa-envelope text-2xl text-[#d4b26a] mb-3"></i>
                  <h3 className="font-medium mb-1">Email Us</h3>
                  <p className="text-gray-600">info@mathandco.com</p>
                </div>

                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <i className="fas fa-map-marker-alt text-2xl text-[#d4b26a] mb-3"></i>
                  <h3 className="font-medium mb-1">Visit Us</h3>
                  <p className="text-gray-600">93 Bekker Road, Midrand , Thornhill Office Park</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default BrandPage;