import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart, FaDownload, FaEye, FaUser, FaTrash } from 'react-icons/fa';
import { FavoritesContext } from '../contects/FavoritesContext';
import { AuthContext } from '../contects/AuthProvider';
import { toast } from 'react-hot-toast';

const Favorites = () => {
  const { favorites, removeFromFavorites } = useContext(FavoritesContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-24">
        <div className="text-center">
          <FaHeart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Please login to view your favorites</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to access your favorites.</p>
          <Link 
            to="/login" 
            className="inline-block px-6 py-3 bg-[#4CAF50] text-white font-medium rounded-lg hover:bg-[#43A047] transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-24">
        <div className="text-center">
          <FaHeart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your favorites list is empty</h2>
          <p className="text-gray-600 mb-6">Browse notes and add some to your favorites.</p>
          <Link 
            to="/notes" 
            className="inline-block px-6 py-3 bg-[#4CAF50] text-white font-medium rounded-lg hover:bg-[#43A047] transition-colors"
          >
            Browse Notes
          </Link>
        </div>
      </div>
    );
  }

  const handleRemove = (noteId) => {
    removeFromFavorites(noteId);
    toast.success('Removed from favorites');
  };

  const handleNoteClick = (note) => {
    navigate(`/note/${note._id}`);
  };

  return (
    <div className="min-h-screen px-4 py-24">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Favorites</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((note) => (
            <motion.div
              key={note._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all"
            >
              <div 
                className="h-40 bg-gray-200 relative cursor-pointer"
                onClick={() => handleNoteClick(note)}
              >
                {note.thumbnailUrl ? (
                  <img
                    src={note.thumbnailUrl}
                    alt={note.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(note.title)}&background=random&size=512`;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400 text-lg font-medium">{note.title}</span>
                  </div>
                )}
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(note._id);
                  }}
                  className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-red-50 transition-colors"
                >
                  <FaTrash className="text-red-500 w-4 h-4" />
                </button>
              </div>
              
              <div className="p-4">
                <h3 
                  className="font-semibold text-gray-900 mb-1 line-clamp-1 cursor-pointer"
                  onClick={() => handleNoteClick(note)}
                >
                  {note.title}
                </h3>
                
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <div className="flex items-center">
                    {note.authorPhoto ? (
                      <img
                        src={note.authorPhoto}
                        alt={note.authorName}
                        className="w-5 h-5 rounded-full mr-1"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(note.authorName || 'User')}&background=random`;
                        }}
                      />
                    ) : (
                      <FaUser className="w-3 h-3 mr-1" />
                    )}
                    <span className="line-clamp-1">{note.authorName || 'Unknown'}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center">
                      <FaEye className="w-3 h-3 mr-1" />
                      {note.views || 0}
                    </span>
                    <span className="flex items-center">
                      <FaDownload className="w-3 h-3 mr-1" />
                      {note.downloads || 0}
                    </span>
                  </div>
                  
                  <span className={`px-2 py-1 rounded-full text-xs ${note.price > 0 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                    {note.price > 0 ? `$${note.price}` : 'Free'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Favorites; 