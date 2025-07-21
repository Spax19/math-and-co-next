"use client";
import Footer from "../../../components/footer";
import Navbar from "../../../components/navbar";
import React, { useState, useEffect } from "react";
import "../../globals.css";

// ==================== COMPONENTS ====================

const PageHeader = ({ gradient, color, title, subtitle, bgImage }) => (
  <header className={`bevs-header relative overflow-hidden ${gradient}`}>
    {/* Blurred Image Background */}
    <div
      className="absolute inset-0 z-0"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "blur(8px) brightness(0.7)",
        maskImage:
          "linear-gradient(to bottom, rgba(0,0,0,0.8) 30%, transparent 100%)",
      }}
    />

    {/* Gradient Overlay */}
    <div
      className="absolute inset-0 z-1"
      style={{
        background: `conic-gradient(from -20deg at 25% 35%, rgba(26,18,6,0.9) 0deg, rgba(92,58,29,0.8) 90deg, rgba(74,46,16,0.7) 180deg)`,
        mixBlendMode: "multiply",
      }}
    />

    {/* Content */}
    <div className="bevs-container relative z-10">
      <h1 className="bevs-header__title" style={{ color }}>
        {title}
      </h1>
      <p className="bevs-header__subtitle">{subtitle}</p>
      <div
        className="bevs-header__divider"
        style={{ backgroundColor: color }}
      ></div>
    </div>
  </header>
);

const AboutSection = ({ color, title, content, image, reverse = false }) => (
  <section className="bevs-section bevs-section--white">
    <div className="bevs-container">
      <div className={`bevs-about ${reverse ? "bevs-about--reverse" : ""}`}>
        <div className="bevs-about__image">
          <img
            src={image}
            alt={title}
            className="bevs-about__img"
            loading="lazy"
          />
        </div>
        <div className="bevs-about__text">
          <h2 className="bevs-about__heading" style={{ color }}>
            {title}
          </h2>
          {content.map((paragraph, index) => (
            <p key={index} className="bevs-about__paragraph">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const ProductsSection = ({
  color,
  title,
  items,
  filters,
  activeFilter,
  setActiveFilter,
  searchQuery,
  setSearchQuery,
}) => (
  <section className="bevs-section bevs-section--gray">
    <div className="bevs-container">
      <h2 className="bevs-section__title" style={{ color }}>
        {title}
      </h2>

      <div className="bevs-filters">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`bevs-filter ${
              activeFilter === filter.id ? "bevs-filter--active" : ""
            }`}
            style={{ backgroundColor: activeFilter === filter.id ? color : "" }}
          >
            {filter.name}
          </button>
        ))}
      </div>

      {/* <div className="bevs-search">
        <input
          type="text"
          placeholder={`Search ${title.toLowerCase()}...`}
          className="bevs-search__input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="bevs-search__button">
          <i className="fas fa-search"></i>
        </button>
      </div> */}

      <div className="bevs-products">
        {items.map((item) => (
          <article key={item.id} className="bevs-product">
            <div className="bevs-product__content">
              <div className="bevs-product__image">
                <img
                  src={item.image}
                  alt={item.name}
                  className="bevs-product__img"
                  loading="lazy"
                />
              </div>
              <div className="bevs-product__details">
                <div className="bevs-product__header">
                  <h3 className="bevs-product__name">{item.name}</h3>
                  <span
                    className="bevs-product__type"
                    style={{ backgroundColor: color }}
                  >
                    {item.type}
                  </span>
                </div>
                <p className="bevs-product__description">{item.description}</p>
                <div className="bevs-product__price" style={{ color }}>
                  {item.price}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

const DeliverySection = ({ color, title, content, image }) => (
  <section className="bevs-section bevs-section--white">
    <div className="bevs-container">
      <div className="bevs-delivery">
        <div className="bevs-delivery__text">
          <h2 className="bevs-delivery__title" style={{ color }}>
            {title}
          </h2>
          <ul className="bevs-delivery__list">
            {content.map((item, index) => (
              <li key={index} className="bevs-delivery__item">
                <svg className="bevs-delivery__icon" style={{ color }}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="bevs-delivery__text-content">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bevs-delivery__image">
          <img
            src={image}
            alt={title}
            className="bevs-delivery__img"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </section>
);

// ==================== PAGE COMPONENTS ====================

const contentConfig = {
  hydrology: {
    gradient:
      "bg-[conic-gradient(at_20%_10%,_#000000_0%,_#1a1206_40%,_#2a220f_70%,_#d4b26a_100%)]",
    color: "#000",
    textColor: "#C0C0C0",
    filters: [
      { id: "all", name: "All Products" },
      { id: "still", name: "Still Water" },
      { id: "sparkling", name: "Sparkling Water" },
    ],
    welcome: {
      title: "Hydrology Premium Waters",
      subtitle: "Nature's purity in every drop",
      bgImage: "/images/hydrology-glass.jpg",
    },
    about: {
      title: "Our Water Philosophy",
      content: [
        "Founded in 2010, Hydrology has dedicated itself to preserving water in its most natural state. Our waters are sourced from protected aquifers and glaciers, untouched by human pollution.",
        "We believe water should be consumed as nature intended - with its original mineral composition intact. Our proprietary bottling process ensures every bottle maintains the water's natural properties.",
        "Hydrology is committed to sustainable sourcing and carbon-neutral operations. For every bottle sold, we protect 10 square feet of watershed land.",
      ],
      image: "/images/hydrology-glass.jpg",
    },
    products: {
      title: "Our Water Collection",
      items: [
        {
          id: 1,
          name: "Hydrology Still Water",
          type: "still",
          description: "Ultra-pure water filtered through ancient glaciers",
          price: "R8.99",
          image: "/images/hydrology.jpeg",
        },
        {
          id: 2,
          name: "Hydrology Sparkling Water",
          type: "sparkling",
          description: "Naturally carbonated with volcanic mineral infusion",
          price: "R9.99",
          image: "/images/hydrology.jpeg",
        },
      ],
    },
    delivery: {
      title: "Sustainable Delivery",
      content: [
        "We deliver nationwide in eco-friendly packaging made from 100% recycled materials",
        "Standard delivery: 3-5 business days ($5.99)",
        "Express delivery: 1-2 business days ($12.99)",
      ],
      image: "/images/delivery.jpg",
    },
  },
  sphere: {
    gradient:
      "bg-[conic-gradient(from_-20deg_at_25%_35%,#1a1206_0deg,#5c3a1d_90deg,#4a2e10_180deg,#3a240b_270deg,#8a6d3b_360deg)]",
    color: "#000",
    textColor: "#000",
    filters: [
      { id: "all", name: "All Flavors" },
      { id: "brut", name: "Brut" },
      { id: "brut", name: "Brut" },
    ],

    welcome: {
      title: "Sphere Sparkling Wine",
      subtitle: "Innovative hydration reimagined",
      bgImage: "/images/sphere-glasses.jpg",
    },
    about: {
      title: "The Sphere Difference",
      content: [
        "Launched in 2018, Sphere was born from a desire to revolutionize infused beverages. Our proprietary infusion process extracts maximum flavor and nutrients without artificial additives.",
        "Each Sphere product is crafted by our team of flavor scientists and nutritionists to deliver perfect balance - never too sweet, always refreshing.",
        "We partner with organic farms worldwide to source the freshest ingredients at peak seasonality.",
      ],
      image: "/images/sphere-glasses.jpg",
    },
    products: {
      title: "Our Infused Collection",
      items: [
        {
          id: 1,
          name: "Sphere Brut (750ml)",
          type: "brut",
          description: "Zesty blend of organic citrus fruits",
          price: "R425.99",
          image: "/images/sphere-750.jpeg",
        },
        {
          id: 2,
          name: "Sphere Brut (330ml)",
          type: "brut",
          description: "Antioxidant-rich berry infusion",
          price: "R35.49",
          image: "/images/sphere-330.jpeg",
        },
      ],
    },
    delivery: {
      title: "Flexible Delivery",
      content: [
        "Nationwide shipping in 100% compostable packaging",
        "Standard delivery: 2-4 business days ($4.99)",
        "Express delivery: 1 business day ($9.99)",
      ],
      image: "/images/delivery.jpg",
    },
  },
  pentagon: {
    gradient:
      "bg-[conic-gradient(at_top_right,_#f8f2e8_0%,_#f8f2e8_10%,_#1e0e03_30%,_#5c3a1d_60%,_#d4b26a_90%)]",
    color: "#000",
    textColor: "#000",
    filters: [
      { id: "all", name: "All Wines" },
      { id: "red", name: "Red Wines" },
      { id: "white", name: "White Wines" },
    ],
    welcome: {
      title: "Pentagon Fine Wines",
      subtitle: "The pinnacle of winemaking artistry",
      bgImage: "/images/pentagon.jpg",
    },
    about: {
      title: "Our Winemaking Heritage",
      content: [
        "Established in 1995, Pentagon has built a reputation for uncompromising quality. Our winemakers combine old-world techniques with cutting-edge technology.",
        "Each vineyard partner is carefully selected for unique terroir and sustainable practices. We produce small lots that express the pure character of each site.",
        "Pentagon wines are aged to perfection in our temperature-controlled cellars before release.",
      ],
      image: "/images/pentagon-about.jpg",
    },
    products: {
      title: "Our Wine Selection",
      items: [
        {
          id: 1,
          name: "Pentagon Classic Red",
          type: "red",
          description: "Small-batch crafted with extraordinary care",
          price: "R489.99",
          image: "/images/pentagon.jpeg",
        },
        {
          id: 2,
          name: "Pentagon Classic White",
          type: "white",
          description: "Our flagship blend representing perfection",
          price: "R129.99",
          image: "/images/pentagon-white.jpeg",
        },
      ],
    },
    delivery: {
      title: "Premium Delivery",
      content: [
        "Temperature-controlled shipping nationwide",
        "Standard delivery: 5-7 business days ($9.99)",
        "Express delivery: 2-3 business days ($19.99)",
      ],
      image: "/images/delivery.jpg",
    },
  },
};

const HydrologyPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const content = contentConfig.hydrology;

  const filteredItems = content.products.items.filter((item) => {
    const matchesFilter = activeFilter === "all" || item.type === activeFilter;
    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      {/* <PageHeader
        gradient={content.gradient}
        color={content.color}
        title={content.welcome.title}
        subtitle={content.welcome.subtitle}
      /> */}

      <AboutSection
        color={content.color}
        title={content.about.title}
        content={content.about.content}
        image={content.about.image}
      />

      <ProductsSection
        color={content.color}
        title={content.products.title}
        items={filteredItems}
        filters={content.filters}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <DeliverySection
        color={content.color}
        title={content.delivery.title}
        content={content.delivery.content}
        image={content.delivery.image}
      />
    </>
  );
};

const SpherePage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const content = contentConfig.sphere;

  const filteredItems = content.products.items.filter((item) => {
    const matchesFilter = activeFilter === "all" || item.type === activeFilter;
    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      {/* <PageHeader
        gradient={content.gradient}
        color={content.color}
        title={content.welcome.title}
        subtitle={content.welcome.subtitle}
        bgImage={content.welcome.bgImage}
      /> */}

      <AboutSection
        color={content.color}
        title={content.about.title}
        content={content.about.content}
        image={content.about.image}
        reverse={true}
      />

      <ProductsSection
        color={content.color}
        title={content.products.title}
        items={filteredItems}
        filters={content.filters}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <DeliverySection
        color={content.color}
        title={content.delivery.title}
        content={content.delivery.content}
        image={content.delivery.image}
      />
    </>
  );
};

const PentagonPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const content = contentConfig.pentagon;

  const filteredItems = content.products.items.filter((item) => {
    const matchesFilter = activeFilter === "all" || item.type === activeFilter;
    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      {/* <PageHeader
        gradient={content.gradient}
        color={content.color}
        title={content.welcome.title}
        subtitle={content.welcome.subtitle}
      /> */}

      <AboutSection
        color={content.color}
        title={content.about.title}
        content={content.about.content}
        image={content.about.image}
      />

      <ProductsSection
        color={content.color}
        title={content.products.title}
        items={filteredItems}
        filters={content.filters}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <DeliverySection
        color={content.color}
        title={content.delivery.title}
        content={content.delivery.content}
        image={content.delivery.image}
      />
    </>
  );
};

// ==================== MAIN COMPONENT ====================

const BeveragesPage = () => {
  const [activeTab, setActiveTab] = useState("hydrology");
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  // Preload images in your main component
  useEffect(() => {
    [
      contentConfig.hydrology.welcome.bgImage,
      contentConfig.sphere.welcome.bgImage,
      contentConfig.pentagon.welcome.bgImage,
    ].forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  return (
    <>
      <Navbar />
      <div className="bevs-root">
        {/* Hero Section with Tabs */}
        <div
          className={`w-full relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 ${contentConfig[activeTab].gradient}`}
        >
          {/* Dynamic Background Image */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${contentConfig[activeTab].welcome.bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.4,
              filter: "blur(2px) brightness(1.1)",
            }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 z-1 bg-black/10" />

          {/* Content Container - Responsive Alignment */}
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="lg:flex lg:justify-center">
              {" "}
              {/* Right-align on lg screens */}
              <div className="text-center lg:text-center ">
                {" "}
                {/* Half width on desktop, centered on mobile */}
                {/* Title with underline effect */}
                <div className="inline-block relative">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 relative z-10 text-white">
                    {contentConfig[activeTab].welcome.title}
                  </h1>
                  <div className="absolute -bottom-2 left-0 right-0 h-3 bg-white/30 z-0"></div>
                </div>
                {/* Subtitle */}
                <p className="text-lg sm:text-xl text-gray-200 mx-auto lg:mx-0 mt-4 max-w-2xl">
                  {contentConfig[activeTab].welcome.subtitle}
                </p>
                {/* Tab Switch - Responsive */}
                <div className="inline-flex rounded-full overflow-hidden bg-white/20 backdrop-blur-sm mt-8 flex-wrap justify-center lg:justify-end">
                  <button
                    onClick={() => {
                      setActiveTab("pentagon");
                      setActiveFilter("all");
                      setSearchQuery("");
                    }}
                    className={`px-4 sm:px-6 py-2 flex items-center transition-colors ${
                      activeTab === "pentagon"
                        ? `${contentConfig.pentagon.gradient} text-white`
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <i className="fas fa-wine-glass-alt mr-2"></i> Pentagon
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("hydrology");
                      setActiveFilter("all");
                      setSearchQuery("");
                    }}
                    className={`px-4 sm:px-6 py-2 flex items-center transition-colors ${
                      activeTab === "hydrology"
                        ? `${contentConfig.hydrology.gradient} text-[#C0C0C0]`
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <i className="fas fa-tint mr-2"></i> Hydrology
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("sphere");
                      setActiveFilter("all");
                      setSearchQuery("");
                    }}
                    className={`px-4 sm:px-6 py-2 flex items-center transition-colors ${
                      activeTab === "sphere"
                        ? `${contentConfig.sphere.gradient} text-[#FFFFFF]`
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <i className="fas fa-circle-notch mr-2"></i> Sphere
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Render active tab */}
        {activeTab === "hydrology" && <HydrologyPage />}
        {activeTab === "sphere" && <SpherePage />}
        {activeTab === "pentagon" && <PentagonPage />}

        <Footer />
      </div>
    </>
  );
};

export default BeveragesPage;
