"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import ProductModal from "../../components/productModal";
import Cart from "../../components/cart";
import { toast } from 'react-toastify';

function ShopContent({ cart, setCart, isCartOpen, setIsCartOpen }) {
  const searchParams = useSearchParams();
  const [selectedWine, setSelectedWine] = useState(null);

  const [wines] = useState([
    {
      id: 1,
      name: "MCC Nectar",
      price: 604.35,
      case_image: "./images/MCC-Nectar-Box.png",
      case_price: 3626.10,
      image_url: "/images/mcc-nectar.png",
      taste: "Nougat and orange blossom. Sweet profile with a classical taste of a Champagne.",
      type: "MCC",
    },
    {
      id: 2,
      name: "Merlot",
      price: 455.78,
      case_image: "./images/Merlot-Box.png",
      image_url: "/images/merlot.png",
      taste: "Elegant white wine with notes of apple and vanilla",
      type: "White",
    },
    {
      id: 3,
      name: "MCC-Brut Rosé",
      price: 559.99,
      image_url: "/images/mcc-brut-rose.png",
      taste: "Delicate and fruity. Medley of red fruit and coco.",
      type: "MCC",
    },
    {
      id: 4,
      name: "MCC-Brut",
      price: 559.99,
      image_url: "/images/mcc-brut.png",
      taste: "Delicious lime and grapefruit with beautiful minerality and a soft acidity.",
      type: "Red",
    },
    
  ]);

  const [filters, setFilters] = useState({
    type: searchParams.get("type") || "all",
    priceRange: "all",
    sort: "name",
  });

  useEffect(() => {
    const type = searchParams.get("type");
    if (type) {
      setFilters((prev) => ({ ...prev, type }));
    }
  }, [searchParams]);

  const filteredWines = wines
    .filter((wine) => {
      if (filters.type !== "all" && wine.type !== filters.type) return false;
      if (filters.priceRange === "under50" && wine.price >= 50) return false;
      if (filters.priceRange === "50to100" && (wine.price < 50 || wine.price > 100)) return false;
      if (filters.priceRange === "over100" && wine.price <= 100) return false;
      return true;
    })
    .sort((a, b) => {
      if (filters.sort === "name") return a.name.localeCompare(b.name);
      if (filters.sort === "priceLow") return a.price - b.price;
      if (filters.sort === "priceHigh") return b.price - a.price;
      return 0;
    });

    const addToCart = (item) => {
      setCart(prevCart => {
        // Check if item already exists in cart
        const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === item.id);
        
        if (existingItemIndex >= 0) {
          // If exists, update quantity
          const newCart = [...prevCart];
          newCart[existingItemIndex] = {
            ...newCart[existingItemIndex],
            quantity: (newCart[existingItemIndex].quantity || 1) + 1
          };
          return newCart;
        } else {
          // If new, add to cart with quantity 1
          return [...prevCart, { ...item, quantity: 1 }];
        }
      });
    
      // Show toast after state update
      const existingItem = cart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        toast.success(
          <div className="flex items-center">
            <img src={item.image_url} alt={item.name} className="w-12 h-12 object-contain mr-3"/>
            <div>
              <p className="font-medium">Added another {item.name}</p>
              <p className="text-sm">Total: {(existingItem.quantity || 1) + 1}</p>
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
      } else {
        toast.success(
          <div className="flex items-center">
            <img src={item.image_url} alt={item.name} className="w-12 h-12 object-contain mr-3"/>
            <div>
              <p className="font-medium">{item.name} added to cart</p>
              <p className="text-sm">R{item.price.toFixed(2)}</p>
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
      }
    };

  return (
    <>
      <div className="w-full bg-gradient-to-r from-[#d4b26a] to-black text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block relative">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 relative z-10">
              Curated <span className="text-[#d4b26a]">Selection</span>
            </h1>
            <div className="absolute -bottom-2 left-0 right-0 h-3 bg-amber-100/70 z-0"></div>
          </div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mt-4">
            Discover exceptional wines crafted with passion - each bottle tells
            a story of terroir and tradition
          </p>
          <div className="w-24 h-1 bg-[#d4b26a] mx-auto mt-6 rounded-full"></div>
        </div>
      </div>

      <div className="min-h-screen bg-white">
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <h1 className="text-3xl font-crimson-text mb-4 md:mb-0">
              {filters.type === "all"
                ? "Our Wines"
                : `${filters.type === "MCC" ? "Sparkling" : filters.type} Wines`}
            </h1>

            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select
                  className={`px-4 py-2 rounded-full text-sm transition-colors appearance-none pr-8 bg-gradient-to-r from-[#d4b26a] to-black text-white`}
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                  <option value="all">All Types</option>
                  <option value="Red">Red Wine</option>
                  <option value="White">White Wine</option>
                  <option value="MCC">Sparkling</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <i className="fas fa-chevron-down text-s text-white"></i>
                </div>
              </div>

              <div className="relative">
                <select
                  className={`px-4 py-2 rounded-full text-sm transition-colors appearance-none pr-8 bg-gradient-to-r from-[#d4b26a] to-black text-white`}
                  value={filters.priceRange}
                  onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                >
                  <option value="all">All Prices</option>
                  <option value="under50">Under R50</option>
                  <option value="50to100">R50 - R100</option>
                  <option value="over100">Over R100</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <i className="fas fa-chevron-down text-s text-white"></i>
                </div>
              </div>

              <div className="relative">
                <select
                  className={`px-4 py-2 rounded-full text-sm transition-colors appearance-none pr-4 bg-gradient-to-r from-[#d4b26a] to-black text-white`}
                  value={filters.sort}
                  onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                >
                  <option value="name">Sort by Name</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <i className="fas fa-chevron-down text-s text-white"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWines.map((wine) => (
              <div
                key={wine.id}
                className="bg-[#f9f9f9] p-6 rounded-lg flex flex-col justify-between hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedWine(wine)}
              >
                <img
                  src={wine.image_url}
                  alt={`Bottle of ${wine.name}`}
                  className="w-full h-64 object-contain rounded-lg mb-4 hover:scale-105 transition-transform"
                />
                <h3 className="text-xl font-crimson-text mb-2">{wine.name}</h3>
                <p className="text-gray-600 mb-4">{wine.taste}</p>
                <div className="flex justify-between items-center mt-4">
                  <div>
                    <span className="text-xl">R{wine.price.toFixed(2)}</span>
                    {wine.case_price && (
                      <p className="text-xs text-gray-500">
                        Case: R{wine.case_price.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <button
                    className="bg-[#d4b26a] text-white px-4 py-2 rounded hover:bg-[#c4a25a] transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(wine);
                    }}
                  >
                    <i className="fas fa-shopping-cart text-xl"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

        {selectedWine && (
          <ProductModal
            product={selectedWine}
            onClose={() => setSelectedWine(null)}
            addToCart={addToCart}
          />
        )}

        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          setCart={setCart}
        />
      </div>
    </>
  );
}

export default function ShopPage() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

  return (
    <>
      <Navbar cart={cart} setIsCartOpen={setIsCartOpen} />
      <Suspense fallback={<div className="text-center py-20">Loading shop...</div>}>
        <ShopContent
          cart={cart}
          setCart={setCart}
          isCartOpen={isCartOpen}
          setIsCartOpen={setIsCartOpen}
        />
      </Suspense>
      <Footer />
    </>
  );
}