import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaChevronLeft, FaChevronRight, FaHeart, FaDownload, FaBookOpen, FaRegHeart, FaTimes, FaShare, FaBookmark, FaStar, FaBook, FaArrowRight, FaPencilAlt, FaGraduationCap, FaLightbulb, FaTasks } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { toast } from 'react-hot-toast';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FavoritesContext } from '../contects/FavoritesContext';
import { AuthContext } from '../contects/AuthProvider';

// Import components
import NotesCategories from '../components/NotesCategories';

const Home = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { addToFavorites, removeFromFavorites, isInFavorites } = useContext(FavoritesContext);
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalNotes: 0,
    totalDownloads: 0,
    totalUsers: 0
  });

  const categories = [
    {
      id: 'all',
      title: 'All Materials',
      description: 'Browse all study materials',
      icon: <FaBookOpen className="w-6 h-6" />,
      gradient: 'from-blue-500 to-blue-600',
      link: '/notes'
    },
    {
      id: 'handwritten',
      title: 'Handwritten Notes',
      description: 'Personal study notes',
      icon: <FaPencilAlt className="w-6 h-6" />,
      gradient: 'from-purple-500 to-purple-600',
      link: '/notes?category=handwritten'
    },
    {
      id: 'printed',
      title: 'Printed Notes',
      description: 'Professional study guides',
      icon: <FaBook className="w-6 h-6" />,
      gradient: 'from-pink-500 to-pink-600',
      link: '/notes?category=printed'
    },
    {
      id: 'textbooks',
      title: 'Core Textbooks',
      description: 'Essential course materials',
      icon: <FaGraduationCap className="w-6 h-6" />,
      gradient: 'from-indigo-500 to-indigo-600',
      link: '/notes?category=textbooks'
    },
    {
      id: 'reference',
      title: 'Reference Books',
      description: 'Additional study resources',
      icon: <FaLightbulb className="w-6 h-6" />,
      gradient: 'from-green-500 to-green-600',
      link: '/notes?category=reference'
    },
    {
      id: 'assignments',
      title: 'Assignment Help',
      description: 'Practice materials & guides',
      icon: <FaTasks className="w-6 h-6" />,
      gradient: 'from-amber-500 to-amber-600',
      link: '/notes?category=assignments'
    }
  ];

  const subjects = [
    {
      id: 'mathematics',
      name: 'Mathematics',
      count: '50+ Notes',
      icon: '📐',
      gradient: 'from-blue-500 to-blue-600',
      description: 'Calculus, Algebra, and more'
    },
    {
      id: 'physics',
      name: 'Physics',
      count: '45+ Notes',
      icon: '⚡',
      gradient: 'from-purple-500 to-purple-600',
      description: 'Mechanics, Electronics, and Quantum'
    },
    {
      id: 'chemistry',
      name: 'Chemistry',
      count: '40+ Notes',
      icon: '🧪',
      gradient: 'from-green-500 to-green-600',
      description: 'Organic, Inorganic, and Physical'
    },
    {
      id: 'computer-science',
      name: 'Computer Science',
      count: '60+ Notes',
      icon: '💻',
      gradient: 'from-indigo-500 to-indigo-600',
      description: 'Programming, Data Structures, and AI'
    },
    {
      id: 'electronics',
      name: 'Electronics',
      count: '35+ Notes',
      icon: '🔌',
      gradient: 'from-pink-500 to-pink-600',
      description: 'Circuits, Digital Systems, and More'
    },
    {
      id: 'mechanical',
      name: 'Mechanical',
      count: '30+ Notes',
      icon: '⚙️',
      gradient: 'from-amber-500 to-amber-600',
      description: 'Thermodynamics, Mechanics, and Design'
    }
  ];

  useEffect(() => {
    fetchNotes();
    fetchStats();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notes`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }
      
      const data = await response.json();
      
      if (!data.success || !data.data) {
        throw new Error(data.message || 'Failed to fetch notes');
      }
      
      setNotes(data.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to fetch notes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDownload = async (note) => {
    try {
      if (!note.fileUrl) {
        toast.error('Download link not available');
        return;
      }
      
      // Open the file URL directly in a new tab
      window.open(note.fileUrl, '_blank');
      toast.success('Download started!');
      
      // Increment download count in the background
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/notes/download/${note._id}`, {
          method: 'POST'
        });
      } catch (error) {
        console.error('Error updating download count:', error);
      }
    } catch (error) {
      console.error('Error downloading note:', error);
      toast.error('Failed to download note. Please try again.');
    }
  };

  const handleShare = async (note) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: note.title,
          text: `Check out these notes: ${note.title}`,
          url: `${window.location.origin}/notes/${note._id}`,
        });
      } else {
        // Fallback for browsers that don't support navigator.share
        navigator.clipboard.writeText(`${window.location.origin}/notes/${note._id}`);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      toast.error('Failed to share. Try copying the link instead.');
    }
  };

  const handleNoteClick = (note) => {
    navigate(`/notes/${note._id}`);
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (note.subject && note.subject.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (e, note) => {
    e.stopPropagation();
    
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/notes?search=${encodeURIComponent(searchTerm)}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Find Your Perfect Study Materials
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
            >
              Access thousands of notes, textbooks, and study resources to excel in your education
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto"
            >
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for notes, textbooks, subjects..."
                  className="w-full px-6 py-4 rounded-full text-gray-900 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors"
                >
                  <FaSearch className="w-5 h-5" />
                </button>
              </form>
            </motion.div>

            {/* Quick Stats */}
            {/* <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto mt-12"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold mb-1">{stats.totalNotes}</div>
                <div className="text-blue-100 text-sm">Study Materials</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold mb-1">{stats.totalDownloads}</div>
                <div className="text-blue-100 text-sm">Downloads</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold mb-1">{stats.totalUsers}</div>
                <div className="text-blue-100 text-sm">Active Users</div>
              </div>
            </motion.div> */}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive collection of study materials across various categories
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
                key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={category.link}
                className="block group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-lg"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-90 group-hover:opacity-100 transition-opacity`} />
                <div className="relative p-6">
                  <div className="bg-white/20 backdrop-blur-sm w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4">
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{category.title}</h3>
                  <p className="text-sm text-white/80 mb-4">{category.description}</p>
                  <div className="flex items-center text-white/90 text-sm">
                    < span>Explore</span>
                    <FaArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Enhanced Latest Notes Section */}
      <div className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              Latest Notes
            </h2>
            <p className="text-gray-600 text-lg">Discover fresh study materials uploaded by top students</p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="animate-pulse">
                  <div className="relative bg-gray-200 rounded-2xl overflow-hidden aspect-[4/5]">
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-gray-300 to-transparent" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Mobile View - Carousel */}
              <div className="md:hidden">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={20}
                  slidesPerView={1.2}
                  centeredSlides={true}
                  loop={true}
                  autoplay={{ delay: 3000 }}
                  pagination={{ clickable: true }}
                  className="pb-12"
                >
                  {filteredNotes.map((note) => (
                    <SwiperSlide key={note._id}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="relative bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer"
                        onClick={() => handleNoteClick(note)}
                      >
                        <div className="relative aspect-[4/5]">
                          <img
                            src={note.thumbnailUrl || `https://via.placeholder.com/400x500?text=${encodeURIComponent(note.title)}`}
                            alt={note.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://via.placeholder.com/400x500?text=${encodeURIComponent(note.title)}`;
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          {/* Content Overlay */}
                          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                            <div className="flex items-center mb-3">
                              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                                <FaBook className="w-4 h-4" />
                              </div>
                              <span className="text-sm font-medium">{note.category}</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">{note.title}</h3>
                            <p className="text-sm text-gray-200 mb-4 line-clamp-2">{note.description}</p>
                            
                            {/* Action Buttons */}
                            <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="flex items-center space-x-4">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload(note);
                                  }}
                                  className="text-white hover:text-blue-400 transition-colors"
                                >
                                  <FaDownload className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleShare(note);
                                  }}
                                  className="text-white hover:text-blue-400 transition-colors"
                                >
                                  <FaShare className="w-5 h-5" />
                                </button>
                                {user && (
                                  <button
                                    onClick={(e) => toggleFavorite(e, note)}
                                    className="text-white hover:text-red-400 transition-colors"
                                  >
                                    {isInFavorites(note._id) ? (
                                      <FaHeart className="w-5 h-5 text-red-500" />
                                    ) : (
                                      <FaRegHeart className="w-5 h-5" />
                                    )}
                                  </button>
                                )}
                              </div>
                              <span className="text-sm bg-blue-600 px-3 py-1 rounded-full">
                                {note.subject}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Desktop View - Grid with Hover Effects */}
              <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredNotes.map((note, index) => (
                  <motion.div
                    key={note._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="group relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-xl"
                    onClick={() => handleNoteClick(note)}
                  >
                    <div className="relative aspect-[4/5]">
                      <img
                        src={note.thumbnailUrl || `https://via.placeholder.com/400x500?text=${encodeURIComponent(note.title)}`}
                        alt={note.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://via.placeholder.com/400x500?text=${encodeURIComponent(note.title)}`;
                        }}
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Quick Action Buttons */}
                      <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {user && (
                          <button 
                            onClick={(e) => toggleFavorite(e, note)}
                            className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                          >
                            {isInFavorites(note._id) ? (
                              <FaHeart className="w-4 h-4 text-red-500" />
                            ) : (
                              <FaRegHeart className="w-4 h-4 text-gray-700" />
                            )}
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(note);
                          }}
                          className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                        >
                          <FaShare className="w-4 h-4 text-gray-700" />
                        </button>
                      </div>

                      {/* Content Overlay */}
                      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                            <FaBook className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium">{note.category}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{note.title}</h3>
                        <p className="text-sm text-gray-200 mb-4 line-clamp-2">{note.description}</p>
                        
                        {/* Bottom Action Bar */}
                        <div className="flex items-center justify-between">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(note);
                            }}
                            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                          >
                            <FaDownload className="w-4 h-4" />
                            <span className="text-sm font-medium">Download</span>
                          </button>
                          <span className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                            {note.subject}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* Enhanced Empty State */}
          {!loading && filteredNotes.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-100 flex items-center justify-center">
                <FaBook className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Notes Found</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                We couldn't find any notes matching your criteria. Try adjusting your filters or explore different categories.
              </p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaTimes className="w-4 h-4 mr-2" />
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Popular Subjects Section */}
      <div className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Popular Subjects</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explore study materials across various disciplines and enhance your learning journey
            </p>
          </motion.div>

          {/* Mobile View - Horizontal Scroll */}
          <div className="md:hidden overflow-x-auto -mx-4 px-4">
            <div className="flex space-x-4 pb-6">
              {subjects.map((subject, index) => (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex-shrink-0 w-64"
                >
                  <Link
                    to={`/notes?subject=${subject.id}`}
                    className="block group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${subject.gradient} opacity-90 group-hover:opacity-100 transition-opacity`} />
                    <div className="relative p-6 text-white">
                      <span className="text-3xl mb-3 block">{subject.icon}</span>
                      <h3 className="text-lg font-semibold mb-1">{subject.name}</h3>
                      <p className="text-sm text-white/80 mb-3">{subject.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{subject.count}</span>
                        <FaArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Desktop View - Grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject, index) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/notes?subject=${subject.id}`}
                  className="group block relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${subject.gradient} opacity-90 group-hover:opacity-100 transition-opacity`} />
                  <div className="relative p-6 text-white">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-4xl">{subject.icon}</span>
                      <span className="text-sm font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        {subject.count}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{subject.name}</h3>
                    <p className="text-sm text-white/80 mb-4">{subject.description}</p>
                    <div className="flex items-center text-sm font-medium">
                      <span>Browse Notes</span>
                      <FaArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Notes Categories Section */}
      {/* <NotesCategories /> */}
    </div>
  );
};

export default Home;