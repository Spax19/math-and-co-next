"use client";
import React, { useState } from "react";
import Image from 'next/image';
import Navbar from '../components/navbar';
import Footer from "../components/footer";
import Link from 'next/link';




function MainComponent() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");

  const featuredWines = [
    {
      id: 1,
      name: "Reserve Cabernet Sauvignon",
      price: 89.99,
      image_url: "https://e1a4c9d0d2f9f737c5e1.ucr.io/https://www.create.xyz/api/ai-img?prompt=Bottle%2520of%2520Reserve%2520Cabernet%2520Sauvignon",
      description: "Bold and full-bodied with rich dark fruit flavors",
      rating: 4,
      reviews: 128
    },
    {
      id: 2,
      name: "Estate Chardonnay",
      price: 45.99,
      image_url: "https://e1a4c9d0d2f9f737c5e1.ucr.io/https://www.create.xyz/api/ai-img?prompt=Bottle%2520of%2520Estate%2520Chardonnay",
      description: "Elegant white wine with notes of apple and vanilla",
      rating: 4,
      reviews: 86
    },
    {
      id: 3,
      name: "Pinot Noir",
      price: 52.99,
      image_url: "https://e1a4c9d0d2f9f737c5e1.ucr.io/https://www.create.xyz/api/ai-img?prompt=Bottle%2520of%2520Pinot%2520Noir",
      description: "Delicate red with cherry and earthy notes",
      rating: 3,
      reviews: 64
    },
    {
      id: 4,
      name: "Sauvignon Blanc",
      price: 39.99,
      image_url: "https://e1a4c9d0d2f9f737c5e1.ucr.io/https://www.create.xyz/api/ai-img?prompt=Bottle%2520of%2520Sauvignon%2520Blanc",
      description: "Crisp and refreshing with citrus aromas",
      rating: 5,
      reviews: 112
    }
  ];

  const newReleases = [
    {
      id: 3,
      name: "2024 Rosé",
      price: 34.99,
      image_url: "https://e1a4c9d0d2f9f737c5e1.ucr.io/https://www.create.xyz/api/ai-img?prompt=2024%2520Ros%25C3%25A9",
      description: "Fresh and vibrant with notes of strawberry",
      isNew: true,
    },
    {
      id: 4,
      name: "2024 Pinot Noir",
      price: 54.99,
      image_url: "https://e1a4c9d0d2f9f737c5e1.ucr.io/https://www.create.xyz/api/ai-img?prompt=2024%2520Pinot%2520Noir",
      description: "Delicate red fruit with earthy undertones",
      isNew: true,
    },

    {
      id: 5,
      name: "2024 Pinot Noir",
      price: 54.99,
      image_url: "https://e1a4c9d0d2f9f737c5e1.ucr.io/https://www.create.xyz/api/ai-img?prompt=2024%2520Pinot%2520Noir",
      description: "Delicate red fruit with earthy undertones",
      isNew: true,
    }
  ];

// UPDATED COLLECTIONS ARRAY WITH NEW ITEMS
const collections = [
  {
    id: 1,
    name: "Red Wine",
    image: "/images/red-wines.jpg",
    description: "Rich and bold red wines",
    filter: "type=Red"
  },
  {
    id: 2,
    name: "White Wine",
    image:"/images/red-wines.jpg",
    description: "Crisp and refreshing white wines",
    filter: "type=White"
  },
  {
    id: 3,
    name: "Sparkling Wine",
    image: "/images/red-wines.jpg",
    description: "Celebratory bubbly wines",
    filter: "type=Sparkling"
  },
  {
    id: 4,
    name: "All Wines",
    image: "/images/red-wines.jpg",
    description: "Browse our complete selection",
    filter: ""
  },
  // NEW ADDITIONS - THESE WILL REDIRECT TO SPECIAL PAGES
  {
    id: 5,
    name: "Hydrology Water",
    image: "/images/red-wines.jpg",
    description: "Premium mineral-infused waters",
    link: "/hydrology" // Direct link to special page
  },
  {
    id: 6,
    name: "Pentagon Wine",
    image: "/images/red-wines.jpg",
    description: "Exclusive limited-edition collection",
    link: "/pentagon" // Direct link to special page
  }
];

  const awards = [
    { name: "Double Gold", competition: "San Francisco Wine Competition 2024" },
    { name: "95 Points", critic: "Wine Enthusiast" },
    { name: "Best in Class", competition: "Decanter World Wine Awards" },
  ];

  const experiences = [
    {
      name: "Tasting Room",
      image: "https://e1a4c9d0d2f9f737c5e1.ucr.io/https://www.create.xyz/api/ai-img?prompt=Tasting%2520Room",
      description: "Guided tastings of our finest wines",
    },
    {
      name: "Vineyard Tours",
      image: "https://e1a4c9d0d2f9f737c5e1.ucr.io/https://www.create.xyz/api/ai-img?prompt=Vineyard%2520Tours",
      description: "Walk through our historic vineyards",
    },
    {
      name: "Wine Pairing",
      image: "https://e1a4c9d0d2f9f737c5e1.ucr.io/https://www.create.xyz/api/ai-img?prompt=Wine%2520Pairing",
      description: "Chef-curated food and wine experiences",
    },

  ];

  const testimonials = [
    {
      text: "The finest wine experience in the region",
      author: "James W., Wine Club Member",
    },
    {
      text: "Exceptional quality and service",
      author: "Sarah M., Wine Enthusiast",
    },
  ];

  return (
    <>
      <Navbar cart={cart} setIsCartOpen={setIsCartOpen} />
      <div className="min-h-screen bg-white">



        <div className="relative h-[500px] w-full mb-16">
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            style={{
              backgroundImage: "url('/images/Banner.jpeg')",
              backgroundAttachment: "fixed",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            <div className="h-full flex items-center justify-end pr-8 md:pr-16 lg:pr-24">
              <div className="text-right max-w-md">
                <h1 className="text-4xl md:text-5xl font-crimson-text text-black mb-6">
                  The Taste of Nature.
                  <br />
                  Home of Carbernet.
                </h1>
                <button className="bg-[#d4b26a] text-white px-6 py-3 md:px-8 md:py-3 rounded-lg text-lg md:text-xl hover:bg-[#c4a25a] transition duration-300">
                  Shop Our Wines
                </button>
              </div>
            </div>
          </div>
        </div>

        <main className="container px-4 mb-16">

          <section className="mb-16 text-center relative mt-4">
            {/* Header with navigation buttons */}
            <div className="flex justify-center items-center mb-16 relative">
              <div className="text-center">
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex space-x-2">
                  <button className="prev-btn w-10 h-10 rounded-full bg-[#d4b26a] text-white flex items-center justify-center hover:bg-[#c4a25a] transition-colors duration-300 border border-[#c4a25a]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button className="next-btn w-10 h-10 rounded-full bg-[#d4b26a] text-white flex items-center justify-center hover:bg-[#c4a25a] transition-colors duration-300 border border-[#c4a25a]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden">
              <div className="flex transition-transform duration-500 ease-in-out" id="collections-carousel" style={{ width: `${collections.length * 368}px` }}>
                {collections.map((collection, index) => (
                  <div key={index} className="px-4 flex-shrink-0" style={{ width: '352px' }}>
                    <Link 
                      href={collection.link ? collection.link : `/shop?${collection.filter}`} 
                      className="block"
                    >
                      <div className="relative h-[420px] w-[320px] mx-auto group overflow-hidden rounded-full shadow-lg hover:shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
                        <div
                          className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-full scale-110 group-hover:scale-100 transition-transform duration-700"
                          style={{ backgroundImage: `url(${collection.image})` }}
                        ></div>

                        <img
                          src={collection.image}
                          alt={collection.name}
                          className="absolute inset-0 w-full h-full object-cover rounded-full opacity-100 group-hover:opacity-0 transition-all duration-500 scale-100 group-hover:scale-125"
                        />

                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full bg-white/20 border border-white/40 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-white animate-bounce"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10 flex flex-col items-center justify-end text-white p-8 rounded-full translate-y-10 group-hover:translate-y-0 transition-all duration-500">
                          <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 mb-16">
                            <h3 className="text-2xl font-crimson-text tracking-wider mt-2">
                              {collection.name}
                            </h3>
                            <p className="text-sm lg:text-base mb-6 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                              {collection.description}
                            </p>
                            <button className="bg-[#d4b26a] text-white px-6 py-3 rounded-full hover:bg-[#c4a25a] transition-all duration-300 transform scale-90 group-hover:scale-100 shadow-lg hover:shadow-xl">
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

            {/* Collections Carousel */}
            {/* <div className="relative overflow-hidden">
              <div className="flex transition-transform duration-500 ease-in-out" id="collections-carousel" style={{ width: `${collections.length * 368}px` }}>
                {collections.map((collection, index) => (
                  <div key={index} className="px-4 flex-shrink-0" style={{ width: '352px' }}>
                    <Link href={`/shop?${collection.filter}`} className="block">
                      <div className="relative h-[420px] w-[320px] mx-auto group overflow-hidden rounded-full shadow-lg hover:shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
                      
                        <div
                          className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-full scale-110 group-hover:scale-100 transition-transform duration-700"
                          style={{ backgroundImage: `url(${collection.image})` }}
                        ></div>

                     
                        <img
                          src={collection.image}
                          alt={collection.name}
                          className="absolute inset-0 w-full h-full object-cover rounded-full opacity-100 group-hover:opacity-0 transition-all duration-500 scale-100 group-hover:scale-125"
                        />

                       
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full bg-white/20 border border-white/40 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-white animate-bounce"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        </div>

                      
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10 flex flex-col items-center justify-end text-white p-8 rounded-full translate-y-10 group-hover:translate-y-0 transition-all duration-500">
                          <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 mb-16">
                            <h3 className="text-2xl font-crimson-text tracking-wider mt-2">
                              {collection.name}
                            </h3>
                            <p className="text-sm lg:text-base mb-6 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                              {collection.description}
                            </p>
                            <button className="bg-[#d4b26a] text-white px-6 py-3 rounded-full hover:bg-[#c4a25a] transition-all duration-300 transform scale-90 group-hover:scale-100 shadow-lg hover:shadow-xl">
                              Shop Collection
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div> */}

            {/* Carousel Navigation Script */}
            <script dangerouslySetInnerHTML={{
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

                // Handle window resize
                window.addEventListener('resize', () => {
                  visibleCards = Math.floor(window.innerWidth / cardWidth);
                  maxPosition = -(${collections.length} * cardWidth - visibleCards * cardWidth);
                  currentPosition = Math.max(currentPosition, maxPosition);
                  updateCarousel();
                });
              });
            `
            }}
            />
          </section>

          <section className="mb-18">
            <h2 className="text-3xl font-crimson-text mb-8">Best Sallers</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredWines.map((wine) => (
                <div
                  key={wine.id}
                  className="bg-[#f9f9f9] p-6 rounded-lg flex flex-col justify-between transition-shadow duration-300 hover:shadow-lg"
                >
                  {/* Wine Image */}
                  <div className="overflow-hidden rounded-lg mb-4 h-64">
                    <img
                      src={wine.image_url}
                      alt={`Bottle of ${wine.name}`}
                      className="w-full h-full object-contain transition-transform duration-500 hover:scale-110"
                    />
                  </div>

                  {/* Wine Details */}
                  <div className="flex-grow">
                    <h3 className="text-xl font-crimson-text mb-2">{wine.name}</h3>

                    {/* Star Rating */}
                    <div className="flex items-center mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i
                          key={star}
                          className={`${star <= wine.rating ? 'fas fa-star' : 'far fa-star'} text-[#d4b26a] text-sm`}
                        ></i>
                      ))}
                      <span className="ml-1 text-gray-600 text-xs">({wine.rating})</span>
                    </div>
                    <p className="text-gray-500 text-xs mb-2">({wine.reviews} reviews)</p>

                    {/* <p className="text-gray-600 mb-4 line-clamp-2">{wine.description}</p> */}
                  </div>

                  {/* Price and Add to Cart */}
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-medium">R {wine.price}</span>
                    <button
                      className="bg-[#d4b26a] text-white px-4 py-2 rounded-full hover:bg-[#c4a25a] transition-colors duration-300 text-center"
                      onClick={() => setCart([...cart, wine])}
                    >
                      <i className="fas fa-shopping-cart text-xl"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16 mt-16">
            <h2 className="text-3xl font-crimson-text mb-8">Sales</h2>

            <div className="relative">
              {/* Scrollable container */}
              <div className="flex overflow-x-auto gap-6 pb-6 wine-scroller">
                <div className="flex space-x-8 min-w-max">
                  {newReleases.map((wine) => (
                    <div
                      key={wine.id}
                      className="bg-[#f9f9f9] p-6 rounded-lg w-72 min-w-[288px] flex flex-col justify-between transform transition-all duration-300 hover:shadow-lg"
                    >
                      {/* New Release Badge */}
                      <div className="absolute top-4 right-4 bg-[#d4b26a] text-red-500 px-3 py-2 w-20 text-center rounded-full text-m font-medium">
                        Sale
                      </div>

                      {/* Wine Image with hover zoom */}
                      <div className="overflow-hidden rounded-lg mb-4 h-64">
                        <img
                          src={wine.image_url}
                          alt={wine.name}
                          className="w-full h-full object-contain transition-transform duration-500 hover:scale-110"
                        />
                      </div>

                      {/* Wine Details */}
                      <div className="flex-grow">
                        <h3 className="text-xl font-crimson-text mb-2">{wine.name}</h3>

                        {/* Star Rating (if you want to add ratings later) */}
                        {/* <div className="flex items-center mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i 
                            key={star}
                            className={`${star <= wine.rating ? 'fas fa-star' : 'far fa-star'} text-[#d4b26a] text-sm`}
                          ></i>
                        ))}
                      </div> */}

                        <p className="text-gray-600 mb-4 line-clamp-2">{wine.description}</p>
                      </div>

                      {/* Price and Add to Cart */}
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-xl font-medium">R{wine.price}</span>
                        <button
                          className="bg-[#d4b26a] text-white px-4 py-2 rounded-full hover:bg-[#c4a25a] transition-colors duration-300 flex items-center"
                          onClick={() => setCart([...cart, wine])}
                        >
                          <i className="fas fa-shopping-cart text-xl mr-2"></i>

                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gradient fade effects */}
              <div className="absolute top-0 left-0 bottom-0 w-15 bg-gradient-to-r from-white to-transparent pointer-events-none" />
              <div className="absolute top-0 right-0 bottom-0 w-15 bg-gradient-to-l from-white to-transparent pointer-events-none" />
            </div>
          </section>

          <section className="mb-16 p-8 rounded-lg bg-transparent">
            {/* <h2 className="text-3xl font-crimson-text mb-8">Our Services</h2> */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Discover Wine Distributors */}
              <div className="bg-white/30 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:border-[#d4b26a]/50 transition-all duration-300 text-center group">
                <div className="mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#d4b26a] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-crimson-text mb-3 text-black">Discover Wine Distributors</h3>
                <wbr className="text-black/80 mb-5" />Order before 3pm and get your order the next day as standard<wbr />
                <button className="text-[#d4b26a] hover:text-white px-4 py-2 rounded-full border border-[#d4b26a] hover:bg-[#d4b26a] transition-all duration-300 inline-flex items-center mt-2">
                  Learn more
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Card 2: Wine Tasting & Tours */}
              <div className="bg-white/30 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:border-[#d4b26a]/50 transition-all duration-300 text-center group">
                <div className="mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#d4b26a] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-crimson-text mb-3 text-black">Wine Tasting & Tours</h3>
                <wbr className="text-black/80 mb-5" />Handcrafted experiences made with real passion and craftsmanship<wbr />
                <button className="text-[#d4b26a] hover:text-white px-4 py-2 rounded-full border border-[#d4b26a] hover:bg-[#d4b26a] transition-all duration-300 inline-flex items-center mt-2">
                  Book now
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Card 3: Wine for Each Occasion */}
              <div className="bg-white/30 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:border-[#d4b26a]/50 transition-all duration-300 text-center group">
                <div className="mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#d4b26a] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V3m0 5h8m-8 0H4m12 8v6m0-6V9m0 6h6m-6 0H6" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-xl font-crimson-text mb-3 text-black">Wine for Each Occasion</h3>
                <p className="text-black/80 mb-5">For our quality you won&apos;t find better prices anywhere</p>
                <button className="text-[#d4b26a] hover:text-white px-4 py-2 rounded-full border border-[#d4b26a] hover:bg-[#d4b26a] transition-all duration-300 inline-flex items-center mt-2">
                  View selection
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Card 4: Recycled packaging */}
              <div className="bg-white/30 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:border-[#d4b26a]/50 transition-all duration-300 text-center group">
                <div className="mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#d4b26a] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v1a3 3 0 003 3v0a3 3 0 003-3v-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-crimson-text mb-3 text-black">Recycled Packaging</h3>
                <p className="text-black/80 mb-5">100% recycled materials for a sustainable footprint</p>
                <button className="text-[#d4b26a] hover:text-white px-4 py-2 rounded-full border border-[#d4b26a] hover:bg-[#d4b26a] transition-all duration-300 inline-flex items-center mt-2">
                  Our commitment
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-crimson-text mb-8">Winery Experience</h2>

            <div className="relative">
              {/* Scrollable container */}
              <div className="flex overflow-x-auto pb-6 experience-scroller">
                <div className="flex space-x-8 min-w-max">
                  {experiences.map((exp, index) => (
                    <div
                      key={index}
                      className="bg-[#f9f9f9] rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-lg w-80 flex flex-col justify-between"
                    >
                      {/* Image with zoom animation */}
                      <div className="overflow-hidden h-[250px]">
                        <img
                          src={exp.image}
                          alt={exp.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col h-[calc(100%-250px)]">
                        <div className="flex-grow">
                          <h3 className="text-xl font-crimson-text mb-2">{exp.name}</h3>
                          <wbr className="text-gray-600 line-clamp-3" />{exp.description}<wbr />
                        </div>

                        {/* Book Now button */}
                        <button
                          className="bg-[#d4b26a] text-white px-6 py-3 rounded-full hover:bg-[#c4a25a] transition-all duration-300 transform hover:scale-105 text-center w-50 mt-2"
                        >
                          <i className="fas fa-calendar-check mr-2"></i>
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gradient fade effects */}
              <div className="absolute top-0 left-0 bottom-0 w-15 bg-gradient-to-r from-white to-transparent pointer-events-none" />
              <div className="absolute top-0 right-0 bottom-0 w-15 bg-gradient-to-l from-white to-transparent pointer-events-none" />
            </div>


          </section>

          <section className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#f9f9f9] p-6 rounded-lg">
              <h2 className="text-3xl font-crimson-text mb-6">Wine Education</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-crimson-text mb-2">
                    Tasting Notes
                  </h3>
                  <p className="text-gray-600">
                    Learn to identify subtle flavors and aromas
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-crimson-text mb-2">Food Pairing</h3>
                  <p className="text-gray-600">
                    Perfect wine selections for any meal
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-crimson-text mb-2">Storage Tips</h3>
                  <p className="text-gray-600">
                    Optimal conditions for aging wines
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1a] text-white p-6 rounded-lg">
              <h2 className="text-3xl font-crimson-text mb-6">
                Newsletter Signup
              </h2>
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
                  className="w-full px-4 py-2 rounded bg-white text-black"
                />
                <button
                  type="submit"
                  className="w-full bg-[#d4b26a] text-white px-4 py-2 rounded hover:bg-[#c4a25a]"
                >
                  Subscribe Now
                </button>
              </form>
            </div>
          </section>

          <section className="mb-16 text-center mt-16">
            <p>Featured In</p>
            {/* <h2 className="text-3xl font-crimson-text mb-8">Featured In</h2> */}
            <div className="grid grid-cols-2 md:grid-cols-8 items-center mt-8 ml-16">
              <img
                src="./clients/carpe.jpg"
                alt="Carpe Logo"
                className="h-12 object-contain"
              />
              <img
                src="./clients/Appto.jpeg"
                alt="Appto Logo"
                className="h-12 object-contain"
              /> <img
                src="./clients/davinci.png"
                alt="Davinci Logo"
                className="h-12 object-contain"
              /> <img
                src="./clients/mabu.jpg"
                alt="Mabu Logo"
                className="h-12 object-contain"
              /> <img
                src="./clients/mela.png"
                alt="Mela Logo"
                className="h-12 object-contain"
              />
              <img
                src="./clients/oldrock.jpg"
                alt="Oldrock Logo"
                className="h-12 object-contain"
              />
              <img
                src="./clients/spar.jpeg"
                alt="Spar Logo"
                className="h-12 object-contain"
              />
              <img
                src="./clients/life-grand-cafe.jpg"
                alt="Life Grand Cafe Logo"
                className="h-12 object-contain"
              />
              
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-crimson-text mb-8">
              What Our Customers Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-[#f9f9f9] p-6 rounded-lg">
                  <i className="fas fa-quote-left text-[#d4b26a] text-2xl mb-4"></i>
                  <p className="text-lg mb-4">{testimonial.text}</p>
                  <p className="text-gray-600">- {testimonial.author}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-crimson-text mb-8">Follow Us on Instagram</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Replace YOUR_INSTAGRAM_USERNAME with your actual Instagram handle */}
              <a
                href="https://www.instagram.com/YOUR_INSTAGRAM_USERNAME/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
              >
                <img
                  src="https://e1a4c9d0d2f9f737c5e1.ucr.io/https://www.create.xyz/api/ai-img?prompt=Vineyard%2520sunset"
                  alt="Vineyard sunset"
                  className="w-full h-[200px] object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
                  <i className="fab fa-instagram text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                </div>
              </a>

              <a
                href="https://www.instagram.com/YOUR_INSTAGRAM_USERNAME/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
              >
                <img
                  src="https://e1a4c9d0d2f9f737c5e1.ucr.io/https://www.create.xyz/api/ai-img?prompt=Wine%2520tasting%2520event"
                  alt="Wine tasting event"
                  className="w-full h-[200px] object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
                  <i className="fab fa-instagram text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                </div>
              </a>

              <a
                href="https://www.instagram.com/YOUR_INSTAGRAM_USERNAME/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
              >
                <img
                  src="https://e1a4c9d0d2f9f737c5e1.ucr.io/https://www.create.xyz/api/ai-img?prompt=Barrel%2520room"
                  alt="Barrel room"
                  className="w-full h-[200px] object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
                  <i className="fab fa-instagram text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                </div>
              </a>

              <a
                href="https://www.instagram.com/YOUR_INSTAGRAM_USERNAME/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
              >
                <img
                  src="https://e1a4c9d0d2f9f737c5e1.ucr.io/https://www.create.xyz/api/ai-img?prompt=Harvest%2520season"
                  alt="Harvest season"
                  className="w-full h-[200px] object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
                  <i className="fab fa-instagram text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                </div>
              </a>
            </div>
          </section>

          {/* <section className="mb-16">
            <h2 className="text-3xl font-crimson-text mb-8">Follow Us on Instagram</h2>

            <div className="relative">
              
              <div className="flex overflow-x-auto pb-6 instagram-scroller snap-x">
                <div className="flex space-x-4 min-w-max">
                  {[
                    "Vineyard sunset",
                    "Wine tasting event",
                    "Barrel room",
                    "Harvest season",
                    "Wine pairing dinner",
                    "Vineyard tour",
                    "Wine bottling",
                    "Cellar collection",
                    "Sunset grapes",
                    "Winery architecture",
                    "Vintage barrels",
                    "Wine club event"
                  ].map((prompt, index) => (
                    <div key={index} className="snap-center">
                      <div className="overflow-hidden rounded-lg w-[200px] h-[200px]">
                        <img
                          src={`https://e1a4c9d0d2f9f737c5e1.ucr.io/https://www.create.xyz/api/ai-img?prompt=${encodeURIComponent(prompt)}`}
                          alt={prompt}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

             
              <div className="absolute top-0 left-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent pointer-events-none" />
              <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent pointer-events-none" />
            </div>

          
          </section> */}



        </main>

        {isCartOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-crimson-text">Shopping Cart</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              {cart.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto">
                    {cart.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center mb-4 border-b pb-4"
                      >
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="ml-4 flex-1">
                          <h3 className="font-crimson-text">{item.name}</h3>
                          <p className="text-gray-600">R{item.price}</p>
                        </div>
                        <button
                          onClick={() => {
                            const newCart = [...cart];
                            newCart.splice(index, 1);
                            setCart(newCart);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-4">
                      <span>Total:</span>
                      <span>
                        R
                        {cart
                          .reduce((sum, item) => sum + item.price, 0)
                          .toFixed(2)}
                      </span>
                    </div>
                    <button
                      className="w-full bg-[#d4b26a] text-white py-2 rounded hover:bg-[#c4a25a]"
                      onClick={() => setCheckoutStep(1)}
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default MainComponent;