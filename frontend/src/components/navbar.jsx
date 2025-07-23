"use client";
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext"; // Assuming this context integrates with Firebase Auth
import { useIsMobile } from "../hooks/useIsMobile";
import { useTheme } from "../hooks/useTheme";
import AuthModal from "./auth/authModal";
import "./styles.css";

const Navbar = ({ cart = [], setIsCartOpen }) => {
  const router = useRouter();
  const [lastScrollY, setLastScrollY] = useState(0);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 10);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Assuming useAuth now provides user, isAuthenticated, isAdmin, isWebAdmin, and logout directly from Firebase
  const { user, isAuthenticated, isAdmin, isWebAdmin, logout } = useAuth();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { theme, toggleTheme } = useTheme();

  const [uiState, setUiState] = useState({
    isMenuOpen: false,
    isProfileOpen: false,
    activeModal: null, // Used for showing auth modal
  });

  const commonNavLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/main/shop" },
    { name: "Our Brand", href: "/main/our-brand" },
    { name: "Events", href: "/main/events" },
    { name: "More Beverages", href: "/main/more-beverages" },
    { name: "Contact", href: "/main/contact" },
  ];

  const adminLinks = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Products", href: "/admin/products" },
  ];

  const webadminLinks = [
    { name: "System Settings", href: "/webAdmin/settings" },
    { name: "Users", href: "/webAdmin/users" },
  ];

  const navLinks = useMemo(() => {
    const links = [...commonNavLinks];
    if (isAdmin) links.push(...adminLinks);
    if (isWebAdmin) links.push(...webadminLinks);
    return links;
  }, [isAdmin, isWebAdmin]);

  const toggleState = (key) => {
    setUiState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const closeAll = () => {
    setUiState({
      isMenuOpen: false,
      isProfileOpen: false,
      activeModal: null,
    });
  };

  const handleLogout = async () => {
    try {
      await logout(); // Call the Firebase logout function from AuthContext
      closeAll();
      router.push("/");
    } catch (error) {
      console.error("Failed to log out:", error);
      // Optionally show an error message to the user
    }
  };

  const toggleAuthModal = (modalType = "auth") => {
    setUiState((prev) => ({
      ...prev,
      activeModal: prev.activeModal === modalType ? null : modalType, // Toggle behavior
      isProfileOpen: false, // Close profile dropdown when opening modal
    }));
  };

  return (
    <header
      className={`navbar ${visible ? "navbar--visible" : "navbar--hidden"} ${
        scrolled ? "navbar--scrolled" : ""
      } ${theme === "light" ? "light-theme" : "dark-theme"}`}
    >
      <nav className="navbar__container">
        {/* Logo */}
        <Link href="/" className="navbar__logo-link">
          <Image
            src="/images/Math&Co.png"
            alt="Math&Co Logo"
            width={100}
            height={80}
            className="navbar__logo-image"
          />
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="navbar__links">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`navbar__link ${
                  pathname === link.href ? "navbar__link--active" : ""
                }`}
              >
                {link.name}
                <span className="navbar__link-underline"></span>
              </Link>
            ))}
          </div>
        )}

        {/* Right-aligned Icons */}
        <div className="navbar__controls">
          {/* Theme Toggle (commented out as in original) */}
          {/* <button
            onClick={toggleTheme}
            aria-label={`Switch to ${
              theme === "light" ? "dark" : "light"
            } mode`}
            className="navbar__theme-toggle"
          >
            {theme === "light" ? (
              <i className="fas fa-moon navbar__theme-icon"></i>
            ) : (
              <i className="fas fa-sun navbar__theme-icon"></i>
            )}
          </button> */}

          {/* Cart Icon */}
          {!isAdmin && (
            <button
              className="navbar__cart-button"
              onClick={() => setIsCartOpen(true)}
              aria-label="Open cart"
            >
              <i className="fas fa-shopping-cart navbar__cart-icon"></i>
              {cart.length > 0 && (
                <span className="navbar__cart-badge">{cart.length}</span>
              )}
            </button>
          )}

          {/* Profile Dropdown */}
          <div className="navbar__profile-dropdown">
            <button
              onClick={() => toggleState("isProfileOpen")}
              className="navbar__profile-button"
              aria-label="User profile"
              aria-expanded={uiState.isProfileOpen}
            >
              <i className="fas fa-user navbar__profile-icon"></i>
            </button>

            {uiState.isProfileOpen && (
              <div className="navbar__dropdown-menu">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/main/profile"
                      className="navbar__dropdown-item"
                      onClick={closeAll}
                    >
                      <i className="fas fa-user-circle navbar__dropdown-icon"></i>{" "}
                      Profile
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin/dashboard"
                        className="navbar__dropdown-item"
                        onClick={closeAll}
                      >
                        <i className="fas fa-tachometer-alt navbar__dropdown-icon"></i>{" "}
                        Admin
                      </Link>
                    )}
                    {isWebAdmin && ( // Added Web Admin link here too for desktop dropdown
                      <Link
                        href="/webAdmin/settings"
                        className="navbar__dropdown-item"
                        onClick={closeAll}
                      >
                        <i className="fas fa-cogs navbar__dropdown-icon"></i>{" "}
                        Web Admin
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="navbar__dropdown-item"
                    >
                      <i className="fas fa-sign-out-alt navbar__dropdown-icon"></i>{" "}
                      Logout
                    </button>
                  </>
                ) : (
                  // Firebase login typically uses a modal or a dedicated page.
                  // This button will trigger the AuthModal.
                  <button
                    onClick={() => toggleAuthModal()}
                    className="navbar__dropdown-item"
                  >
                    <i className="fas fa-sign-in-alt navbar__dropdown-icon"></i>{" "}
                    Login
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={() => toggleState("isMenuOpen")}
              className="navbar__mobile-menu-button"
              aria-label="Toggle menu"
              aria-expanded={uiState.isMenuOpen}
            >
              {uiState.isMenuOpen ? (
                <i className="fas fa-times navbar__mobile-menu-icon"></i>
              ) : (
                <i className="fas fa-bars navbar__mobile-menu-icon"></i>
              )}
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobile && uiState.isMenuOpen && (
          <div className="navbar__mobile-menu">
            <div className="navbar__mobile-menu-content">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`navbar__mobile-link ${
                    pathname === link.href ? "navbar__mobile-link--active" : ""
                  }`}
                  onClick={closeAll}
                >
                  {link.name}
                </Link>
              ))}

              <div className="navbar__mobile-menu-footer">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="../app/main/profile"
                      className="navbar__mobile-menu-item"
                      onClick={closeAll}
                    >
                      <i className="fas fa-user-circle navbar__mobile-menu-icon"></i>{" "}
                      Profile
                    </Link>
                    {isAdmin && ( // Added Admin link to mobile menu
                      <Link
                        href="/admin/dashboard"
                        className="navbar__mobile-menu-item"
                        onClick={closeAll}
                      >
                        <i className="fas fa-tachometer-alt navbar__mobile-menu-icon"></i>{" "}
                        Admin
                      </Link>
                    )}
                    {isWebAdmin && ( // Added Web Admin link to mobile menu
                      <Link
                        href="/webAdmin/settings"
                        className="navbar__mobile-menu-item"
                        onClick={closeAll}
                      >
                        <i className="fas fa-cogs navbar__mobile-menu-icon"></i>{" "}
                        Web Admin
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="navbar__mobile-menu-item"
                    >
                      <i className="fas fa-sign-out-alt navbar__mobile-menu-icon"></i>{" "}
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      toggleAuthModal();
                      closeAll();
                    }}
                    className="navbar__mobile-menu-item"
                  >
                    <i className="fas fa-sign-in-alt navbar__mobile-menu-icon"></i>{" "}
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      {uiState.activeModal === "auth" && (
        <AuthModal isOpen={true} onClose={closeAll} />
      )}
    </header>
  );
};

export default Navbar;
