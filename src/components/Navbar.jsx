import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaHeart, FaBook, FaBars, FaTimes, FaHome, FaUpload, FaInfoCircle, FaNewspaper } from "react-icons/fa";
import { AuthContext } from '../contects/AuthProvider';
import { FavoritesContext } from '../contects/FavoritesContext';

const Navbar = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const { user, logOut } = useContext(AuthContext);
    const { favoritesCount } = useContext(FavoritesContext);

    const navItems = [
        { path: '/', label: 'Home', icon: <FaHome className="w-5 h-5" />, badge: null },
        { path: '/notes', label: 'Notes', icon: <FaBook className="w-5 h-5" />, badge: null },
        { path: '/upload', label: 'Upload', icon: <FaUpload className="w-5 h-5" />, badge: null },
        { path: '/blog', label: 'Blog', icon: <FaNewspaper className="w-5 h-5" />, badge: null },
        { path: '/about', label: 'About', icon: <FaInfoCircle className="w-5 h-5" />, badge: null }
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const toggleMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLogout = () => {
        logOut()
            .then(() => {
                // Handle successful logout
            })
            .catch(error => console.log(error));
    };

    return (
        <>
            {/* Top Navigation Bar */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled ? 'py-2 bg-white/80 backdrop-blur-lg shadow-lg' : 'py-3 bg-transparent'
            }`}>
                <div className="container mx-auto px-4">
                    <nav className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 z-50">
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                            >
                                <FaBook className="text-2xl text-[#4CAF50]" />
                            </motion.div>
                            <span className="text-xl font-bold text-gray-900">NoteCafe</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center">
                            <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                                <ul className="flex items-center gap-1">
                                    {navItems.map((item) => (
                                        <li key={item.path}>
                                            <NavLink
                                                to={item.path}
                                                className={({ isActive }) => `
                                                    relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                                                    ${isActive ? 'text-gray-900 bg-[#4CAF50]/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}
                                                `}
                                            >
                                                <span className="relative whitespace-nowrap">
                                                    {item.label}
                                                    {item.badge && (
                                                        <motion.span
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="absolute -top-1 -right-2 bg-[#4CAF50] text-white text-xs w-4 h-4 flex items-center justify-center rounded-full"
                                                        >
                                                            {item.badge}
                                                        </motion.span>
                                                    )}
                                                </span>
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden lg:flex items-center gap-2">
                            <Link to="/favorites" className="relative p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-[#4CAF50]/10 transition-all">
                                <FaHeart className="text-gray-600 w-5 h-5" />
                                {favoritesCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">{favoritesCount}</span>
                                )}
                            </Link>

                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-[#4CAF50]/10 transition-all"
                                >
                                    {user && user.photoURL ? (
                                        <img 
                                            src={user.photoURL} 
                                            alt={user.displayName || "User"} 
                                            className="w-5 h-5 rounded-full"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=random`;
                                            }}
                                        />
                                    ) : (
                                        <FaUser className="text-gray-600 w-5 h-5" />
                                    )}
                                </motion.button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-xl shadow-xl border border-gray-100"
                                        >
                                            {user ? (
                                                <>
                                                    <div className="px-4 py-2 border-b border-gray-100">
                                                        <p className="text-sm font-medium text-gray-900">{user.displayName || user.email}</p>
                                                    </div>
                                                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#4CAF50]/10 hover:text-gray-900">Profile</Link>
                                                    <Link to="/user-details" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#4CAF50]/10 hover:text-gray-900">User Details</Link>
                                                    <Link to="/my-notes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#4CAF50]/10 hover:text-gray-900">My Notes</Link>
                                                    <Link to="/favorites" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#4CAF50]/10 hover:text-gray-900">Favorites</Link>
                                                    <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#4CAF50]/10 hover:text-gray-900">Dashboard</Link>
                                                    <Link to="/admin/dashboard/upload" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#4CAF50]/10 hover:text-gray-900">Upload Notes</Link>
                                                    <button onClick={handleLogout} className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
                                                </>
                                            ) : (
                                                <>
                                                    <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#4CAF50]/10 hover:text-gray-900">Login</Link>
                                                    <Link to="/signup" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#4CAF50]/10 hover:text-gray-900">Sign Up</Link>
                                                </>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="lg:hidden flex items-center">
                            <button
                                onClick={toggleMenu}
                                className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg z-50"
                            >
                                {isMobileMenuOpen ? (
                                    <FaTimes className="text-gray-900 w-5 h-5" />
                                ) : (
                                    <FaBars className="text-gray-900 w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'tween' }}
                        className="fixed inset-0 z-40 lg:hidden"
                    >
                        <div className="absolute inset-0 bg-black/50" onClick={toggleMenu}></div>
                        <motion.div
                            className="absolute top-0 right-0 bottom-0 w-72 bg-white shadow-xl flex flex-col h-full"
                        >
                            <div className="p-4 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <Link to="/" className="flex items-center gap-2" onClick={toggleMenu}>
                                        <FaBook className="text-xl text-[#4CAF50]" />
                                        <span className="text-lg font-bold text-gray-900">NoteCafe</span>
                                    </Link>
                                    <button onClick={toggleMenu} className="p-2 rounded-full hover:bg-gray-100">
                                        <FaTimes className="text-gray-500 w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto py-4 px-4">
                                <ul className="space-y-2">
                                    {navItems.map((item) => (
                                        <motion.li key={item.path} whileTap={{ scale: 0.95 }}>
                                            <NavLink
                                                to={item.path}
                                                onClick={toggleMenu}
                                                className={({ isActive }) => `
                                                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                                                    ${isActive ? 'bg-[#4CAF50]/10 text-[#4CAF50]' : 'text-gray-700 hover:bg-gray-50'}
                                                `}
                                            >
                                                <span className="text-[#4CAF50]">{item.icon}</span>
                                                {item.label}
                                            </NavLink>
                                        </motion.li>
                                    ))}
                                </ul>

                                <div className="mt-auto space-y-4">
                                    <div className="flex justify-around">
                                        <Link to="/favorites" className="flex flex-col items-center gap-1 text-gray-600" onClick={toggleMenu}>
                                            <div className="relative">
                                                <FaHeart className="w-6 h-6" />
                                                {favoritesCount > 0 && (
                                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">{favoritesCount}</span>
                                                )}
                                            </div>
                                            <span className="text-sm">Favorites</span>
                                        </Link>
                                    </div>

                                    <div className="border-t border-gray-100 pt-4">
                                        {user ? (
                                            <div className="space-y-2">
                                                <div className="px-4 py-2 flex items-center gap-3">
                                                    {user.photoURL ? (
                                                        <img 
                                                            src={user.photoURL} 
                                                            alt={user.displayName || "User"} 
                                                            className="w-8 h-8 rounded-full"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=random`;
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                            <FaUser className="text-gray-600 w-4 h-4" />
                                                        </div>
                                                    )}
                                                    <p className="text-sm font-medium text-gray-900">{user.displayName || user.email}</p>
                                                </div>
                                                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#4CAF50]/10" onClick={toggleMenu}>Profile</Link>
                                                <Link to="/user-details" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#4CAF50]/10" onClick={toggleMenu}>User Details</Link>
                                                <Link to="/my-notes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#4CAF50]/10" onClick={toggleMenu}>My Notes</Link>
                                                <Link to="/favorites" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#4CAF50]/10" onClick={toggleMenu}>Favorites</Link>
                                                <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#4CAF50]/10" onClick={toggleMenu}>Dashboard</Link>
                                                <Link to="/admin/dashboard/upload" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#4CAF50]/10" onClick={toggleMenu}>Upload Notes</Link>
                                                <button onClick={handleLogout} className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <Link to="/login" className="block w-full px-4 py-2 text-center text-white bg-[#4CAF50] rounded-xl hover:bg-[#43A047]" onClick={toggleMenu}>Login</Link>
                                                <Link to="/signup" className="block w-full px-4 py-2 text-center text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50" onClick={toggleMenu}>Sign Up</Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 pb-safe">
                <div className="flex justify-around items-center h-16">
                    {navItems.slice(0, 5).map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                                flex flex-col items-center justify-center w-full h-full
                                ${isActive ? 'text-[#4CAF50]' : 'text-gray-500 hover:text-gray-900'}
                            `}
                        >
                            <div className="relative">
                                {item.icon}
                                {item.badge && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                            <span className="text-xs mt-1">{item.label}</span>
                        </NavLink>
                    ))}
                </div>
            </div>

            {/* Add padding to the bottom of the page on mobile to account for the bottom navigation */}
            <div className="lg:hidden h-16"></div>
        </>
    );
}

export default Navbar;
