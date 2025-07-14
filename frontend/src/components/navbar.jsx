"use client";
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useIsMobile } from "../hooks/useIsMobile";
import { useTheme } from "../hooks/useTheme";
// AuthModal might still be used for other authentication flows if applicable,
// but it won't be triggered by the Login/Register links directly anymore.
// If AuthModal is only for Login/Register, you can remove this import entirely.
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

  const { user, isAuthenticated, isAdmin, isWebAdmin, logout } = useAuth();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { theme, toggleTheme } = useTheme();

  const [uiState, setUiState] = useState({
    isMenuOpen: false,
    isProfileOpen: false,
    // activeModal: null, // Removed activeModal state since AuthModal is no longer triggered by Login/Register directly
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
      // activeModal: null, // Removed activeModal from closeAll
    });
  };

  const handleLogout = () => {
    logout();
    closeAll();
    router.push("/");
  };

  // Removed toggleAuthModal as we are no longer using it for Login/Register links

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
          {/* Theme Toggle (commented out in your original code, left as is) */}
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
                    <button
                      onClick={handleLogout}
                      className="navbar__dropdown-item"
                    >
                      <i className="fas fa-sign-out-alt navbar__dropdown-icon"></i>{" "}
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    {/* Direct link to Register Page */}
                    <Link
                      href="../main/register" // Assuming your register page is at /register
                      className="navbar__dropdown-item"
                      onClick={closeAll} // Close dropdown after clicking
                    >
                      <i className="fas fa-user-plus navbar__dropdown-icon"></i>{" "}
                      Register
                    </Link>
                    {/* Direct link to Login Page */}
                    <Link
                      href="../main/login" // Assuming your login page is at /login
                      className="navbar__dropdown-item"
                      onClick={closeAll} // Close dropdown after clicking
                    >
                      <i className="fas fa-sign-in-alt navbar__dropdown-icon"></i>{" "}
                      Login
                    </Link>
                  </>
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
                      href="/main/profile"
                      className="navbar__mobile-menu-item"
                      onClick={closeAll}
                    >
                      <i className="fas fa-user-circle navbar__mobile-menu-icon"></i>{" "}
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="navbar__mobile-menu-item"
                    >
                      <i className="fas fa-sign-out-alt navbar__mobile-menu-icon"></i>{" "}
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    {/* Direct link to Register Page in Mobile */}
                    <Link
                      href="../main/register" // Assuming your register page is at /register
                      className="navbar__mobile-menu-item"
                      onClick={closeAll} // Close dropdown after clicking
                    >
                      <i className="fas fa-user-plus navbar__mobile-menu-icon"></i>{" "}
                      Register
                    </Link>
                    {/* Direct link to Login Page in Mobile */}
                    <Link
                      href="../main/login" // Assuming your login page is at /login
                      className="navbar__mobile-menu-item"
                      onClick={closeAll} // Close dropdown after clicking
                    >
                      <i className="fas fa-sign-in-alt navbar__mobile-menu-icon"></i>{" "}
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal - if it's still used for other flows, keep it. Otherwise, remove it. */}
      {/* {uiState.activeModal === "auth" && (
        <AuthModal isOpen={true} onClose={closeAll} />
      )} */}
    </header>
  );
};

export default Navbar;
