"use client";
import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useIsMobile } from '../hooks/useIsMobile';
import { useTheme } from '../hooks/useTheme';
import AuthModal from './auth/authModal'; // Make sure this path is correct

const Navbar = ({ cart = [], setIsCartOpen }) => {
  const router = useRouter();
  // Destructure only what you need
  const {
    user,
    isAuthenticated,
    isAdmin,
    isWebAdmin,
    logout
  } = useAuth();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { theme, toggleTheme } = useTheme();

  // State management for UI
  const [uiState, setUiState] = useState({
    isMenuOpen: false,
    isProfileOpen: false,
    activeModal: null
  });

  // Navigation links configuration
  const commonNavLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/main/shop' },
    { name: 'Our Brand', href: '/main/our-brand' },
    { name: 'Blog', href: '/main/blog' },
    { name: 'Events', href: '/main/events' },
    { name: 'Education', href: '/main/education' },
    { name: 'Contact', href: '/main/contact' },
  ];

  const adminLinks = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Products', href: '/admin/products' }
  ];

  const webadminLinks = [
    { name: 'System Settings', href: '/webAdmin/settings' },
    { name: 'Users', href: '/webAdmin/users' }
  ];

  // Combined navigation links
  const navLinks = useMemo(() => {
    const links = [...commonNavLinks];
    if (isAdmin) links.push(...adminLinks);
    if (isWebAdmin) links.push(...webadminLinks);
    return links;
  }, [isAdmin, isWebAdmin]);

  // UI state handlers
  const toggleState = (key) => {
    setUiState(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const closeAll = () => {
    setUiState({
      isMenuOpen: false,
      isProfileOpen: false,
      activeModal: null
    });
  };

  const handleLogout = () => {
    logout();
    closeAll();
    router.push('/');
  };

  const toggleAuthModal = () => {
    setUiState(prev => ({
      ...prev,
      activeModal: 'auth',
      isProfileOpen: false
    }));
  };

  return (
    <header className="navbar sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-crimson-text hover:text-[#d4b26a] mr-4">
          <Image
            src="/images/Math&Co.png"
            alt="Math&Co Logo"
            width={100}
            height={80}
            className="w-25 h-20"
          />
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="flex-1 justify-center flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-[#d4b26a] transition-colors ${pathname === link.href ? 'text-[#d4b26a]' : ''
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}

        {/* Right-aligned Icons */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            className="p-2 rounded-full hover:bg-gray-700"
          >
            {theme === 'light' ? (
              <i className="fas fa-moon text-xl"></i>
            ) : (
              <i className="fas fa-sun text-xl"></i>
            )}
          </button>

          {/* Cart Icon (hidden for admin) */}
          {!isAdmin && (
            <button
              className="relative hover:text-[#d4b26a] transition-colors"
              onClick={() => setIsCartOpen(true)}
              aria-label="Open cart"
            >
              <i className="fas fa-shopping-cart text-xl"></i>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#d4b26a] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cart.length}
                </span>
              )}
            </button>
          )}

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleState('isProfileOpen')}
              className="hover:text-[#d4b26a] transition-colors"
              aria-label="User profile"
              aria-expanded={uiState.isProfileOpen}
            >
              <i className="fas fa-user text-xl"></i>
            </button>

            {uiState.isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg py-1 z-50">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={closeAll}
                    >
                      <i className="fas fa-user-circle mr-2"></i> Profile
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin/dashboard"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={closeAll}
                      >
                        <i className="fas fa-tachometer-alt mr-2"></i> Admin
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i> Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={toggleAuthModal}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    <i className="fas fa-sign-in-alt mr-2"></i> Login
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={() => toggleState('isMenuOpen')}
              className="text-white hover:text-[#d4b26a] transition-colors"
              aria-label="Toggle menu"
              aria-expanded={uiState.isMenuOpen}
            >
              {uiState.isMenuOpen ? (
                <i className="fas fa-times text-xl"></i>
              ) : (
                <i className="fas fa-bars text-xl"></i>
              )}
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobile && uiState.isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#2a2a2a] px-4 py-2">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-2 hover:text-[#d4b26a] transition-colors ${pathname === link.href ? 'text-[#d4b26a]' : ''
                    }`}
                  onClick={closeAll}
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-2 border-t border-gray-700">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/profile"
                      className="block py-2 hover:text-[#d4b26a] transition-colors"
                      onClick={closeAll}
                    >
                      <i className="fas fa-user-circle mr-2"></i> Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left py-2 hover:text-[#d4b26a] transition-colors"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i> Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      toggleAuthModal();
                      closeAll();
                    }}
                    className="block w-full text-left py-2 hover:text-[#d4b26a] transition-colors"
                  >
                    <i className="fas fa-sign-in-alt mr-2"></i> Login
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      {uiState.activeModal === 'auth' && (
        <AuthModal
          isOpen={true}
          onClose={closeAll}
        />
      )}
    </header>
  );
};

export default Navbar;