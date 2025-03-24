import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaDownload, FaHeart, FaRegHeart, FaShare, FaEye, FaStar, FaUser, FaCalendar, FaBook, FaTag, FaChevronLeft } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../contects/AuthProvider';
import { FavoritesContext } from '../contects/FavoritesContext';

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [relatedNotes, setRelatedNotes] = useState([]);
  const { user } = useContext(AuthContext);
  const { addToFavorites, removeFromFavorites, isInFavorites } = useContext(FavoritesContext);

  useEffect(() => {
    fetchNoteDetails();
  }, [id]);

  const fetchNoteDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notes/${id}`);
      if (!response.ok) throw new Error('Failed to fetch note details');
      
      const data = await response.json();
      setNote(data);
      
      // Fetch related notes
      const relatedResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notes/related/${id}`
      );
      if (relatedResponse.ok) {
        const relatedData = await relatedResponse.json();
        setRelatedNotes(relatedData.data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      if (!note.fileUrl) {
        toast.error('Download link not available');
        return;
      }

      window.open(note.fileUrl, '_blank');
      toast.success('Download started!');

      // Update download count
      await fetch(`${import.meta.env.VITE_API_URL}/api/notes/download/${id}`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to download note');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: note.title,
          text: note.description,
          url: url
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share');
    }
  };

  const toggleFavorite = () => {
    if (!user) {
      toast.error('Please login to add to favorites');
      return;
    }

    if (isInFavorites(note._id)) {
      removeFromFavorites(note._id);
      toast.success('Removed from favorites');
    } else {
      addToFavorites(note);
      toast.success('Added to favorites');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="aspect-[3/4] bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Note</h2>
          <p className="text-gray-600 mb-6">{error || 'Note not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FaChevronLeft className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Navigation */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <FaChevronLeft className="mr-2" />
            Back to Notes
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Image and Preview */}
          <div className="space-y-6">
            <motion.div 
              className="relative aspect-[3/4] bg-white rounded-xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <img
                src={previewImage || note.thumbnailUrl || `https://via.placeholder.com/600x800?text=${encodeURIComponent(note.title)}`}
                alt={note.title}
                className="w-full h-full object-cover"
              />
              {note.previewImages && note.previewImages.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {note.previewImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setPreviewImage(image)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          previewImage === image ? 'border-blue-500 scale-105' : 'border-transparent hover:border-white/50'
                        }`}
                      >
                        <img src={image} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Stats and Metadata */}
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-white rounded-lg p-4 text-center">
                <FaEye className="w-5 h-5 mx-auto mb-2 text-blue-500" />
                <div className="text-sm text-gray-600">Views</div>
                <div className="font-semibold">{note.views || 0}</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <FaDownload className="w-5 h-5 mx-auto mb-2 text-green-500" />
                <div className="text-sm text-gray-600">Downloads</div>
                <div className="font-semibold">{note.downloads || 0}</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <FaStar className="w-5 h-5 mx-auto mb-2 text-amber-500" />
                <div className="text-sm text-gray-600">Rating</div>
                <div className="font-semibold">{note.rating || 0}/5</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <FaHeart className="w-5 h-5 mx-auto mb-2 text-red-500" />
                <div className="text-sm text-gray-600">Favorites</div>
                <div className="font-semibold">{note.favorites || 0}</div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Note Details */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{note.title}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  <FaBook className="w-4 h-4 mr-1" />
                  {note.category}
                </span>
                {note.subject && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                    <FaTag className="w-4 h-4 mr-1" />
                    {note.subject}
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-6">{note.description}</p>
            </div>

            {/* Author Info */}
            {note.author && (
              <div className="bg-white rounded-lg p-4 flex items-center space-x-4">
                <img
                  src={note.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(note.author.name)}`}
                  alt={note.author.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-medium text-gray-900">{note.author.name}</div>
                  <div className="text-sm text-gray-500">{note.author.role || 'Contributor'}</div>
                </div>
              </div>
            )}

            {/* Additional Details */}
            <div className="bg-white rounded-lg p-6 space-y-4">
              <div className="flex items-center text-gray-600">
                <FaCalendar className="w-5 h-5 mr-3" />
                <span>Published on {new Date(note.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaUser className="w-5 h-5 mr-3" />
                <span>Suitable for {note.targetAudience || 'All Students'}</span>
              </div>
              {note.pages && (
                <div className="flex items-center text-gray-600">
                  <FaBook className="w-5 h-5 mr-3" />
                  <span>{note.pages} Pages</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleDownload}
                className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
              >
                <FaDownload className="mr-2" />
                Download Now
              </button>
              <button
                onClick={toggleFavorite}
                className={`p-3 rounded-lg border transition-colors ${
                  isInFavorites(note._id)
                    ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {isInFavorites(note._id) ? <FaHeart /> : <FaRegHeart />}
              </button>
              <button
                onClick={handleShare}
                className="p-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <FaShare />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Related Notes Section */}
        {relatedNotes.length > 0 && (
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Notes</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {relatedNotes.map((relatedNote) => (
                <motion.div
                  key={relatedNote._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/notes/${relatedNote._id}`)}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="aspect-[2/3] relative">
                    <img
                      src={relatedNote.thumbnailUrl || `https://via.placeholder.com/300x450?text=${encodeURIComponent(relatedNote.title)}`}
                      alt={relatedNote.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <div className="text-white">
                        <h3 className="text-sm font-medium mb-1">{relatedNote.title}</h3>
                        <p className="text-xs opacity-90">{relatedNote.subject}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NoteDetail; 