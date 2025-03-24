import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchBar = ({ 
  placeholder = "Search...", 
  suggestions = [], 
  onSearch, 
  onSuggestionClick,
  expandable = false,
  className = "",
  showCloseButton = false,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!expandable);

  // Handle click outside search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) {
        setShowSuggestions(false);
        if (expandable) {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [expandable]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(value.length > 0);
    onSearch?.(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.title);
    setShowSuggestions(false);
    onSuggestionClick?.(suggestion);
  };

  const filteredSuggestions = suggestions
    .filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.excerpt && item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .slice(0, 4);

  if (expandable && !isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-[#DDFFD9] transition-all"
      >
        <FaSearch className="w-5 h-5 text-gray-600" />
      </button>
    );
  }

  return (
    <div className={`relative search-container ${className}`}>
      <motion.div
        initial={expandable ? { width: 0, opacity: 0 } : false}
        animate={{ width: expandable ? 300 : '100%', opacity: 1 }}
        exit={expandable ? { width: 0, opacity: 0 } : false}
        className="relative"
      >
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setShowSuggestions(true)}
          className="w-full pl-12 pr-4 py-3 rounded-full text-white placeholder-white/70 bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:ring-opacity-50 transition-all"
          autoFocus={expandable}
        />
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70" />
        
        {(showCloseButton || searchTerm) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setShowSuggestions(false);
              if (expandable) {
                setIsExpanded(false);
              }
              onClose?.();
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white p-2"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        )}

        {/* Search Suggestions */}
        <AnimatePresence>
          {showSuggestions && filteredSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute w-full mt-2 py-2 bg-white rounded-2xl shadow-xl border border-[#4CAF50]/20 z-50"
            >
              {filteredSuggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-2 text-left hover:bg-[#4CAF50]/10 text-gray-700 text-sm transition-colors"
                >
                  <div className="font-medium">{suggestion.title}</div>
                  {suggestion.category && (
                    <div className="text-xs text-gray-500">{suggestion.category}</div>
                  )}
                  {suggestion.excerpt && (
                    <div className="text-xs text-gray-500 truncate">{suggestion.excerpt}</div>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SearchBar; 