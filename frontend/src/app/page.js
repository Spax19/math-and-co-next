"use client";
import React, { useState, useEffect, Suspense, useRef } from "react";
import LoadingSpinner from "../components/loadingSpinner";
import Image from "next/image";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Link from "next/link";
import ProductModal from "../components/productModal";
import Cart from "../components/cart";
import { toast } from "react-toastify";
import "./globals.css";
import { useSearchParams } from "next/navigation";
import BookingModal from "../components/bookingModal";
import ProfileCompletionModal from "../components/completeProfileModal";

function MainComponentContent() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
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
    availableTimes: [],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openModal = (wine) => {
    setSelectedProduct(wine);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => cartItem.id === item.id && !cartItem.isCase
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const newCart = [...prevCart];
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          quantity: (newCart[existingItemIndex].quantity || 1) + 1,
        };
        return newCart;
      } else {
        // Add new item if it doesn't exist
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });

    // Show toast notification
    const existingItem = cart.find(
      (cartItem) => cartItem.id === item.id && !cartItem.isCase
    );

    toast.success(
      <div className="flex items-center">
        <img
          src={item.image_url}
          alt={item.name}
          className="w-12 h-12 object-contain mr-3"
        />
        <div>
          <p className="font-medium">
            {existingItem ? "Added another" : "Added to cart"} {item.name}
          </p>
          <p className="text-sm">
            R{item.price.toFixed(2)}{" "}
            {item.case_price && `| Case: R${item.case_price.toFixed(2)}`}
          </p>
          {existingItem && (
            <p className="text-xs text-gray-500">
              Total: {(existingItem.quantity || 1) + 1}
            </p>
          )}
        </div>
      </div>,
      {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );
  };

  const handleBookingClick = (experience) => {
    setBookingData({
      experience: experience.name,
      eventName: experience.name,
      eventType: experience.type,
      price: experience.price,
      availableTimes: experience.availableTimes,
      date: "",
      time: "",
      guests: 1,
      name: "",
      email: "",
      phone: "",
      specialRequests: "",
      duration: experience.duration,
      highlights: experience.highlights,
    });
    setShowBookingModal(true);
  };

  const handleInputChange = (field, value) => {
    setBookingData({ ...bookingData, [field]: value });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (validateForm()) {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setShowBookingModal(false);
        setBookingData({
          ...bookingData,
          date: "",
          time: "",
          guests: 1,
          name: "",
          email: "",
          phone: "",
          specialRequests: "",
        });
        setIsSubmitted(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const featuredWines = [
    {
      id: 1,
      name: "Carbernet Sauvignon",
      price: 466.65,
      case_image: "./images/Carbernet-SauvignonBox.png",
      case_price: 2799.9,
      image_url: "./images/Carbernet-Sauvignon.png",
      description: "With exotic red fruit for any special occasion or gift.",
      rating: 4,
      reviews: 128,
    },
    {
      id: 2,
      name: "Chenin Blanc",
      price: 279.99,
      case_image: "./images/Chenin-Blanc-Box.png",
      case_price: 1679.94,
      image_url: "./images/Chenin-Blanc.png",
      description:
        "With lovely white fruit, ripe pear and passion fruit flavours for the summer.",
      rating: 4,
      reviews: 86,
    },
    {
      id: 3,
      name: "MCC Brut",
      price: 559.99,
      case_image: "./images/Brut-Box.png",
      case_price: 3359.94,
      image_url: "./images/MCC-Brut.png",
      description: "Toasty notes of honey, and almond.",
      rating: 3,
      reviews: 64,
    },
    {
      id: 4,
      name: "MCC Brut Rosé",
      price: 604.35,
      case_image: "./images/MCC-Brut-Rose-Box.png",
      case_price: 3626.1,
      image_url: "./images/MCC-Brut-Rose.png",
      description: "Made from 60% Pinot Noir and 40% Chardonnay grapes.",
      rating: 5,
      reviews: 112,
    },
  ];

  const newReleases = [
    {
      id: 3,
      name: "MCC Brut Rosé",
      price: 500.0,
      image_url: "./images/MCC-Brut-Rose.png",
      description: "Made from 60% Pinot Noir and 40% Chardonnay grapes.",
      isNew: true,
      case_image: "./images/MCC-Brut-Rose-Box.png",
      case_price: 3000.0,
      rating: 5,
      reviews: 112,
    },
    {
      id: 4,
      name: "MCC Brut",
      price: 400.0,
      image_url: "./images/MCC-Brut.png",
      description: "Toasty notes of honey, and almond.",
      isNew: true,
      rating: 3,
      reviews: 64,
      case_image: "./images/Brut-Box.png",
      case_price: 3000.0,
    },
  ];

  const collections = [
    {
      id: 1,
      name: "Red Wine",
      image: "/images/red-wines.jpg",
      description: "Rich and bold red wines",
      filter: "type=Red",
    },
    {
      id: 2,
      name: "White Wine",
      image: "/images/red-wines.jpg",
      description: "Crisp and refreshing white wines",
      filter: "type=White",
    },
    {
      id: 3,
      name: "Sparkling Wine",
      image: "/images/red-wines.jpg",
      description: "Celebratory bubbly wines",
      filter: "type=Sparkling",
    },
    {
      id: 4,
      name: "All Wines",
      image: "/images/red-wines.jpg",
      description: "Browse our complete selection",
      filter: "",
    },
    {
      id: 5,
      name: "Hydrology Water",
      image: "/images/red-wines.jpg",
      description: "Premium mineral-infused waters",
      link: "/hydrology",
    },
    {
      id: 6,
      name: "Pentagon Wine",
      image: "/images/red-wines.jpg",
      description: "Exclusive limited-edition collection",
      link: "/pentagon",
    },
  ];

  const awards = [
    { name: "Double Gold", competition: "San Francisco Wine Competition 2024" },
    { name: "95 Points", critic: "Wine Enthusiast" },
    { name: "Best in Class", competition: "Decanter World Wine Awards" },
  ];

  const experiences = [
    {
      id: 1,
      name: "Tasting Room",
      image:
        "https://e1a4c9d0d2f9f737c5e1.ucr.io/https://www.create.xyz/api/ai-img?prompt=Tasting%2520Room",
      description: "Guided tastings of our finest wines",
      type: "tasting",
      price: 150,
      duration: "1 hour",
      availableTimes: ["10:00", "12:00", "14:00", "16:00"],
      highlights: [
        "Sample 5 premium wines",
        "Learn tasting techniques",
        "Vineyard views",
      ],
    },
    {
      id: 2,
      name: "Vineyard Tours",
      image:
        "https://e1a4c9d0d2f9f737c5e1.ucr.io/https://www.create.xyz/api/ai-img?prompt=Vineyard%2520Tours",
      description: "Walk through our historic vineyards",
      type: "tour",
      price: 150,
      duration: "2 hours",
      availableTimes: ["09:00", "11:00", "13:00"],
      highlights: [
        "Guided vineyard walk",
        "Meet the winemaker",
        "Includes tasting",
      ],
    },
    {
      id: 3,
      name: "Wine Pairing",
      image:
        "https://e1a4c9d0d2f9f737c5e1.ucr.io/https://www.create.xyz/api/ai-img?prompt=Wine%2520Pairing",
      description: "Chef-curated food and wine experiences",
      type: "dining",
      price: 150,
      duration: "3 hours",
      availableTimes: ["18:00", "18:30", "19:00"],
      highlights: [
        "5-course meal",
        "Premium wine pairings",
        "Private dining room",
      ],
    },
  ];

  // Changed from useLocation to useSearchParams for Next.js
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for verification success
    const verified = searchParams.get("verified");
    if (verified === "true") {
      toast.success("Your account has been successfully verified!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Clean up URL without refreshing
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.delete("verified");
        window.history.replaceState({}, "", url.toString());
      }
    }
  }, [searchParams]);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleLoginSuccess = (user) => {
    setShowLogin(false);
    if (!user.profileComplete) {
      setShowProfileModal(true);
      setUserData(user);
    }
  };

  return (
    <>
      <Navbar cart={cart} setIsCartOpen={setIsCartOpen} />

      <div className="main-container">
        <div className="hero-banner">
          <div className="hero-image-container">
            <Image
              src="/path-to-your-image.jpg"
              alt="Winery landscape"
              layout="fill"
              objectFit="cover"
              quality={80}
              priority
            />
          </div>

          <div className="hero-content">
            <div className="hero-text-container">
              <h1 className="hero-title">
                The Taste of Nature.
                <br />
                Home of Carbernet.
              </h1>
              <Link href="./main/shop">
                <button className="hero-button">Shop Our Wines</button>
              </Link>
            </div>
          </div>
        </div>

        <main className="container px-4 mb-16 pt-4">
          <section className="mb-16 text-center relative mt-4">
            <div className="flex justify-center items-center mb-16 relative">
              <div className="text-center">
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex space-x-2">
                  <button className="carousel-nav-btn prev-btn">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button className="carousel-nav-btn next-btn">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                id="collections-carousel"
                style={{ width: `${collections.length * 368}px` }}
              >
                {collections.map((collection, index) => (
                  <div
                    key={index}
                    className="px-4 flex-shrink-0"
                    style={{ width: "352px" }}
                  >
                    <Link
                      href={
                        collection.link
                          ? collection.link
                          : `/main/shop?${collection.filter}`
                      }
                      className="block"
                    >
                      <div className="collection-card">
                        <div
                          className="collection-bg"
                          style={{
                            backgroundImage: `url(${collection.image})`,
                          }}
                        ></div>

                        <img
                          src={collection.image}
                          alt={collection.name}
                          className="collection-image"
                        />

                        <div className="collection-icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-white animate-bounce"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                          </svg>
                        </div>

                        <div className="collection-overlay">
                          <div className="collection-content">
                            <h3 className="collection-name">
                              {collection.name}
                            </h3>
                            <p className="collection-description">
                              {collection.description}
                            </p>
                            <button className="collection-button">
                              {collection.link ? "Explore" : "Shop Collection"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <script
              dangerouslySetInnerHTML={{
                __html: `
              document.addEventListener('DOMContentLoaded', () => {
                const carousel = document.getElementById('collections-carousel');
                const prevBtn = document.querySelector('.prev-btn');
                const nextBtn = document.querySelector('.next-btn');
                const cardWidth = 352; // width + padding
                let currentPosition = 0;
                let visibleCards = Math.floor(window.innerWidth / cardWidth);
                let maxPosition = -(${collections.length} * cardWidth - visibleCards * cardWidth);

                function updateCarousel() {
                  carousel.style.transform = \`translateX(\${currentPosition}px)\`;
                }

                prevBtn.addEventListener('click', () => {
                  currentPosition = Math.min(currentPosition + cardWidth, 0);
                  updateCarousel();
                });

                nextBtn.addEventListener('click', () => {
                  currentPosition = Math.max(currentPosition - cardWidth, maxPosition);
                  updateCarousel();
                });

                window.addEventListener('resize', () => {
                  visibleCards = Math.floor(window.innerWidth / cardWidth);
                  maxPosition = -(${collections.length} * cardWidth - visibleCards * cardWidth);
                  currentPosition = Math.max(currentPosition, maxPosition);
                  updateCarousel();
                });
              });
            `,
              }}
            />
          </section>

          <section className="mb-18">
            <h2 className="section-title">Best Sellers</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredWines.map((wine) => (
                <div
                  key={wine.id}
                  className="product-card"
                  onClick={() => openModal(wine)}
                >
                  <div className="product-image-container">
                    <img
                      src={wine.image_url}
                      alt={`Bottle of ${wine.name}`}
                      className="product-image"
                    />
                  </div>

                  <div className="flex-grow">
                    <h3 className="product-name">{wine.name}</h3>

                    <div className="star-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i
                          key={star}
                          className={`${
                            star <= wine.rating ? "fas fa-star" : "far fa-star"
                          } text-[#d4b26a] text-sm`}
                        ></i>
                      ))}
                      <span className="review-count">({wine.rating})</span>
                    </div>
                    <p className="text-gray-500 text-xs mb-2">
                      ({wine.reviews} reviews)
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <span className="product-price">
                        R {wine.price.toFixed(2)}
                      </span>
                      {wine.case_price && (
                        <p className="case-price">
                          Case: R {wine.case_price.toFixed(2)}
                        </p>
                      )}
                    </div>
                    <button
                      className="add-to-cart-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          ...wine,
                          quantity: 1,
                          isCase: false,
                          unitPrice: wine.price,
                        });
                      }}
                    >
                      <i className="fas fa-shopping-cart text-xl"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {selectedProduct && (
              <ProductModal
                product={selectedProduct}
                onClose={closeModal}
                addToCart={addToCart}
              />
            )}
          </section>

          <section className="mb-16 mt-16">
            <h2 className="section-title">Sales</h2>

            <div className="relative">
              <div className="flex overflow-x-auto gap-6 pb-6 wine-scroller">
                <div className="flex space-x-8 min-w-max">
                  {newReleases.map((wine) => (
                    <div
                      key={wine.id}
                      className="sale-product-card"
                      onClick={() => setSelectedProduct(wine)}
                    >
                      <div className="sale-badge">Sale</div>

                      <div className="sale-product-image-container">
                        <img
                          src={wine.image_url}
                          alt={wine.name}
                          className="sale-product-image"
                        />
                      </div>

                      <div className="flex-grow">
                        <h3 className="product-name">{wine.name}</h3>

                        <p className="sale-product-description">
                          {wine.description}
                        </p>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <span className="product-price">R{wine.price}</span>
                        <button
                          className="add-to-cart-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart({
                              ...wine,
                              quantity: 1,
                              isCase: false,
                              unitPrice: wine.price,
                            });
                          }}
                        >
                          <i className="fas fa-shopping-cart text-xl mr-2"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="scroller-gradient-left" />
              <div className="scroller-gradient-right" />
            </div>

            {selectedProduct && (
              <ProductModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
                addToCart={(product) => {
                  setCart([...cart, product]);
                  setSelectedProduct(null);
                }}
              />
            )}
          </section>

          <section className="mb-16 p-8 rounded-lg bg-transparent">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="service-card">
                <div className="mb-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="service-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="service-name">Discover Wine Distributors</h3>
                <p className="service-description">
                  Order before 3pm and get your order the next day as standard
                </p>
                <button className="service-button">
                  Learn more
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              <div className="service-card">
                <div className="mb-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="service-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                </div>
                <h3 className="service-name">Wine Tasting & Tours</h3>
                <p className="service-description">
                  Handcrafted experiences made with real passion and
                  craftsmanship
                </p>
                <button className="service-button">
                  Book now
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              <div className="service-card">
                <div className="mb-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="service-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v13m0-13V3m0 5h8m-8 0H4m12 8v6m0-6V9m0 6h6m-6 0H6"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <h3 className="service-name">Wine for Each Occasion</h3>
                <p className="service-description">
                  For our quality you wont find better prices anywhere
                </p>
                <button className="service-button">
                  View selection
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              <div className="service-card">
                <div className="mb-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="service-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 17v1a3 3 0 003 3v0a3 3 0 003-3v-1"
                    />
                  </svg>
                </div>
                <h3 className="service-name">Recycled Packaging</h3>
                <p className="service-description">
                  100% recycled materials for a sustainable footprint
                </p>
                <button className="service-button">
                  Our commitment
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="section-title">Winery Experience</h2>

            <div className="relative">
              <div className="flex overflow-x-auto pb-6 experience-scroller">
                <div className="flex space-x-8 min-w-max">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="experience-card">
                      <div className="experience-image-container">
                        <img
                          src={exp.image}
                          alt={exp.name}
                          className="experience-image"
                        />
                        {/* <div className="experience-price-badge">
                          R{exp.price} per person
                        </div> */}
                      </div>

                      <div className="experience-content">
                        <div className="flex-grow">
                          <h3 className="product-name">{exp.name}</h3>
                          <p className="experience-description">
                            {exp.description}
                          </p>
                          {/* <div className="experience-highlights">
                            {exp.highlights.map((highlight, i) => (
                              <div key={i} className="highlight-item">
                                <i className="fas fa-check-circle highlight-icon"></i>
                                <span>{highlight}</span>
                              </div>
                            ))}
                          </div> */}
                        </div>

                        <button
                          className="book-now-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookingClick(exp);
                          }}
                        >
                          <i className="fas fa-calendar-check mr-2"></i>
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="scroller-gradient-left" />
              <div className="scroller-gradient-right" />
            </div>
          </section>

          <section className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="education-section">
              <h2 className="education-title">Wine Education</h2>
              <div className="space-y-4">
                <div className="education-item">
                  <h3 className="education-item-title">Tasting Notes</h3>
                  <p className="education-item-description">
                    Learn to identify subtle flavors and aromas
                  </p>
                </div>
                <div className="education-item">
                  <h3 className="education-item-title">Food Pairing</h3>
                  <p className="education-item-description">
                    Perfect wine selections for any meal
                  </p>
                </div>
                <div className="education-item">
                  <h3 className="education-item-title">Storage Tips</h3>
                  <p className="education-item-description">
                    Optimal conditions for aging wines
                  </p>
                </div>
              </div>
            </div>

            <div className="newsletter-section">
              <h2 className="newsletter-title">Newsletter Signup</h2>
              <p className="mb-4">
                Join our wine community and receive 10% off your first purchase
              </p>
              <form className="space-y-4">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="newsletter-input"
                />
                <button type="submit" className="newsletter-button">
                  Subscribe Now
                </button>
              </form>
            </div>
          </section>

          <FeaturedClients />
          <TestimonialsSection />

          <section className="mb-16">
            <h2 className="section-title">Follow Us on Instagram</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a
                href="https://www.instagram.com/mathandco_/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="instagram-card"
              >
                <img
                  src="https://e1a4c9d0d2f9f737c5e1.ucr.io/https://www.create.xyz/api/ai-img?prompt=Vineyard%2520sunset"
                  alt="Vineyard sunset"
                  className="instagram-image"
                />
                <div className="instagram-overlay">
                  <i className="fab fa-instagram instagram-icon"></i>
                </div>
              </a>

              <a
                href="https://www.instagram.com/mathandco_/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="instagram-card"
              >
                <img
                  src="https://e1a4c9d0d2f9f737c5e1.ucr.io/https://www.create.xyz/api/ai-img?prompt=Wine%2520tasting%2520event"
                  alt="Wine tasting event"
                  className="instagram-image"
                />
                <div className="instagram-overlay">
                  <i className="fab fa-instagram instagram-icon"></i>
                </div>
              </a>

              <a
                href="https://www.instagram.com/mathandco_/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="instagram-card"
              >
                <img
                  href="https://www.instagram.com/mathandco_/?hl=en"
                  src="./images/insta.jpeg"
                  alt="Wine bottles"
                  className="instagram-image"
                />
                <div className="instagram-overlay">
                  <i className="fab fa-instagram instagram-icon"></i>
                </div>
              </a>

              <a
                href="https://www.instagram.com/mathandco_/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="instagram-card"
              >
                <img
                  src="https://e1a4c9d0d2f9f737c5e1.ucr.io/https://www.create.xyz/api/ai-img?prompt=Harvest%2520season"
                  alt="Harvest season"
                  className="instagram-image"
                />
                <div className="instagram-overlay">
                  <i className="fab fa-instagram instagram-icon"></i>
                </div>
              </a>
            </div>
          </section>
        </main>

        {isCartOpen && (
          <Cart
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cart={cart}
            setCart={setCart}
          />
        )}

        <BookingModal
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setErrors({});
            setIsSubmitted(false);
          }}
          bookingData={bookingData}
          onSubmit={handleBookingSubmit}
          errors={errors}
          isSubmitted={isSubmitted}
          isLoading={isLoading}
          onInputChange={handleInputChange}
        />
        {showProfileModal && <ProfileCompletionModal />}
      </div>

      <Footer />
    </>
  );
}

function FeaturedClients() {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    const scrollSpeed = 0.5;
    const scrollWidth =
      scrollContainer.scrollWidth - scrollContainer.clientWidth;

    const scroll = () => {
      if (scrollAmount >= scrollWidth) {
        scrollAmount = 0;
        scrollContainer.scrollLeft = 0;
      } else {
        scrollAmount += scrollSpeed;
        scrollContainer.scrollLeft = scrollAmount;
      }
      requestAnimationFrame(scroll);
    };

    const scrollTimeout = setTimeout(() => {
      requestAnimationFrame(scroll);
    }, 1000);

    const handleMouseEnter = () => {
      scrollAmount = scrollContainer.scrollLeft;
      cancelAnimationFrame(scroll);
    };

    const handleMouseLeave = () => {
      requestAnimationFrame(scroll);
    };

    scrollContainer.addEventListener("mouseenter", handleMouseEnter);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(scrollTimeout);
      cancelAnimationFrame(scroll);
      scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const clients = [
    { name: "Carpe", logo: "./clients/carpe.jpg" },
    { name: "Appto", logo: "./clients/Appto.jpeg" },
    { name: "Davinci", logo: "./clients/davinci.png" },
    { name: "Mabu", logo: "./clients/mabu.jpg" },
    { name: "Mela", logo: "./clients/mela.png" },
    { name: "Oldrock", logo: "./clients/oldrock.jpg" },
    { name: "Spar", logo: "./clients/spar.jpeg" },
    { name: "Life Grand Cafe", logo: "./clients/life-grand-cafe.jpg" },
    { name: "Carpe", logo: "./clients/carpe.jpg" },
    { name: "Appto", logo: "./clients/Appto.jpeg" },
    { name: "Davinci", logo: "./clients/davinci.png" },
    { name: "Mabu", logo: "./clients/mabu.jpg" },
  ];

  return (
    <section
      className="mb-16 mt-16"
      aria-label="Featured in these publications"
    >
      <div className="text-center">
        <h2 className="section-title mb-2">Featured In</h2>
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-hidden py-4 relative"
        >
          <div className="flex items-center animate-scroll whitespace-nowrap">
            {clients.map((client, index) => (
              <div
                key={`${client.name}-${index}`}
                className="inline-flex items-center justify-center px-8 mx-4"
              >
                <img
                  src={client.logo}
                  alt={`${client.name} Logo - Featured Partner`}
                  className="client-logo h-12 object-contain max-w-[120px] opacity-70 hover:opacity-100 transition-opacity duration-300"
                  loading="lazy"
                  width="120"
                  height="48"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const scrollContainerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      text: "The finest wine experience in the region. Their Cabernet Sauvignon is absolutely exceptional!",
      author: "James W., Wine Club Member",
      rating: 5,
    },
    {
      text: "Exceptional quality and service. The vineyard tour was educational and the tasting room was superb.",
      author: "Sarah M., Wine Enthusiast",
      rating: 5,
    },
    {
      text: "Their MCC Brut Rosé is my go-to celebration wine. Perfect balance of flavor and bubbles!",
      author: "David T., Sommelier",
      rating: 4,
    },
    {
      text: "The wine pairing dinner was an unforgettable experience. Each course complemented the wines perfectly.",
      author: "Emily R., Food Blogger",
      rating: 5,
    },
  ];

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    const scrollSpeed = 0.3;
    const cardWidth = scrollContainer.firstChild?.offsetWidth || 0;
    const scrollWidth = cardWidth * testimonials.length;

    const scroll = () => {
      if (isPaused) return;

      if (scrollAmount >= scrollWidth) {
        scrollAmount = 0;
        scrollContainer.scrollLeft = 0;
        setActiveIndex(0);
      } else {
        scrollAmount += scrollSpeed;
        scrollContainer.scrollLeft = scrollAmount;
        setActiveIndex(
          Math.floor(scrollAmount / cardWidth) % testimonials.length
        );
      }
      requestAnimationFrame(scroll);
    };

    const scrollTimeout = setTimeout(() => {
      requestAnimationFrame(scroll);
    }, 1000);

    return () => {
      clearTimeout(scrollTimeout);
      cancelAnimationFrame(scroll);
    };
  }, [isPaused, testimonials.length]);

  const goToTestimonial = (index) => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      const cardWidth = scrollContainer.firstChild?.offsetWidth || 0;
      scrollContainer.scrollLeft = index * cardWidth;
      setActiveIndex(index);
    }
  };

  return (
    <section className="mb-16 py-8" aria-label="Customer testimonials">
      <h2 className="section-title">What Our Customers Say</h2>

      <div
        ref={scrollContainerRef}
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="flex pb-6">
          {[...testimonials, ...testimonials.slice(0, 1)].map(
            (testimonial, index) => (
              <div
                key={`${testimonial.author}-${index}`}
                className="testimonial-card flex-shrink-0 w-[90vw] sm:w-[80vw] md:w-[40vw] lg:w-[30vw] px-4"
              >
                <div className="bg-white p-8 rounded-lg shadow-lg h-full border border-gray-100">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`fas fa-star ${
                          i < testimonial.rating
                            ? "text-[#d4b26a]"
                            : "text-gray-300"
                        } mr-1`}
                        aria-hidden="true"
                      ></i>
                    ))}
                  </div>
                  <i
                    className="fas fa-quote-left text-[#d4b26a] text-2xl mb-4 opacity-50"
                    aria-hidden="true"
                  ></i>
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                    {testimonial.text}
                  </p>
                  <p className="font-medium text-gray-900">
                    - {testimonial.author}
                  </p>
                </div>
              </div>
            )
          )}
        </div>

        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10"></div>
      </div>

      <div className="flex justify-center mt-8 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToTestimonial(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === activeIndex ? "bg-[#d4b26a] w-6" : "bg-gray-300"
            }`}
            aria-label={`View testimonial from ${testimonials[index].author}`}
          />
        ))}
      </div>
    </section>
  );
}

export default function MainComponent() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <MainComponentContent />
    </Suspense>
  );
}
