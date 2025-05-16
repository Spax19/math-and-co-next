"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import AuthModal from './auth';
import { useRouter } from 'next/navigation';

const Navbar = ({ cart = [], setIsCartOpen }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const router = useRouter();

    // Toggle functions
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

    const toggleAuthModal = () => {
        setIsAuthModalOpen(!isAuthModalOpen);
        setIsProfileOpen(false);
    };

    useEffect(() => {
        setHasMounted(true);
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Check for user role in localStorage or from your auth context
        const role = localStorage.getItem('userRole'); // Replace with your actual auth check
        if (role) setUserRole(role);

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Common nav links for all users
    const commonNavLinks = [
        { name: 'Home', href: '/' },
        { name: 'Shop', href: '/shop' },
        { name: 'Our Brand', href: '/our-brand' },
        { name: 'Blog', href: '/blog' },
        { name: 'Events', href: '/events' },
        { name: 'Education', href: '/education' },
        { name: 'Contact', href: '/contact' },
    ];

    // Additional nav links for specific roles
    const getAdditionalNavLinks = () => {
        switch(userRole) {
            case 'admin':
                return [
                    { name: 'Admin Dashboard', href: '/admin/dashboard' },
                    { name: 'Manage Products', href: '/admin/products' }
                ];
            case 'webadmin':
                return [
                    { name: 'System Settings', href: '/webadmin/settings' },
                    { name: 'User Management', href: '/webadmin/users' }
                ];
            default:
                return [];
        }
    };

    // Combine common links with role-specific links
    const navLinks = [...commonNavLinks, ...getAdditionalNavLinks()];

    // Handle login/logout
    const handleAuthSuccess = (role) => {
        setUserRole(role);
        setIsAuthModalOpen(false);
    };

    const handleLogout = () => {
        // Clear user role and any auth tokens
        setUserRole(null);
        localStorage.removeItem('userRole'); // Replace with your actual logout logic
        setIsProfileOpen(false);
        router.push('/');
    };

    // Create a button component that's resistant to extension modifications
    const ResistantButton = ({ children, onClick, className, ...props }) => {
        const [isClient, setIsClient] = useState(false);
        
        useEffect(() => {
            setIsClient(true);
        }, []);
        
        return (
            <button
                onClick={onClick}
                className={className}
                suppressHydrationWarning
                {...props}
            >
                {isClient ? children : null}
            </button>
        );
    };

    // Check if user is admin or webadmin
    const isAdminUser = userRole === 'admin' || userRole === 'webadmin';

    return (
        <>
            <Head>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
                />
            </Head>

            <header className="bg-black text-white sticky top-0 z-50">
                <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
                    {/* Logo - Left aligned */}
                    <Link href="/" className="text-2xl font-crimson-text hover:text-[#d4b26a] mr-4">
                        <img
                            src="./images/Math&Co.png"
                            alt="Math&Co Logo"
                            className="w-25 h-20"
                        />
                    </Link>

                    {/* Centered Navigation Links (Desktop) */}
                    <div className="hidden md:flex flex-1 justify-center">
                        <div className="flex space-x-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="hover:text-[#d4b26a] transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right-aligned Icons */}
                    <div className="flex items-center space-x-4">
                        {/* Only show cart icon if user is not admin or webadmin */}
                        {!isAdminUser && (
                            <ResistantButton
                                className="relative hover:text-[#d4b26a] transition-colors"
                                onClick={() => setIsCartOpen(true)}
                            >
                                <i className="fas fa-shopping-cart text-xl"></i>
                                {cart.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-[#d4b26a] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                        {cart.length}
                                    </span>
                                )}
                            </ResistantButton>
                        )}

                        <div className="relative">
                            <ResistantButton
                                onClick={toggleProfile}
                                className="hover:text-[#d4b26a] transition-colors"
                            >
                                <i className="fas fa-user text-xl"></i>
                            </ResistantButton>

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white text-[#1a1a1a] rounded-md shadow-lg py-1 z-50">
                                    {userRole ? (
                                        <>
                                            <Link
                                                href="/profile"
                                                className="block px-4 py-2 hover:bg-gray-100"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <i className="fas fa-user-circle mr-2"></i> My Profile
                                            </Link>
                                            {userRole === 'admin' && (
                                                <Link
                                                    href="/admin/dashboard"
                                                    className="block px-4 py-2 hover:bg-gray-100"
                                                    onClick={() => setIsProfileOpen(false)}
                                                >
                                                    <i className="fas fa-tachometer-alt mr-2"></i> Admin Panel
                                                </Link>
                                            )}
                                            {userRole === 'webadmin' && (
                                                <Link
                                                    href="/webadmin/dashboard"
                                                    className="block px-4 py-2 hover:bg-gray-100"
                                                    onClick={() => setIsProfileOpen(false)}
                                                >
                                                    <i className="fas fa-cogs mr-2"></i> Web Admin
                                                </Link>
                                            )}
                                            <Link
                                                href="/settings"
                                                className="block px-4 py-2 hover:bg-gray-100"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <i className="fas fa-cog mr-2"></i> Settings
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                            >
                                                <i className="fas fa-sign-out-alt mr-2"></i> Logout
                                            </button>
                                        </>
                                    ) : (
                                        <ResistantButton
                                            onClick={toggleAuthModal}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                        >
                                            <i className="fas fa-sign-in-alt mr-2"></i> Login/Register
                                        </ResistantButton>
                                        
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        {hasMounted && (
                            <ResistantButton
                                onClick={toggleMenu}
                                className="md:hidden text-white hover:text-[#d4b26a] transition-colors"
                            >
                                {isMenuOpen ? (
                                    <i className="fas fa-times text-xl"></i>
                                ) : (
                                    <i className="fas fa-bars text-xl"></i>
                                )}
                            </ResistantButton>
                        )}
                    </div>
                </nav>

                {/* Mobile Menu */}
                {hasMounted && isMenuOpen && isMobile && (
                    <div className="md:hidden bg-[#2a2a2a] px-4 py-2">
                        <div className="flex flex-col space-y-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="py-2 hover:text-[#d4b26a] transition-colors"
                                    onClick={toggleMenu}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <div className="pt-2 border-t border-gray-700">
                                {userRole ? (
                                    <>
                                        <Link
                                            href="/profile"
                                            className="block py-2 hover:text-[#d4b26a] transition-colors"
                                            onClick={toggleMenu}
                                        >
                                            <i className="fas fa-user-circle mr-2"></i> My Profile
                                        </Link>
                                        {userRole === 'admin' && (
                                            <Link
                                                href="/admin/dashboard"
                                                className="block py-2 hover:text-[#d4b26a] transition-colors"
                                                onClick={toggleMenu}
                                            >
                                                <i className="fas fa-tachometer-alt mr-2"></i> Admin Panel
                                            </Link>
                                        )}
                                        {userRole === 'webadmin' && (
                                            <Link
                                                href="/webadmin/dashboard"
                                                className="block py-2 hover:text-[#d4b26a] transition-colors"
                                                onClick={toggleMenu}
                                            >
                                                <i className="fas fa-cogs mr-2"></i> Web Admin
                                            </Link>
                                        )}
                                        <Link
                                            href="/settings"
                                            className="block py-2 hover:text-[#d4b26a] transition-colors"
                                            onClick={toggleMenu}
                                        >
                                            <i className="fas fa-cog mr-2"></i> Settings
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                toggleMenu();
                                            }}
                                            className="block w-full text-left py-2 hover:text-[#d4b26a] transition-colors"
                                        >
                                            <i className="fas fa-sign-out-alt mr-2"></i> Logout
                                        </button>
                                    </>
                                ) : (
                                    <ResistantButton
                                        onClick={() => {
                                            toggleAuthModal();
                                            toggleMenu();
                                        }}
                                        className="block w-full text-left py-2 hover:text-[#d4b26a] transition-colors"
                                    >
                                        <i className="fas fa-sign-in-alt mr-2"></i> Login/Register
                                    </ResistantButton>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Auth Modal */}
            <AuthModal 
                isOpen={isAuthModalOpen} 
                onClose={toggleAuthModal} 
                onAuthSuccess={handleAuthSuccess}
                router={router} 
            />
        </>
    );
};

export default Navbar;