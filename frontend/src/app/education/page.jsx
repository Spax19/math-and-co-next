"use client";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";
import React, { useState } from "react";

const EducationPage = () => {
  const [activeTab, setActiveTab] = useState("wine");
  const [activeItem, setActiveItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Content configuration
  const contentConfig = {
    wine: {
      gradient: "bg-gradient-to-r from-[#d4b26a] to-black",
      color: "#d4b26a",
      accent: "#D4B26A",
      filters: [
        { id: "all", name: "All Wines" },
        { id: "white", name: "White Wines" },
        { id: "red", name: "Red Wines" },
        { id: "sparkling", name: "Sparkling" },
        { id: "rose", name: "Rosé" }
      ],
      items: [
        {
          id: 1,
          name: "Chenin Blanc",
          type: "white",
          region: "Loire Valley, France",
          description: "Versatile white with vibrant acidity and honeyed notes.",
          tastingNotes: "Apple, quince, honey, floral",
          pairing: "Goat cheese, seafood, Thai cuisine",
          serving: "45-50°F (7-10°C)",
          image: "/images/chenin-blanc.png",
          science: "Acidity ranges from 6-9 g/L, with residual sugar varying from bone dry to lusciously sweet",
          glassware: "Medium-sized tulip glass to concentrate aromas"
        },
        {
          id: 2,
          name: "MCC Brut Rosé",
          type: "sparkling",
          region: "Western Cape, South Africa",
          description: "Elegant sparkling with delicate red fruit character.",
          tastingNotes: "Strawberry, raspberry, brioche, citrus",
          pairing: "Oysters, sushi, summer berries",
          serving: "40-45°F (4-7°C)",
          image: "/images/mcc-brut-rose.png",
          science: "Secondary fermentation creates 5-6 atmospheres of pressure with fine, persistent bubbles",
          glassware: "Flute or tulip glass to preserve bubbles"
        },
        {
          id: 3,
          name: "Cabernet Sauvignon",
          type: "red",
          region: "Bordeaux, France",
          description: "Full-bodied red with bold tannins and dark fruit flavors.",
          tastingNotes: "Blackcurrant, cedar, tobacco, graphite",
          pairing: "Steak, lamb, aged cheeses",
          serving: "60-65°F (15-18°C)",
          image: "/images/cabernet.png",
          science: "High tannin content (1.5-3.5 g/L) comes from skins, seeds, and oak aging",
          glassware: "Large Bordeaux glass to aerate the wine"
        },
        {
          id: 4,
          name: "Rosé",
          type: "rose",
          region: "Provence, France",
          description: "Pale, dry rosé with refreshing minerality.",
          tastingNotes: "Watermelon, peach, citrus, herbs",
          pairing: "Salads, grilled vegetables, light pasta",
          serving: "50-55°F (10-13°C)",
          image: "/images/rose.png",
          science: "Short skin contact (6-48 hours) creates the pale pink hue",
          glassware: "Standard white wine glass to enhance aromatics"
        }
      ]
    },
    water: {
      gradient: "bg-gradient-to-r from-[#ddd] to-black",
      color: "#000",
      accent: "#C0C0C0",
      filters: [
        { id: "all", name: "All Waters" },
        { id: "spring", name: "Spring Water" },
        { id: "mineral", name: "Mineral Water" },
        { id: "sparkling", name: "Sparkling" },
        { id: "artesian", name: "Artesian" }
      ],
      items: [
        {
          id: 1,
          name: "Alpine Spring",
          type: "spring",
          region: "Swiss Alps",
          description: "Naturally filtered through granite and quartz.",
          tastingNotes: "Crisp, clean, with subtle mineral freshness",
          pairing: "Light seafood, fresh salads, delicate desserts",
          serving: "50-55°F (10-13°C)",
          image: "/images/alpine-spring.png",
          science: "TDS of 50-100 ppm with natural pH of 7.2-7.8",
          glassware: "Tall tumbler to preserve cool temperature"
        },
        {
          id: 2,
          name: "Volcanic Mineral",
          type: "mineral",
          region: "Iceland",
          description: "Naturally carbonated with high mineral content.",
          tastingNotes: "Effervescent, flinty, with chalky texture",
          pairing: "Rich meats, spicy cuisine, chocolate",
          serving: "45-50°F (7-10°C)",
          image: "/images/volcanic-mineral.png",
          science: "Contains 1500+ ppm minerals including calcium, magnesium, and silica",
          glassware: "Wide-mouth glass to release carbonation"
        },
        {
          id: 3,
          name: "Artesian Still",
          type: "artesian",
          region: "Fiji Islands",
          description: "Naturally filtered through volcanic rock.",
          tastingNotes: "Silky texture, neutral pH, ultra-pure",
          pairing: "Sushi, raw vegetables, light cheeses",
          serving: "Room temperature",
          image: "/images/artesian-still.png",
          science: "Protected aquifer creates water with 0.5 ppm TDS and neutral 7.0 pH",
          glassware: "Crystal goblet to appreciate clarity"
        },
        {
          id: 4,
          name: "Italian Sparkling",
          type: "sparkling",
          region: "Tuscany, Italy",
          description: "Naturally effervescent with balanced minerals.",
          tastingNotes: "Bright acidity, fine bubbles, limestone finish",
          pairing: "Fried foods, citrus desserts, aperitivo",
          serving: "40-45°F (4-7°C)",
          image: "/images/italian-sparkling.png",
          science: "Natural CO2 content of 5-7 g/L with calcium-rich mineralization",
          glassware: "Champagne flute to showcase bubble trails"
        }
      ]
    }
  };

  const currentContent = contentConfig[activeTab];

  // Filter items based on category and search query
  const filteredItems = currentContent.items.filter(item => {
    const matchesFilter = activeFilter === "all" || item.type === activeFilter;
    const matchesSearch = searchQuery === "" || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.region.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <Navbar />
      
      {/* Hero Section with Tabs */}
      <div className={`w-full ${currentContent.gradient} text-white py-16 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block relative">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 relative z-10">
              {activeTab === "wine" ? "Wine" : "Water"} <span className="text-[#d4b26a]">Education</span>
            </h1>
            <div className="absolute -bottom-2 left-0 right-0 h-3 bg-amber-100/70 z-0"></div>
          </div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mt-4">
            {activeTab === "wine" 
              ? "Master the art of wine selection, pairing, and serving" 
              : "Understand water sources, mineral content, and serving techniques"}
          </p>
          <div className="w-24 h-1 bg-[#d4b26a] mx-auto mt-6 rounded-full"></div>
          
          {/* Tab Switch */}
          <div className="inline-flex rounded-full overflow-hidden bg-white/20 backdrop-blur-sm mt-8">
            <button
              onClick={() => {
                setActiveTab("wine");
                setActiveFilter("all");
                setSearchQuery("");
              }}
              className={`px-6 py-2 flex items-center transition-colors ${
                activeTab === "wine" 
                  ? `${contentConfig.wine.gradient} text-[#D4B26A]` 
                  : "text-white hover:bg-white/10"
              }`}
            >
              <i className="fas fa-wine-glass-alt mr-2"></i> Wine
            </button>
            <button
              onClick={() => {
                setActiveTab("water");
                setActiveFilter("all");
                setSearchQuery("");
              }}
              className={`px-6 py-2 flex items-center transition-colors ${
                activeTab === "water" 
                  ? `${contentConfig.water.gradient} text-[#C0C0C0]` 
                  : "text-white hover:bg-white/10"
              }`}
            >
              <i className="fas fa-tint mr-2"></i> Hydrology
            </button>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto relative mt-6">
            <input
              type="text"
              placeholder={`Search ${activeTab} types...`}
              className={`w-full py-3 px-4 rounded-full border ${
                activeTab === "wine" 
                  ? "border-black text-black focus:ring-black" 
                  : "border-white text-white focus:ring-white"
              } bg-transparent focus:outline-none focus:ring-2 focus:border-transparent`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                activeTab === "water" ? "text-white" : "text-gray-500"
              }`}
            >
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            {currentContent.filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-full flex items-center text-sm transition-all ${
                  activeFilter === filter.id 
                    ? `${currentContent.gradient} text-white shadow-lg` 
                    : "bg-white hover:bg-gray-100 shadow-sm"
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>

          {/* Search Results Info */}
          {(searchQuery || activeFilter !== "all") && (
            <div className="mb-8 text-center text-gray-600">
              Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
              {activeFilter !== "all" && ` in "${currentContent.filters.find(f => f.id === activeFilter)?.name}"`}
              {searchQuery && ` matching "${searchQuery}"`}
            </div>
          )}

          {/* Items Grid */}
          {filteredItems.length > 0 ? (
            <div className="space-y-16">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}
                  onMouseEnter={() => setActiveItem(item.id)}
                  onMouseLeave={() => setActiveItem(null)}
                >
                  {/* Image with enhanced animations */}
                  <div className={`w-full md:w-1/2 flex justify-center ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                    <div className={`relative w-full h-90 rounded-xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${
                      activeItem === item.id ? 
                      'shadow-xl scale-[1.02]' : 
                      'shadow-lg scale-100'
                    } hover:shadow-2xl hover:shadow-amber-900/20 group`}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain transition-all duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:scale-105"
                      />
                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      {/* Floating animation */}
                      <div className="absolute inset-0 transition-transform duration-1000 ease-in-out group-hover:-translate-y-1">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                          <div className="transform transition-transform duration-500 group-hover:translate-y-0 translate-y-2">
                            <span className={`inline-block px-6 py-2 text-sm font-semibold text-white rounded-full mb-2`}
                                  style={{ backgroundColor: currentContent.color }}>
                              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                            </span>
                            <h2 className="text-2xl font-bold text-white transform transition-transform duration-300 group-hover:translate-x-0 translate-x-1">
                              {item.name}
                            </h2>
                            <p className="text-white/90 transform transition-transform duration-400 group-hover:translate-x-0 translate-x-1">
                              {item.region}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className={`w-full md:w-1/2 transition-all duration-500 ease-out ${
                    activeItem === item.id ?
                    'opacity-100 translate-y-0' :
                    'opacity-0 md:opacity-100 md:translate-y-0 translate-y-4'
                  }`}>
                    <div className={`bg-white p-6 rounded-xl shadow-sm ${index % 2 === 0 ? 'md:ml-8' : 'md:mr-8'}`}>
                      <h3 className="text-3xl font-bold text-gray-900 mb-3">{item.name}</h3>
                      <p className="text-gray-600 mb-6 text-lg">{item.description}</p>

                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" style={{ color: currentContent.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            {activeTab === "wine" ? "Tasting Notes" : "Profile"}
                          </h4>
                          <p className="text-gray-600">{item.tastingNotes}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" style={{ color: currentContent.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Pairs With
                          </h4>
                          <p className="text-gray-600">{item.pairing}</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" style={{ color: currentContent.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          <div>
                            <h4 className="font-semibold text-gray-800">Serving Recommendation</h4>
                            <p className="text-gray-600">{item.serving}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" style={{ color: currentContent.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                          <div>
                            <h4 className="font-semibold text-gray-800">{activeTab === "wine" ? "Glassware" : "Vessel"}</h4>
                            <p className="text-gray-600">{item.glassware}</p>
                          </div>
                        </div>
                      </div>

                      {/* Science/Technical Info */}
                      <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: `${currentContent.color}20`, borderLeft: `4px solid ${currentContent.color}` }}>
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" style={{ color: currentContent.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                          </svg>
                          {activeTab === "wine" ? "Wine Science" : "Water Chemistry"}
                        </h4>
                        <p className="text-gray-700">{item.science}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <i className={`fas ${
                activeTab === "wine" ? "fa-wine-glass-alt" : "fa-tint"
              } text-4xl text-gray-300 mb-4`}></i>
              <h3 className="text-xl font-bold mb-2">No items found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery
                  ? `No ${activeTab} items match your search for "${searchQuery}"`
                  : `No ${activeTab} items found in this category`}
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilter("all");
                }}
                className="px-4 py-2 rounded-lg font-medium text-white"
                style={{ backgroundColor: currentContent.color }}
              >
                Show All Items
              </button>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default EducationPage;