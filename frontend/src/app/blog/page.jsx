"use client";
import { useState } from "react";
import Head from "next/head";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

export default function BlogPage() {
  const [activeTab, setActiveTab] = useState("wine");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Content configuration
  const contentConfig = {
    wine: {
      gradient: "bg-gradient-to-r from-[#d4b26a] to-black",
      color: "#d4b26a",
      accent: "#D4B26A",
      categories: [
        { id: "all", name: "All Articles", icon: "fa-star" },
        { id: "guides", name: "Wine Guides", icon: "fa-wine-bottle" },
        { id: "pairings", name: "Food Pairings", icon: "fa-utensils" },
        { id: "regions", name: "Wine Regions", icon: "fa-map-marked-alt" }
      ],
      posts: [
        {
          id: 1,
          title: "Mastering Cabernet Sauvignon: A Beginner's Guide",
          excerpt: "Learn how to identify quality characteristics in Cabernet Sauvignon wines.",
          category: "guides",
          date: "2023-06-15",
          readTime: "8 min",
          image: "/images/cabernet-guide.jpg"
        },
        {
          id: 2,
          title: "Perfect Cheese Pairings for Your Red Wines",
          excerpt: "Elevate your wine experience with these expert-recommended cheese combinations.",
          category: "pairings",
          date: "2023-06-10",
          readTime: "6 min",
          image: "/images/wine-cheese.jpg"
        },
        {
          id: 3,
          title: "Exploring Bordeaux: A Region Guide",
          excerpt: "Discover the famous wine region and its signature blends.",
          category: "regions",
          date: "2023-06-05",
          readTime: "7 min",
          image: "/images/bordeaux.jpg"
        }
      ],
      pairingSuggestions: [
        {
          wine: "Chardonnay",
          pairing: "Buttered popcorn, roasted chicken",
          tip: "The buttery notes complement oaked Chardonnays perfectly"
        }
      ]
    },
    water: {
      gradient: "bg-gradient-to-r from-[#ddd] to-black",
      color: "#000",
      accent: "#C0C0C0",
      categories: [
        { id: "all", name: "All Articles", icon: "fa-star" },
        { id: "science", name: "Water Science", icon: "fa-flask" },
        { id: "health", name: "Hydration Health", icon: "fa-heartbeat" },
        { id: "sources", name: "Water Sources", icon: "fa-map" }
      ],
      posts: [
        {
          id: 1,
          title: "Understanding Mineral Content in Spring Water",
          excerpt: "How different minerals affect taste and health benefits.",
          category: "science",
          date: "2023-06-12",
          readTime: "7 min",
          image: "/images/mineral-water.jpg"
        },
        {
          id: 2,
          title: "The Hydration Equation: How Much Water Do You Really Need?",
          excerpt: "Science-backed recommendations for optimal hydration.",
          category: "health",
          date: "2023-06-05",
          readTime: "5 min",
          image: "/images/hydration-science.jpg"
        },
        {
          id: 3,
          title: "Alpine Springs: Nature's Filtration System",
          excerpt: "How mountain springs produce the purest water.",
          category: "sources",
          date: "2023-05-28",
          readTime: "6 min",
          image: "/images/alpine-springs.jpg"
        }
      ],
      scienceFacts: [
        {
          fact: "The ideal TDS (Total Dissolved Solids) for drinking water is between 50-150 ppm",
          source: "WHO Guidelines"
        }
      ]
    }
  };

  const currentContent = contentConfig[activeTab];

  // Filter articles based on category and search query
  const filteredArticles = currentContent.posts.filter(post => {
    const matchesCategory = activeCategory === "all" || post.category === activeCategory;
    const matchesSearch = searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Head>
        <title>{activeTab === "wine" ? "Wine Journal" : "Water Science"} | Vine & Spring</title>
        <meta name="description" content={
          activeTab === "wine"
            ? "Expert wine guides, tasting notes and food pairing recommendations"
            : "Water science, hydration research and mineral content analysis"
        } />
      </Head>

      <Navbar />

      {/* Hero Section with Tabs */}

      {/* Updated Hero Section to Match Shop Page */}
      <div className={`w-full bg-gradient-to-r ${activeTab === "wine" ? "from-[#d4b26a] to-black" : "from-[#ddd] to-black"} text-white py-16 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block relative">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 relative z-10">
              {activeTab === "wine" ? "Wine" : "Water"} <span className="text-[#d4b26a]">Education</span>
            </h1>
            <div className="absolute -bottom-2 left-0 right-0 h-3 bg-amber-100/70 z-0"></div>
          </div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mt-4">
            {activeTab === "wine"
              ? "Discover the world of fine wines and perfect pairings"
              : "Explore the science behind premium waters and hydration"}
          </p>
          <div className="w-24 h-1 bg-[#d4b26a] mx-auto mt-6 rounded-full"></div>

          {/* Tab Switch - Moved Below the Title */}
          <div className="inline-flex rounded-full overflow-hidden bg-white/20 backdrop-blur-sm mt-8">
            <button
              onClick={() => {
                setActiveTab("wine");
                setActiveCategory("all");
                setSearchQuery("");
              }}
              className={`px-6 py-2 flex items-center transition-colors ${activeTab === "wine"
                  ? `${contentConfig.wine.gradient} text-[#D4B26A]`
                  : "text-white hover:bg-white/10"
                }`}
            >
              <i className="fas fa-wine-glass-alt mr-2"></i> Wine
            </button>
            <button
              onClick={() => {
                setActiveTab("water");
                setActiveCategory("all");
                setSearchQuery("");
              }}
              className={`px-6 py-2 flex items-center transition-colors ${activeTab === "water"
                  ? `${contentConfig.water.gradient} text-[#C0C0C0]`
                  : "text-white hover:bg-white/10"
                }`}
            >
              <i className="fas fa-tint mr-2"></i> Hydrology
            </button>
          </div>

          {/* Search - Moved Below the Tabs */}
          <div className="max-w-md mx-auto relative mt-6">
            <input
              type="text"
              placeholder={`Search ${activeTab} articles...`}
              className={`w-full py-3 px-4 rounded-full border ${activeTab === "wine"
                  ? "border-black text-black focus:ring-black"
                  : "border-white text-white focus:ring-white"
                } bg-transparent focus:outline-none focus:ring-2 focus:border-transparent`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${activeTab === "water" ? "text-white" : "text-gray-500"
                }`}
            >
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Articles Section */}
          <div className="lg:col-span-2">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              {currentContent.categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full flex items-center text-sm transition-colors ${activeCategory === category.id
                      ? `${currentContent.gradient} text-white`
                      : "bg-gray-100 hover:bg-gray-200"
                    }`}
                >
                  <i className={`fas ${category.icon} mr-2`}></i>
                  {category.name}
                </button>
              ))}
            </div>

            {/* Search Results Info */}
            {(searchQuery || activeCategory !== "all") && (
              <div className="mb-6 text-gray-600">
                Showing {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
                {activeCategory !== "all" && ` in "${currentContent.categories.find(c => c.id === activeCategory)?.name}"`}
                {searchQuery && ` matching "${searchQuery}"`}
              </div>
            )}

            {/* Articles Grid */}
            {filteredArticles.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredArticles.map(post => (
                  <article
                    key={post.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={post.image}
                      alt=""
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <span
                        className="text-sm font-medium"
                        style={{ color: currentContent.color }}
                      >
                        {currentContent.categories.find(c => c.id === post.category)?.name}
                      </span>
                      <h3 className="text-xl font-bold my-2">{post.title}</h3>
                      <p className="text-gray-600 mb-4">{post.excerpt}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {post.date} • {post.readTime}
                        </span>
                        <button
                          className="font-medium hover:underline"
                          style={{ color: currentContent.color }}
                        >
                          Read More →
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <i className={`fas ${activeTab === "wine" ? "fa-wine-glass-alt" : "fa-tint"
                  } text-4xl text-gray-300 mb-4`}></i>
                <h3 className="text-xl font-bold mb-2">No articles found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery
                    ? `No ${activeTab} articles match your search for "${searchQuery}"`
                    : `No ${activeTab} articles found in this category`}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                  className="px-4 py-2 rounded-lg font-medium text-white"
                  style={{ backgroundColor: currentContent.color }}
                >
                  Show All Articles
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Wine Pairings or Water Science */}
            <div className={`rounded-lg p-6 text-white ${currentContent.gradient}`}>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <i className={`fas ${activeTab === "wine" ? "fa-utensils" : "fa-flask"
                  } mr-2`}></i>
                {activeTab === "wine" ? "Pairing Suggestions" : "Science Facts"}
              </h3>

              {activeTab === "wine" ? (
                <ul className="space-y-4">
                  {currentContent.pairingSuggestions.map((item, i) => (
                    <li
                      key={i}
                      className="border-b border-white/20 pb-4 last:border-0 last:pb-0"
                    >
                      <h4
                        className="font-bold"
                        style={{ color: currentContent.accent }}
                      >
                        {item.wine}
                      </h4>
                      <p className="my-1">{item.pairing}</p>
                      <p className="text-sm opacity-80">{item.tip}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-4">
                  {currentContent.scienceFacts.map((fact, i) => (
                    <li
                      key={i}
                      className="border-b border-white/20 pb-4 last:border-0 last:pb-0 "
                    >
                      <p className="mb-1">{fact.fact}</p>
                      <p className="text-sm opacity-80">— {fact.source}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Newsletter */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
              <p className="text-gray-600 mb-4">
                Get the latest {activeTab === "wine" ? "wine guides" : "water science"} in your inbox
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg font-medium text-white"
                  style={{ backgroundColor: currentContent.color }}
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer
        wineColor={contentConfig.wine.color}
        waterColor={contentConfig.water.color}
        accentColor={currentContent.accent}
      />
    </>
  );
}