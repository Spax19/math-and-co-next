"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Navbar from "../../../components/navbar";
import Footer from "../../../components/footer";
import ProductModal from "../../../components/productModal";
import Cart from "../../../components/cart";
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
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex >= 0) {
        const newCart = [...prevCart];
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          quantity: (newCart[existingItemIndex].quantity || 1) + 1
        };
        return newCart;
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });

    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      toast.success(
        <div className="toast-content">
          <img src={item.image_url} alt={item.name} className="toast-image"/>
          <div>
            <p className="toast-title">Added another {item.name}</p>
            <p className="toast-text">Total: {(existingItem.quantity || 1) + 1}</p>
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
        <div className="toast-content">
          <img src={item.image_url} alt={item.name} className="toast-image"/>
          <div>
            <p className="toast-title">{item.name} added to cart</p>
            <p className="toast-text">R{item.price.toFixed(2)}</p>
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
      <div className="shop-hero">
        <div className="shop-hero-content">
          <div className="shop-title-container">
            <h1 className="shop-title">
              Curated <span className="shop-title-highlight">Selection</span>
            </h1>
            <div className="shop-title-underline"></div>
          </div>
          <p className="shop-subtitle">
            Discover exceptional wines crafted with passion - each bottle tells
            a story of terroir and tradition
          </p>
          <div className="shop-divider"></div>
        </div>
      </div>

      <div className="shop-page">
        <main className="shop-main">
          <div className="shop-header">
            <h1 className="shop-heading">
              {filters.type === "all"
                ? "Our Wines"
                : `${filters.type === "MCC" ? "Sparkling" : filters.type} Wines`}
            </h1>

            <div className="filter-container">
              <div className="filter-select">
                <select
                  className="filter-dropdown"
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                  <option value="all">All Types</option>
                  <option value="Red">Red Wine</option>
                  <option value="White">White Wine</option>
                  <option value="MCC">Sparkling</option>
                </select>
                <div className="dropdown-icon">
                  <i className="fas fa-chevron-down"></i>
                </div>
              </div>

              <div className="filter-select">
                <select
                  className="filter-dropdown"
                  value={filters.priceRange}
                  onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                >
                  <option value="all">All Prices</option>
                  <option value="under50">Under R50</option>
                  <option value="50to100">R50 - R100</option>
                  <option value="over100">Over R100</option>
                </select>
                <div className="dropdown-icon">
                  <i className="fas fa-chevron-down"></i>
                </div>
              </div>

              <div className="filter-select">
                <select
                  className="filter-dropdown"
                  value={filters.sort}
                  onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                >
                  <option value="name">Sort by Name</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                </select>
                <div className="dropdown-icon">
                  <i className="fas fa-chevron-down"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="wine-grid">
            {filteredWines.map((wine) => (
              <div
                key={wine.id}
                className="wine-card"
                onClick={() => setSelectedWine(wine)}
              >
                <img
                  src={wine.image_url}
                  alt={`Bottle of ${wine.name}`}
                  className="wine-image"
                />
                <h3 className="wine-name">{wine.name}</h3>
                <p className="wine-taste">{wine.taste}</p>
                <div className="wine-footer">
                  <div>
                    <span className="wine-price">R{wine.price.toFixed(2)}</span>
                    {wine.case_price && (
                      <p className="case-price">
                        Case: R{wine.case_price.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <button
                    className="add-to-cart-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(wine);
                    }}
                  >
                    <i className="fas fa-shopping-cart"></i>
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
      <Suspense fallback={<div className="loading-message">Loading shop...</div>}>
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