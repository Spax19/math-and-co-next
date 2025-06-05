"use client";
import { useState } from "react";
import Head from "next/head";
import Navbar from "../../../components/navbar";
import Footer from "../../../components/footer";


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
         { id: "regions", name: "Wine Regions", icon: "fa-map-marked-alt" },
       ],
       posts: [
         {
           id: 1,
           title: "Mastering Cabernet Sauvignon: A Beginner's Guide",
           excerpt:
             "Learn how to identify quality characteristics in Cabernet Sauvignon wines.",
           category: "guides",
           date: "2023-06-15",
           readTime: "8 min",
           image: "/images/cabernet-guide.jpg",
         },
         {
           id: 2,
           title: "Perfect Cheese Pairings for Your Red Wines",
           excerpt:
             "Elevate your wine experience with these expert-recommended cheese combinations.",
           category: "pairings",
           date: "2023-06-10",
           readTime: "6 min",
           image: "/images/wine-cheese.jpg",
         },
         {
           id: 3,
           title: "Exploring Bordeaux: A Region Guide",
           excerpt: "Discover the famous wine region and its signature blends.",
           category: "regions",
           date: "2023-06-05",
           readTime: "7 min",
           image: "/images/bordeaux.jpg",
         },
       ],
       pairingSuggestions: [
         {
           wine: "Chardonnay",
           pairing: "Buttered popcorn, roasted chicken",
           tip: "The buttery notes complement oaked Chardonnays perfectly",
         },
       ],
     },
     water: {
       gradient: "bg-gradient-to-r from-[#ddd] to-black",
       color: "#000",
       accent: "#C0C0C0",
       categories: [
         { id: "all", name: "All Articles", icon: "fa-star" },
         { id: "science", name: "Water Science", icon: "fa-flask" },
         { id: "health", name: "Hydration Health", icon: "fa-heartbeat" },
         { id: "sources", name: "Water Sources", icon: "fa-map" },
       ],
       posts: [
         {
           id: 1,
           title: "Understanding Mineral Content in Spring Water",
           excerpt: "How different minerals affect taste and health benefits.",
           category: "science",
           date: "2023-06-12",
           readTime: "7 min",
           image: "/images/mineral-water.jpg",
         },
         {
           id: 2,
           title: "The Hydration Equation: How Much Water Do You Really Need?",
           excerpt: "Science-backed recommendations for optimal hydration.",
           category: "health",
           date: "2023-06-05",
           readTime: "5 min",
           image: "/images/hydration-science.jpg",
         },
         {
           id: 3,
           title: "Alpine Springs: Nature's Filtration System",
           excerpt: "How mountain springs produce the purest water.",
           category: "sources",
           date: "2023-05-28",
           readTime: "6 min",
           image: "/images/alpine-springs.jpg",
         },
       ],
       scienceFacts: [
         {
           fact: "The ideal TDS (Total Dissolved Solids) for drinking water is between 50-150 ppm",
           source: "WHO Guidelines",
         },
       ],
     },
   };

   const currentContent = contentConfig[activeTab];

   // Filter articles based on category and search query
   const filteredArticles = currentContent.posts.filter((post) => {
     const matchesCategory =
       activeCategory === "all" || post.category === activeCategory;
     const matchesSearch =
       searchQuery === "" ||
       post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
     return matchesCategory && matchesSearch;
   });

  return (
    <div className="blog-page">
      <Head>
        <title>
          {activeTab === "wine" ? "Wine Journal" : "Water Science"} | Vine &
          Spring
        </title>
        <meta
          name="description"
          content={
            activeTab === "wine"
              ? "Expert wine guides, tasting notes and food pairing recommendations"
              : "Water science, hydration research and mineral content analysis"
          }
        />
      </Head>

      <Navbar />

      {/* Hero Section */}
      <div
        className={`blog-hero-section ${
          activeTab === "wine"
            ? "blog-hero-wine"
            : "blog-hero-water"
        }`}
      >
        <div className="blog-hero-container">
          <div className="blog-hero-title-container">
            <h1 className="blog-hero-title">
              {activeTab === "wine" ? "Wine" : "Water"}{" "}
              <span className="blog-hero-title-accent">Education</span>
            </h1>
            <div className="blog-hero-title-underline"></div>
          </div>
          <p className="blog-hero-subtitle">
            {activeTab === "wine"
              ? "Discover the world of fine wines and perfect pairings"
              : "Explore the science behind premium waters and hydration"}
          </p>
          <div className="blog-hero-divider"></div>

          {/* Tab Switch */}
          <div className="blog-tab-switch">
            <button
              onClick={() => {
                setActiveTab("wine");
                setActiveCategory("all");
                setSearchQuery("");
              }}
              className={`blog-tab-button ${
                activeTab === "wine"
                  ? "blog-tab-wine-active"
                  : "blog-tab-inactive"
              }`}
            >
              <i className="fas fa-wine-glass-alt"></i> Wine
            </button>
            <button
              onClick={() => {
                setActiveTab("water");
                setActiveCategory("all");
                setSearchQuery("");
              }}
              className={`blog-tab-button ${
                activeTab === "water"
                  ? "blog-tab-water-active"
                  : "blog-tab-inactive"
              }`}
            >
              <i className="fas fa-tint"></i> Hydrology
            </button>
          </div>

          {/* Search */}
          <div className="blog-search-container">
            <input
              type="text"
              placeholder={`Search ${activeTab} articles...`}
              className={`blog-search-input ${
                activeTab === "wine" ? "blog-search-wine" : "blog-search-water"
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="blog-search-button">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="blog-main-content">
        <div className="blog-content-grid">
          {/* Articles Section */}
          <div className="blog-articles-section">
            {/* Category Filters */}
            <div className="blog-category-filters">
              {currentContent.categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`blog-category-button ${
                    activeCategory === category.id
                      ? `blog-category-active ${
                          currentContent.gradient === "wine-hero"
                            ? "blog-hero-wine"
                            : "blog-hero-water"
                        }`
                      : "blog-category-inactive"
                  }`}
                >
                  <i className={`fas ${category.icon}`}></i>
                  {category.name}
                </button>
              ))}
            </div>

            {/* Search Results Info */}
            {(searchQuery || activeCategory !== "all") && (
              <div className="blog-search-results-info">
                Showing {filteredArticles.length}{" "}
                {filteredArticles.length === 1 ? "article" : "articles"}
                {activeCategory !== "all" &&
                  ` in "${
                    currentContent.categories.find(
                      (c) => c.id === activeCategory
                    )?.name
                  }"`}
                {searchQuery && ` matching "${searchQuery}"`}
              </div>
            )}

            {/* Articles Grid */}
            {filteredArticles.length > 0 ? (
              <div className="blog-articles-grid">
                {filteredArticles.map((post) => (
                  <article key={post.id} className="blog-article-card">
                    <img
                      src={post.image}
                      alt=""
                      className="blog-article-image"
                    />
                    <div className="blog-article-content">
                      <span
                        className="blog-article-category"
                        style={{ color: currentContent.color }}
                      >
                        {
                          currentContent.categories.find(
                            (c) => c.id === post.category
                          )?.name
                        }
                      </span>
                      <h3 className="blog-article-title">{post.title}</h3>
                      <p className="blog-article-excerpt">{post.excerpt}</p>
                      <div className="blog-article-meta">
                        <span className="blog-article-date">
                          {post.date} • {post.readTime}
                        </span>
                        <button
                          className="blog-read-more-button"
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
              <div className="blog-no-articles">
                <i
                  className={`fas ${
                    activeTab === "wine" ? "fa-wine-glass-alt" : "fa-tint"
                  } blog-no-articles-icon`}
                ></i>
                <h3 className="blog-no-articles-title">No articles found</h3>
                <p className="blog-no-articles-message">
                  {searchQuery
                    ? `No ${activeTab} articles match your search for "${searchQuery}"`
                    : `No ${activeTab} articles found in this category`}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                  className="blog-reset-button"
                  style={{ backgroundColor: currentContent.color }}
                >
                  Show All Articles
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="blog-sidebar">
            {/* Wine Pairings or Water Science */}
            <div
              className={`blog-sidebar-card ${
                currentContent.gradient === "wine-hero"
                  ? "blog-hero-wine"
                  : "blog-hero-water"
              }`}
            >
              <h3 className="blog-sidebar-card-title">
                <i
                  className={`fas ${
                    activeTab === "wine" ? "fa-utensils" : "fa-flask"
                  }`}
                ></i>
                {activeTab === "wine" ? "Pairing Suggestions" : "Science Facts"}
              </h3>

              {activeTab === "wine" ? (
                <ul className="blog-sidebar-list">
                  {currentContent.pairingSuggestions.map((item, i) => (
                    <li key={i} className="blog-sidebar-list-item">
                      <h4
                        className="blog-sidebar-item-title"
                        style={{ color: currentContent.accent }}
                      >
                        {item.wine}
                      </h4>
                      <p>{item.pairing}</p>
                      <p className="blog-sidebar-item-tip">{item.tip}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="blog-sidebar-list">
                  {currentContent.scienceFacts.map((fact, i) => (
                    <li key={i} className="blog-sidebar-list-item">
                      <p>{fact.fact}</p>
                      <p className="blog-sidebar-item-tip">— {fact.source}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Newsletter */}
            <div className="blog-newsletter-card">
              <h3 className="blog-newsletter-title">Stay Updated</h3>
              <p className="blog-newsletter-description">
                Get the latest{" "}
                {activeTab === "wine" ? "wine guides" : "water science"} in your
                inbox
              </p>
              <form className="blog-newsletter-form">
                <input
                  type="email"
                  placeholder="Your email"
                  className="blog-newsletter-input"
                  required
                />
                <button
                  type="submit"
                  className="blog-newsletter-button"
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
    </div>
  );
}
