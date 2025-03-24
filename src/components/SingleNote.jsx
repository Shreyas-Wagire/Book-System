import React, { useState, useContext, useEffect } from 'react';
import { useParams, useLoaderData, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaDownload, FaStar, FaStarHalfAlt, FaRegStar, FaEye, FaUser, FaCalendarAlt, FaTag, FaArrowLeft, FaHeart, FaRegHeart, FaShare } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../contects/AuthProvider';

const SingleNote = () => {
  const { id } = useParams();
  const noteData = useLoaderData();
  const note = noteData?.note || {};
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [relatedNotes, setRelatedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);

  // Get category icon
  const getCategoryIcon = (category) => {
    const categoryIcons = {
      handwritten: "✏️",
      printed: "🖨️",
      textbooks: "📚",
      video: "🎬",
      assignments: "📝",
      code: "💻",
      audio: "🎧"
    };
    return categoryIcons[category] || "📄";
  };

  // Format price
  const formatPrice = (price) => {
    return `₹${price.toFixed(2)}`;
  };

  // Calculate average rating
  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((total, rating) => total + rating.value, 0);
    return (sum / ratings.length).toFixed(1);
  };

  // Render stars for rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-500" />);
      }
    }
    
    return stars;
  };

  // Handle download
  const handleDownload = async () => {
    if (!user) {
      toast.info('Please log in to download this note');
      return;
    }
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notes/download/${id}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${note.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('Download started!');
    } catch (error) {
      console.error('Error downloading note:', error);
      toast.error('Failed to download. Please try again.');
    }
  };

  // Toggle wishlist
  const toggleWishlist = () => {
    if (!user) {
      toast.info('Please log in to add to wishlist');
      return;
    }
    
    setIsInWishlist(!isInWishlist);
    toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
    // Here you would typically make an API call to update the user's wishlist
  };

  // Handle rating submission
  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.info('Please log in to rate this note');
      return;
    }
    
    if (userRating === 0) {
      toast.warning('Please select a rating');
      return;
    }
    
    setIsSubmittingRating(true);
    
    try {
      const token = localStorage.getItem('auth-token');
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notes/${id}/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.uid,
          value: userRating,
          comment: comment
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }
      
      toast.success('Rating submitted successfully!');
      setComment('');
      
      // Refresh the page to show the updated rating
      window.location.reload();
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error(error.message || 'Failed to submit rating. Please try again.');
    } finally {
      setIsSubmittingRating(false);
    }
  };

  // Fetch related notes
  useEffect(() => {
    const fetchRelatedNotes = async () => {
      if (!note.category) return;
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notes?category=${note.category}&limit=4`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch related notes');
        }
        
        const data = await response.json();
        
        // Filter out the current note
        const filtered = data.notes.filter(relatedNote => relatedNote._id !== id);
        
        setRelatedNotes(filtered.slice(0, 3)); // Limit to 3 related notes
      } catch (error) {
        console.error('Error fetching related notes:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (note._id) {
      fetchRelatedNotes();
    }
  }, [note.category, note._id, id]);

  // Check if user has already rated
  useEffect(() => {
    if (user && note.ratings) {
      const userRatingObj = note.ratings.find(rating => rating.userId === user.uid);
      if (userRatingObj) {
        setUserRating(userRatingObj.value);
        setComment(userRatingObj.comment || '');
      }
    }
  }, [user, note.ratings]);

  useEffect(() => {
    fetchNote();
  }, [id]);

  const fetchNote = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notes/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch note');
      }
      const data = await response.json();
      setNote(data);
      setPdfUrl(`${import.meta.env.VITE_API_URL}/api/notes/view/${id}`);
    } catch (error) {
      console.error('Error fetching note:', error);
      toast.error('Failed to fetch note');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: note.title,
        text: `Check out these notes: ${note.title}`,
        url: window.location.href
      });
    } catch (error) {
      toast.error('Failed to share note');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="aspect-video bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900">Note not found</h2>
          <p className="mt-2 text-gray-600">The note you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{note.title}</h1>
                <p className="mt-2 text-gray-600">{note.subject}</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaDownload className="w-5 h-5" />
                  Download
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <FaShare className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>
                </div>
                
          {/* PDF Viewer */}
          <div className="relative aspect-[16/9]">
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                title={note.title}
                className="absolute inset-0 w-full h-full"
                style={{ border: 'none' }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <FaEye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Preview not available</p>
                </div>
              </div>
            )}
              </div>
              
          {/* Details */}
          <div className="p-6 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Note Details</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div className="bg-white p-4 rounded-lg">
                <dt className="text-sm text-gray-500">Category</dt>
                <dd className="mt-1 text-gray-900 font-medium">{note.category}</dd>
                </div>
              <div className="bg-white p-4 rounded-lg">
                <dt className="text-sm text-gray-500">Uploaded</dt>
                <dd className="mt-1 text-gray-900 font-medium">
                  {new Date(note.createdAt).toLocaleDateString()}
                </dd>
              </div>
              {note.description && (
                <div className="sm:col-span-2 bg-white p-4 rounded-lg">
                  <dt className="text-sm text-gray-500">Description</dt>
                  <dd className="mt-1 text-gray-900">{note.description}</dd>
                </div>
              )}
            </dl>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SingleNote; 