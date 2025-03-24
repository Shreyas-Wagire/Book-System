import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaDownload, FaEye, FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';

const NotesCard = ({ note, inWishlist = false, onToggleWishlist }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get the appropriate icon based on the note category
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'handwritten':
        return '📝';
      case 'printed':
        return '📄';
      case 'textbooks':
        return '📚';
      case 'video':
        return '🎬';
      case 'assignments':
        return '📋';
      case 'code':
        return '💻';
      case 'audio':
        return '🎧';
      default:
        return '📄';
    }
  };

  // Format price with Indian Rupee symbol
  const formatPrice = (price) => {
    return `₹${parseFloat(price).toFixed(2)}`;
  };

  // Calculate average rating
  const averageRating = note.ratings && note.ratings.length > 0
    ? note.ratings.reduce((sum, rating) => sum + rating.value, 0) / note.ratings.length
    : 0;

  // Handle download click
  const handleDownloadClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Increment download count in the database
    fetch(`${import.meta.env.VITE_API_URL}/notes/${note._id}/download`, {
      method: 'POST',
    })
      .then(response => {
        if (response.ok) {
          // Open the file URL in a new tab
          window.open(note.fileUrl, '_blank');
        } else {
          throw new Error('Failed to register download');
        }
      })
      .catch(error => {
        console.error('Error downloading file:', error);
        toast.error('Failed to download file. Please try again.');
      });
  };

  // Handle wishlist toggle
  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleWishlist(note._id);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <Link to={`/notes/${note._id}`} className="block">
        <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 shadow-md hover:shadow-xl transition-all duration-300">
          {/* Thumbnail */}
          <div className="relative h-full">
            <img
              src={note.thumbnailUrl || 'https://via.placeholder.com/300x400?text=No+Image'}
              alt={note.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300x400?text=Error+Loading+Image';
              }}
            />
            
            {/* Overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
            
            {/* Category badge */}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-800 shadow-sm">
              <span className="mr-1">{getCategoryIcon(note.category)}</span>
              {note.category.charAt(0).toUpperCase() + note.category.slice(1)}
            </div>
            
            {/* Wishlist button */}
            <button
              onClick={handleWishlistToggle}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-colors"
            >
              {inWishlist ? (
                <FaHeart className="w-4 h-4 text-red-500" />
              ) : (
                <FaRegHeart className="w-4 h-4 text-gray-700" />
              )}
            </button>
            
            {/* Content at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">{note.title}</h3>
              
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <img
                    src={note.authorPhoto || 'https://via.placeholder.com/40?text=User'}
                    alt={note.authorName}
                    className="w-6 h-6 rounded-full mr-2 border border-white/30"
                  />
                  <span className="text-xs text-white/80">{note.authorName}</span>
                </div>
                <div className="flex items-center">
                  <FaStar className="w-3 h-3 text-yellow-400 mr-1" />
                  <span className="text-xs text-white/80">
                    {averageRating > 0 ? averageRating.toFixed(1) : 'New'}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-white font-bold">{formatPrice(note.price)}</span>
                <div className="flex items-center text-xs text-white/70 space-x-2">
                  <span className="flex items-center">
                    <FaEye className="w-3 h-3 mr-1" />
                    {note.views || 0}
                  </span>
                  <span className="flex items-center">
                    <FaDownload className="w-3 h-3 mr-1" />
                    {note.downloads || 0}
                  </span>
                </div>
              </div>
              
              {/* Action buttons on hover */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
                transition={{ duration: 0.2 }}
                className="mt-3 flex gap-2"
              >
                <button
                  onClick={handleDownloadClick}
                  className="flex-1 bg-[#4CAF50] text-white py-2 rounded-lg text-xs font-medium hover:bg-[#43A047] transition-all flex items-center justify-center gap-1"
                >
                  <FaDownload className="w-3 h-3" />
                  Download
                </button>
                <Link
                  to={`/notes/${note._id}`}
                  className="flex-1 bg-white/90 backdrop-blur-sm text-gray-800 py-2 rounded-lg text-xs font-medium hover:bg-white transition-all flex items-center justify-center gap-1"
                >
                  <FaEye className="w-3 h-3" />
                  View Details
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default NotesCard; 