import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaPatreon, FaTwitter, FaInstagram, FaBook } from 'react-icons/fa';

const MyFooter = () => {
  const footerNavItems = [
    { path: '/shop', label: 'Shop' },
    { path: '/blog', label: 'Blog' },
    { path: '/about', label: 'About' },
    { path: '/upload', label: 'Upload Notes' }
  ];

  return (
    <footer className="bg-[#1E1E1E] text-gray-300 py-4 px-6">
      <div className="container mx-auto flex flex-wrap justify-between items-center text-sm">
        {/* Left side - Logo and Links */}
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-white font-bold flex items-center gap-2">
            <FaBook className="text-xl text-[#4CAF50]" />
            NOTECAFE
          </Link>
          <div className="hidden md:flex items-center">
            <div className="bg-[#1E1E1E]/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
              {footerNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                    ${isActive ? 'text-white bg-[#4CAF50]/10' : 'text-gray-300 hover:text-white hover:bg-[#4CAF50]/10'}
                  `}
                >
                  <span className="relative whitespace-nowrap">
                    {item.label}
                  </span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Copyright and Social Links */}
        <div className="flex items-center space-x-8">
          <div className="text-gray-400">
            © 2024 NOTECAFE. All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <a href="https://www.patreon.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-[#4CAF50]/10 transition-all">
              <FaPatreon className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-[#4CAF50]/10 transition-all">
              <FaTwitter className="w-4 h-4" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-[#4CAF50]/10 transition-all">
              <FaInstagram className="w-4 h-4" />
            </a>
            <span className="text-gray-400">Support: support@notecafe.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MyFooter;

