import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaSearch, FaEye, FaDownload, FaHeart, FaRegHeart, FaShare, FaFilter, FaTimes, FaSort, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { FavoritesContext } from '../contects/FavoritesContext';
import { AuthContext } from '../contects/AuthProvider';
import UserInfoCard from './UserInfoCard';
import { motion } from 'framer-motion';

const NotesShop = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  
  const { addToFavorites, removeFromFavorites, isInFavorites } = useContext(FavoritesContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'handwritten', label: 'Handwritten' },
    { value: 'printed', label: 'Printed' },
    { value: 'textbooks', label: 'Textbooks' },
    { value: 'assignments', label: 'Assignments' }
  ];

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
    'Engineering', 'Business', 'Arts', 'Languages'
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'downloads', label: 'Most Downloaded' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  useEffect(() => {
    fetchNotes();
  }, [selectedCategory, searchQuery, sortBy, currentPage, priceRange, selectedSubjects]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let url = `${import.meta.env.VITE_API_URL}/api/notes`;
      const params = new URLSearchParams();
      
      if (selectedCategory) params.append('category', selectedCategory);
      if (searchQuery) params.append('search', encodeURIComponent(searchQuery));
      if (sortBy) params.append('sort', sortBy);
      if (currentPage) params.append('page', currentPage);
      if (priceRange.min) params.append('minPrice', priceRange.min);
      if (priceRange.max) params.append('maxPrice', priceRange.max);
      if (selectedSubjects.length > 0) params.append('subjects', selectedSubjects.join(','));

      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch notes: ${response.status}`);

      const data = await response.json();
      if (!data || typeof data !== 'object') throw new Error('Invalid response format');

      setNotes(data.data || []);
      setTotalPages(data.totalPages || 1);
      setError(null);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError(error.message || 'Failed to fetch notes');
      toast.error(error.message || 'Error loading notes');
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (note) => {
    if (note.fileUrl) {
      window.open(note.fileUrl, '_blank');
      try {
        fetch(`${import.meta.env.VITE_API_URL}/api/notes/download/${note._id}`, {
          method: 'POST'
        }).catch(console.error);
      } catch (error) {
        console.error('Error updating download count:', error);
      }
    } else {
      toast.error('Download link not available');
    }
  };

  const handleNoteClick = (note) => {
    navigate(`/notes/${note._id}`);
  };

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

  const handleShare = async (e, note) => {
    e.stopPropagation();
    const url = `${window.location.origin}/notes/${note._id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: note.title,
          text: note.description || `Check out this note: ${note.title}`,
          url: url
        });
      } catch (error) {
        console.error('Error sharing:', error);
        navigator.clipboard.writeText(url)
          .then(() => toast.success('Link copied to clipboard!'))
          .catch(() => toast.error('Failed to copy link'));
      }
    } else {
      navigator.clipboard.writeText(url)
        .then(() => toast.success('Link copied to clipboard!'))
        .catch(() => toast.error('Failed to copy link'));
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubjectToggle = (subject) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    setSelectedSubjects([]);
    setCurrentPage(1);
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          <div className="aspect-[2/3] bg-gray-200"></div>
          <div className="p-3">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const categoryCards = [
    { 
      id: 'all',
      title: 'All Materials',
      value: '',
      icon: '📚',
      gradient: 'from-blue-500 to-blue-600',
      count: notes.length
    },
    { 
      id: 'handwritten',
      title: 'Handwritten Notes',
      value: 'handwritten',
      icon: '✍️',
      gradient: 'from-purple-500 to-purple-600',
      count: notes.filter(n => n.category === 'handwritten').length
    },
    { 
      id: 'printed',
      title: 'Printed Notes',
      value: 'printed',
      icon: '📄',
      gradient: 'from-pink-500 to-pink-600',
      count: notes.filter(n => n.category === 'printed').length
    },
    { 
      id: 'textbooks',
      title: 'Core Textbooks',
      value: 'textbooks',
      icon: '📘',
      gradient: 'from-indigo-500 to-indigo-600',
      count: notes.filter(n => n.category === 'textbooks').length
    },
    { 
      id: 'reference',
      title: 'Reference Books',
      value: 'reference',
      icon: '📖',
      gradient: 'from-green-500 to-green-600',
      count: notes.filter(n => n.category === 'reference').length
    },
    { 
      id: 'assignments',
      title: 'Assignment Help',
      value: 'assignments',
      icon: '✅',
      gradient: 'from-amber-500 to-amber-600',
      count: notes.filter(n => n.category === 'assignments').length
    }
  ];

  const filteredAndSortedNotes = () => {
    let filtered = [...notes];

    if (selectedCategory) {
      filtered = filtered.filter(note => note.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSubjects.length > 0) {
      filtered = filtered.filter(note => selectedSubjects.includes(note.subject));
    }

    if (priceRange.min) {
      filtered = filtered.filter(note => note.price >= Number(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(note => note.price <= Number(priceRange.max));
    }

    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'downloads':
        filtered.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return filtered;
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            {/* <h1 className="text-3xl font-bold text-gray-900 mb-2">Notes Shop</h1> */}
            {/* <p className="text-gray-600">Find and download study materials</p> */}
          </div>
          {user && (
            <div className="mt-4 md:mt-0 md:ml-4 md:w-64">
              <UserInfoCard compact={true} />
            </div>
          )}
        </div>

        {/* Category Browse Section */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categoryCards.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.value)}
                className={`relative group overflow-hidden rounded-xl transition-all duration-300 ${
                  selectedCategory === category.value 
                    ? 'ring-2 ring-blue-500 ring-offset-2' 
                    : 'hover:ring-2 hover:ring-blue-400 hover:ring-offset-2'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-90 group-hover:opacity-100 transition-opacity`} />
                <div className="relative p-4 h-full flex flex-col items-center justify-center text-white">
                  <span className="text-2xl mb-2">{category.icon}</span>
                  <h3 className="text-sm font-medium text-center mb-1">{category.title}</h3>
                  <span className="text-xs opacity-90">{category.count} items</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  showFilters 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <FaFilter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  Clear All
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subjects</label>
                  <div className="flex flex-wrap gap-2">
                    {subjects.map(subject => (
                      <button
                        key={subject}
                        onClick={() => handleSubjectToggle(subject)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedSubjects.includes(subject)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {subject}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {loading && <LoadingSkeleton />}

        {error && (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <div className="text-center max-w-md px-4">
              <h2 className="text-xl font-medium text-gray-900 mb-3">Error Loading Notes</h2>
              <p className="text-gray-500 mb-6">{error}</p>
              <button
                onClick={fetchNotes}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {!loading && !error && notes.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredAndSortedNotes().map((note) => (
                <div
                  key={note._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
                  onClick={() => handleNoteClick(note)}
                >
                  <div className="aspect-[2/3] relative">
                    <img
                      src={note.thumbnailUrl || `https://via.placeholder.com/300x450?text=${encodeURIComponent(note.title)}`}
                      alt={note.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://via.placeholder.com/300x450?text=${encodeURIComponent(note.title)}`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <div className="text-white">
                        <h3 className="text-sm font-medium mb-1 line-clamp-2">{note.title}</h3>
                        <p className="text-xs opacity-90 line-clamp-2">{note.description}</p>
                      </div>
                    </div>
                    <div className="absolute top-1 right-1 flex space-x-1">
                      {user && (
                        <button
                          onClick={(e) => toggleFavorite(e, note)}
                          className="p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
                        >
                          {isInFavorites(note._id) ? (
                            <FaHeart className="w-3 h-3 text-red-500" />
                          ) : (
                            <FaRegHeart className="w-3 h-3 text-gray-700" />
                          )}
                        </button>
                      )}
                      <button
                        onClick={(e) => handleShare(e, note)}
                        className="p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
                      >
                        <FaShare className="w-3 h-3 text-gray-700" />
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex flex-wrap gap-1 mb-2">
                      <div className="inline-block bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {note.category}
                      </div>
                      {note.subject && (
                        <div className="inline-block bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-full">
                          {note.subject}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center">
                          <FaEye className="w-3 h-3 mr-0.5" />
                          {note.views || 0}
                        </span>
                        <span className="flex items-center">
                          <FaDownload className="w-3 h-3 mr-0.5" />
                          {note.downloads || 0}
                        </span>
                      </div>
                      <span className={note.price > 0 ? 'text-amber-600 font-medium' : 'text-green-600 font-medium'}>
                        {note.price > 0 ? `$${note.price.toFixed(2)}` : 'Free'}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(note);
                      }}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-2 py-1.5 rounded-lg transition-colors"
                    >
                      Download Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-2 py-1 text-sm rounded-lg bg-white border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-2 py-1 text-sm rounded-lg ${
                        currentPage === i + 1
                          ? 'bg-blue-500 text-white'
                          : 'bg-white border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 text-sm rounded-lg bg-white border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {!loading && !error && notes.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <p className="text-gray-900 text-lg mb-1">No notes found</p>
            <p className="text-gray-500 text-center px-4">Try adjusting your search or filter criteria</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesShop; 