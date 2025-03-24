import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaDownload, FaEye, FaCalendarAlt, FaTag, FaUser, FaBook, FaFileAlt, FaArrowLeft, FaShare, FaHeart, FaRegHeart } from 'react-icons/fa';
import { FavoritesContext } from '../contects/FavoritesContext';
import { AuthContext } from '../contects/AuthProvider';

const NoteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const { addToFavorites, removeFromFavorites, isInFavorites } = useContext(FavoritesContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchNoteDetails();
  }, [id]);

  const fetchNoteDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notes/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch note details');
      }

      const data = await response.json();
      if (!data.success || !data.data) {
        throw new Error(data.message || 'Failed to fetch note details');
      }

      console.log('Note details:', data.data);
      setNote(data.data);
      
      // Increment view count in the background
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/notes/view/${id}`, {
          method: 'POST'
        });
      } catch (viewError) {
        console.error('Error updating view count:', viewError);
      }
    } catch (error) {
      console.error('Error fetching note details:', error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (note?.fileUrl) {
      window.open(note.fileUrl, '_blank');
      toast.success('Download started!');
      
      // Increment download count in the background
      try {
        fetch(`${import.meta.env.VITE_API_URL}/api/notes/download/${note._id}`, {
          method: 'POST'
        });
      } catch (error) {
        console.error('Error updating download count:', error);
      }
    } else {
      toast.error('Download link not available');
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: note.title,
          text: `Check out these notes: ${note.title}`,
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support navigator.share
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      toast.error('Failed to share. Try copying the link instead.');
    }
  };

  const togglePreview = () => {
    if (note?.previewUrl) {
      setPreviewVisible(!previewVisible);
    } else {
      toast.error('Preview not available');
    }
  };

  const toggleFavorite = () => {
    if (!user) {
      toast.error('Please login to add to favorites');
      navigate('/login');
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
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="text-center max-w-md">
              <h2 className="text-xl font-medium text-gray-900 mb-3">Error Loading Note</h2>
              <p className="text-gray-500 mb-6">{error}</p>
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="text-center max-w-md">
              <h2 className="text-xl font-medium text-gray-900 mb-3">Note Not Found</h2>
              <p className="text-gray-500 mb-6">The note you're looking for doesn't exist or has been removed.</p>
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 md:mb-8 flex items-center text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-2" />
          <span className="hidden md:inline">Back to Notes</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Mobile View */}
          <div className="lg:hidden">
            {/* Image Section */}
            <div className="relative">
              <img
                src={note.thumbnailUrl || `https://via.placeholder.com/600x800?text=${encodeURIComponent(note.title)}`}
                alt={note.title}
                className="w-full h-64 object-cover object-center"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://via.placeholder.com/600x800?text=${encodeURIComponent(note.title)}`;
                }}
              />
              {note.category && (
                <div className="absolute top-4 left-4">
                  <div className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                    {note.category}
                  </div>
                </div>
              )}
              <button
                onClick={handleShare}
                className="absolute top-4 right-4 bg-white/80 p-2 rounded-full text-gray-700 hover:bg-white"
              >
                <FaShare className="w-4 h-4" />
              </button>
              
              {user && (
                <button
                  onClick={toggleFavorite}
                  className="absolute top-4 right-14 bg-white/80 p-2 rounded-full hover:bg-white"
                >
                  {isInFavorites(note._id) ? (
                    <FaHeart className="w-4 h-4 text-red-500" />
                  ) : (
                    <FaRegHeart className="w-4 h-4 text-gray-700" />
                  )}
                </button>
              )}
            </div>

            {/* Content Section */}
            <div className="p-4">
              <h1 className="text-xl font-bold text-gray-900 mb-2">{note.title}</h1>
              
              {/* Author Info */}
              <div className="flex items-center mb-4">
                <div className="mr-2">
                  <img
                    src={note.authorPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(note.authorName || 'Anonymous')}&background=random`}
                    alt={note.authorName || 'Anonymous'}
                    className="w-8 h-8 rounded-full border-2 border-gray-200"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(note.authorName || 'Anonymous')}&background=random`;
                    }}
                  />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{note.authorName || 'Anonymous'}</div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-gray-50 p-2 rounded-lg text-center">
                  <div className="flex justify-center mb-1 text-blue-500">
                    <FaEye className="w-4 h-4" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">{note.views || 0}</div>
                  <div className="text-xs text-gray-500">Views</div>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg text-center">
                  <div className="flex justify-center mb-1 text-blue-500">
                    <FaDownload className="w-4 h-4" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">{note.downloads || 0}</div>
                  <div className="text-xs text-gray-500">Downloads</div>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg text-center">
                  <div className="flex justify-center mb-1 text-blue-500">
                    <FaCalendarAlt className="w-4 h-4" />
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500">Created</div>
                </div>
              </div>

              {/* Description */}
              {note.description && (
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Description</h2>
                  <p className="text-gray-700 text-sm leading-relaxed">{note.description}</p>
                </div>
              )}

              {/* Tags */}
              {note.tags && note.tags.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {note.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs flex items-center"
                      >
                        <FaTag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col space-y-3 mt-4">
                <button
                  onClick={handleDownload}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-3 rounded-lg transition-colors flex items-center justify-center"
                >
                  <FaDownload className="w-4 h-4 mr-2" />
                  {note.price > 0 ? `Download ($${note.price.toFixed(2)})` : 'Download Free'}
                </button>
                
                {note.previewUrl && (
                  <button
                    onClick={togglePreview}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-4 py-3 rounded-lg transition-colors"
                  >
                    {previewVisible ? 'Hide Preview' : 'Show Preview'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Desktop View */}
          <div className="hidden lg:flex">
            {/* Left Column - Image */}
            <div className="lg:w-1/3">
              <div className="relative h-full">
                <img
                  src={note.thumbnailUrl || `https://via.placeholder.com/600x800?text=${encodeURIComponent(note.title)}`}
                  alt={note.title}
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://via.placeholder.com/600x800?text=${encodeURIComponent(note.title)}`;
                  }}
                />
                {note.category && (
                  <div className="absolute top-4 left-4">
                    <div className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full">
                      {note.category}
                    </div>
                  </div>
                )}
                <button
                  onClick={handleShare}
                  className="absolute top-4 right-4 bg-white/80 p-2 rounded-full text-gray-700 hover:bg-white"
                >
                  <FaShare className="w-4 h-4" />
                </button>
                
                {user && (
                  <button
                    onClick={toggleFavorite}
                    className="absolute top-4 right-14 bg-white/80 p-2 rounded-full hover:bg-white"
                  >
                    {isInFavorites(note._id) ? (
                      <FaHeart className="w-4 h-4 text-red-500" />
                    ) : (
                      <FaRegHeart className="w-4 h-4 text-gray-700" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="lg:w-2/3 p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{note.title}</h1>
              
              {/* Author Info */}
              <div className="flex items-center mb-6">
                <div className="mr-3">
                  <img
                    src={note.authorPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(note.authorName || 'Anonymous')}&background=random`}
                    alt={note.authorName || 'Anonymous'}
                    className="w-8 h-8 rounded-full border-2 border-gray-200"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(note.authorName || 'Anonymous')}&background=random`;
                    }}
                  />
                </div>
                <div>
                  <div className="text-gray-900 font-medium">{note.authorName || 'Anonymous'}</div>
                  {note.authorEmail && (
                    <div className="text-gray-500 text-sm">{note.authorEmail}</div>
                  )}
                </div>
              </div>

              {/* Description */}
              {note.description && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
                  <p className="text-gray-700 leading-relaxed">{note.description}</p>
                </div>
              )}

              {/* Content Preview */}
              {note.content && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Content Preview</h2>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-700 line-clamp-3">{note.content}</p>
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="flex justify-center mb-2 text-blue-500">
                    <FaEye className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{note.views || 0}</div>
                  <div className="text-sm text-gray-500">Views</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="flex justify-center mb-2 text-blue-500">
                    <FaDownload className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{note.downloads || 0}</div>
                  <div className="text-sm text-gray-500">Downloads</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="flex justify-center mb-2 text-blue-500">
                    <FaCalendarAlt className="w-5 h-5" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">Created</div>
                </div>
              </div>

              {/* Tags */}
              {note.tags && note.tags.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {note.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        <FaTag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {note.subject && (
                  <div className="flex items-center">
                    <FaBook className="w-5 h-5 text-gray-500 mr-2" />
                    <div>
                      <div className="text-sm text-gray-500">Subject</div>
                      <div className="text-gray-900">{note.subject}</div>
                    </div>
                  </div>
                )}
                {note.fileUrl && (
                  <div className="flex items-center">
                    <FaFileAlt className="w-5 h-5 text-gray-500 mr-2" />
                    <div>
                      <div className="text-sm text-gray-500">File Type</div>
                      <div className="text-gray-900">
                        {note.fileUrl.split('.').pop().toUpperCase() || 'Document'}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-3">
                <button
                  onClick={handleDownload}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center justify-center"
                >
                  <FaDownload className="w-5 h-5 mr-2" />
                  {note.price > 0 ? `Download ($${note.price.toFixed(2)})` : 'Download Free'}
                </button>
                
                {note.previewUrl && (
                  <button
                    onClick={togglePreview}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-6 py-3 rounded-lg transition-colors"
                  >
                    {previewVisible ? 'Hide Preview' : 'Show Preview'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Preview Section */}
          {previewVisible && note.previewUrl && (
            <div className="p-4 md:p-8 border-t border-gray-200">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Preview</h2>
              <div className="aspect-video w-full">
                <iframe
                  src={note.previewUrl}
                  title={`Preview of ${note.title}`}
                  className="w-full h-full border-0 rounded-lg"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteDetails; 