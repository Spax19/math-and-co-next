"use client";
import Footer from "../../../components/footer";
import Navbar from "../../../components/navbar";
import React, { useState, useRef } from "react";
import "../../globals.css";

// ==================== COMPONENTS ====================

const PageHeader = ({ gradient, color, title, subtitle }) => (
  <header className={`bevs-header ${gradient}`}>
    <div className="bevs-container">
      <h1 className="bevs-header__title" style={{ color }}>{title}</h1>
      <p className="bevs-header__subtitle">{subtitle}</p>
      <div className="bevs-header__divider" style={{ backgroundColor: color }}></div>
    </div>
  </header>
);

const AboutSection = ({ color, title, content, image, reverse = false }) => (
  <section className="bevs-section bevs-section--white">
    <div className="bevs-container">
      <div className={`bevs-about ${reverse ? 'bevs-about--reverse' : ''}`}>
        <div className="bevs-about__image">
          <img src={image} alt={title} className="bevs-about__img" loading="lazy" />
        </div>
        <div className="bevs-about__text">
          <h2 className="bevs-about__heading" style={{ color }}>{title}</h2>
          {content.map((paragraph, index) => (
            <p key={index} className="bevs-about__paragraph">{paragraph}</p>
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
  setSearchQuery
}) => (
  <section className="bevs-section bevs-section--gray">
    <div className="bevs-container">
      <h2 className="bevs-section__title" style={{ color }}>{title}</h2>

      <div className="bevs-filters">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`bevs-filter ${activeFilter === filter.id ? 'bevs-filter--active' : ''}`}
            style={{ backgroundColor: activeFilter === filter.id ? color : '' }}
          >
            {filter.name}
          </button>
        ))}
      </div>

      <div className="bevs-search">
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
      </div>

      <div className="bevs-products">
        {items.map(item => (
          <article key={item.id} className="bevs-product">
            <div className="bevs-product__content">
              <div className="bevs-product__image">
                <img src={item.image} alt={item.name} className="bevs-product__img" loading="lazy" />
              </div>
              <div className="bevs-product__details">
                <div className="bevs-product__header">
                  <h3 className="bevs-product__name">{item.name}</h3>
                  <span className="bevs-product__type" style={{ backgroundColor: color }}>
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
          <h2 className="bevs-delivery__title" style={{ color }}>{title}</h2>
          <ul className="bevs-delivery__list">
            {content.map((item, index) => (
              <li key={index} className="bevs-delivery__item">
                <svg className="bevs-delivery__icon" style={{ color }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="bevs-delivery__text-content">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bevs-delivery__image">
          <img src={image} alt={title} className="bevs-delivery__img" loading="lazy" />
        </div>
      </div>
    </div>
  </section>
);

// ==================== PAGE COMPONENTS ====================

const contentConfig = {
  hydrology: {
    gradient: "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800",
    color: "#3B82F6",
    textColor: "#C0C0C0",
    filters: [
      { id: "all", name: "All Products" },
      { id: "still", name: "Still Waters" },
      { id: "sparkling", name: "Sparkling" }
    ],
    welcome: {
      title: "Hydrology Premium Waters",
      subtitle: "Nature's purity in every drop"
    },
    about: {
      title: "Our Water Philosophy",
      content: [
        "Founded in 2010, Hydrology has dedicated itself to preserving water in its most natural state. Our waters are sourced from protected aquifers and glaciers, untouched by human pollution.",
        "We believe water should be consumed as nature intended - with its original mineral composition intact. Our proprietary bottling process ensures every bottle maintains the water's natural properties.",
        "Hydrology is committed to sustainable sourcing and carbon-neutral operations. For every bottle sold, we protect 10 square feet of watershed land."
      ],
      image: "/images/hydrology-about.jpg"
    },
    products: {
      title: "Our Water Collection",
      items: [
        {
          id: 1,
          name: "Alpine Spring",
          type: "still",
          description: "Ultra-pure water filtered through ancient glaciers",
          price: "$8.99",
          image: "/images/hydrology-alpine.png"
        },
        {
          id: 2,
          name: "Volcanic Sparkling",
          type: "sparkling",
          description: "Naturally carbonated with volcanic mineral infusion",
          price: "$9.99",
          image: "/images/hydrology-volcanic.png"
        }
      ]
    },
    delivery: {
      title: "Sustainable Delivery",
      content: [
        "We deliver nationwide in eco-friendly packaging made from 100% recycled materials",
        "Standard delivery: 3-5 business days ($5.99)",
        "Express delivery: 1-2 business days ($12.99)"
      ],
      image: "/images/hydrology-delivery.jpg"
    }
  },
  sphere: {
    gradient: "bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-700",
    color: "#10B981",
    textColor: "#FFFFFF",
    filters: [
      { id: "all", name: "All Flavors" },
      { id: "citrus", name: "Citrus" },
      { id: "berry", name: "Berry" }
    ],
    welcome: {
      title: "Sphere Infused Waters",
      subtitle: "Innovative hydration reimagined"
    },
    about: {
      title: "The Sphere Difference",
      content: [
        "Launched in 2018, Sphere was born from a desire to revolutionize infused beverages. Our proprietary infusion process extracts maximum flavor and nutrients without artificial additives.",
        "Each Sphere product is crafted by our team of flavor scientists and nutritionists to deliver perfect balance - never too sweet, always refreshing.",
        "We partner with organic farms worldwide to source the freshest ingredients at peak seasonality."
      ],
      image: "/images/sphere-about.jpg"
    },
    products: {
      title: "Our Infused Collection",
      items: [
        {
          id: 1,
          name: "Citrus Burst",
          type: "citrus",
          description: "Zesty blend of organic citrus fruits",
          price: "$5.99",
          image: "/images/sphere-citrus.png"
        },
        {
          id: 2,
          name: "Berry Medley",
          type: "berry",
          description: "Antioxidant-rich berry infusion",
          price: "$6.49",
          image: "/images/sphere-berry.png"
        }
      ]
    },
    delivery: {
      title: "Flexible Delivery",
      content: [
        "Nationwide shipping in 100% compostable packaging",
        "Standard delivery: 2-4 business days ($4.99)",
        "Express delivery: 1 business day ($9.99)"
      ],
      image: "/images/sphere-delivery.jpg"
    }
  },
  pentagon: {
    gradient: "bg-gradient-to-br from-purple-500 via-purple-600 to-purple-800",
    color: "#7E22CE",
    textColor: "#D4B26A",
    filters: [
      { id: "all", name: "All Wines" },
      { id: "red", name: "Red Wines" },
      { id: "white", name: "White Wines" }
    ],
    welcome: {
      title: "Pentagon Fine Wines",
      subtitle: "The pinnacle of winemaking artistry"
    },
    about: {
      title: "Our Winemaking Heritage",
      content: [
        "Established in 1995, Pentagon has built a reputation for uncompromising quality. Our winemakers combine old-world techniques with cutting-edge technology.",
        "Each vineyard partner is carefully selected for unique terroir and sustainable practices. We produce small lots that express the pure character of each site.",
        "Pentagon wines are aged to perfection in our temperature-controlled cellars before release."
      ],
      image: "/images/pentagon-about.jpg"
    },
    products: {
      title: "Our Wine Selection",
      items: [
        {
          id: 1,
          name: "Black Label Reserve",
          type: "red",
          description: "Small-batch crafted with extraordinary care",
          price: "$89.99",
          image: "/images/pentagon-black.png"
        },
        {
          id: 2,
          name: "Gold Signature",
          type: "white",
          description: "Our flagship blend representing perfection",
          price: "$129.99",
          image: "/images/pentagon-gold.png"
        }
      ]
    },
    delivery: {
      title: "Premium Delivery",
      content: [
        "Temperature-controlled shipping nationwide",
        "Standard delivery: 5-7 business days ($9.99)",
        "Express delivery: 2-3 business days ($19.99)"
      ],
      image: "/images/pentagon-delivery.jpg"
    }
  }
};

const HydrologyPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const content = contentConfig.hydrology;

  const filteredItems = content.products.items.filter(item => {
    const matchesFilter = activeFilter === "all" || item.type === activeFilter;
    const matchesSearch = searchQuery === "" ||
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

  const filteredItems = content.products.items.filter(item => {
    const matchesFilter = activeFilter === "all" || item.type === activeFilter;
    const matchesSearch = searchQuery === "" ||
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

  const filteredItems = content.products.items.filter(item => {
    const matchesFilter = activeFilter === "all" || item.type === activeFilter;
    const matchesSearch = searchQuery === "" ||
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
  
  return (
    <>
      <Navbar />
      <div className="bevs-root">
        {/* Hero Section with Tabs */}
        <div className={`w-full ${contentConfig[activeTab].gradient} text-white py-16 px-4 sm:px-6 lg:px-8`}>
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-block relative">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 relative z-10">
                {contentConfig[activeTab].welcome.title}
              </h1>
              <div className="absolute -bottom-2 left-0 right-0 h-3 bg-white/30 z-0"></div>
            </div>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto mt-4">
              {contentConfig[activeTab].welcome.subtitle}
            </p>

            {/* Tab Switch - Preserved your exact Tailwind styling */}
            <div className="inline-flex rounded-full overflow-hidden bg-white/20 backdrop-blur-sm mt-8">
              <button
                onClick={() => {
                  setActiveTab("pentagon");
                  setActiveFilter("all");
                  setSearchQuery("");
                }}
                className={`px-6 py-2 flex items-center transition-colors ${activeTab === "pentagon"
                    ? `${contentConfig.pentagon.gradient} text-[#D4B26A]`
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
                className={`px-6 py-2 flex items-center transition-colors ${activeTab === "hydrology"
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
                className={`px-6 py-2 flex items-center transition-colors ${activeTab === "sphere"
                    ? `${contentConfig.sphere.gradient} text-[#FFFFFF]`
                    : "text-white hover:bg-white/10"
                  }`}
              >
                <i className="fas fa-circle-notch mr-2"></i> Sphere
              </button>
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