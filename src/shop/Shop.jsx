import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaBookOpen, FaHeart, FaRegHeart, FaStar, FaFilter, FaTimes, FaSort, FaShare, FaDownload } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Shop = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [wishlist, setWishlist] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('newest');
  const [quickViewBook, setQuickViewBook] = useState(null);

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'engineering', name: 'Engineering' },
    { id: 'science', name: 'Science' },
    { id: 'mathematics', name: 'Mathematics' },
    { id: 'computer-science', name: 'Computer Science' }
  ];

  useEffect(() => {
    fetchBooks();
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/all-books');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Failed to fetch books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = (bookId) => {
    const newWishlist = wishlist.includes(bookId)
      ? wishlist.filter(id => id !== bookId)
      : [...wishlist, bookId];
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    toast.success(wishlist.includes(bookId) ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const filteredAndSortedBooks = books
    .filter(book => {
      const matchesSearch = book.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.authorName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
      const matchesPrice = (!book.price || (book.price >= priceRange[0] && book.price <= priceRange[1]));
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'title':
          return a.bookTitle.localeCompare(b.bookTitle);
        case 'author':
          return a.authorName.localeCompare(b.authorName);
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });

  // Loading skeleton component
  const BookSkeleton = () => (
    <div className="bg-white rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );

  // Add the BookDetailsModal component (same as in Home.jsx)
  const BookDetailsModal = ({ book, onClose }) => {
    if (!book) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 md:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl overflow-hidden w-full max-w-[95vw] sm:max-w-[85vw] md:max-w-5xl max-h-[95vh] sm:max-h-[90vh] md:max-h-[85vh] shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="sticky top-0 bg-white z-10 px-4 sm:px-6 py-3 sm:py-4 border-b flex justify-between items-center backdrop-blur-xl backdrop-saturate-150 bg-white/80">
            <div className="flex items-center gap-3 sm:gap-4">
              <button 
                onClick={onClose} 
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-xl transition-all hover:scale-105 active:scale-95"
              >
                <FaTimes className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
              </button>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Book Details</h3>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={() => toggleWishlist(book._id)}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-xl transition-all hover:scale-105 active:scale-95"
              >
                {wishlist.includes(book._id) ? (
                  <FaHeart className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                ) : (
                  <FaRegHeart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                )}
              </button>
              <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-xl transition-all hover:scale-105 active:scale-95">
                <FaShare className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="overflow-y-auto max-h-[calc(95vh-4rem)] sm:max-h-[calc(90vh-4rem)] md:max-h-[calc(85vh-4rem)]">
            <div className="p-4 sm:p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                {/* Book Cover */}
                <div className="md:col-span-5 lg:col-span-4">
                  <div className="aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg bg-gray-100 max-w-[280px] mx-auto">
                    <img
                      src={book.imgUrl || 'https://edit.org/images/cat/book-covers-big-2019101610.jpg'}
                      alt={book.bookTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3 max-w-[280px] mx-auto">
                    <button 
                      onClick={() => window.open(book.bookPdfUrl, '_blank')}
                      className="w-full py-3 sm:py-3.5 bg-blue-500 text-white rounded-lg sm:rounded-xl font-medium hover:bg-blue-600 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
                    >
                      <FaBookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                      Start reading
                    </button>
                    <button 
                      onClick={() => window.open(book.bookPdfUrl, '_blank')}
                      className="w-full py-3 sm:py-3.5 border-2 border-blue-500 text-blue-500 rounded-lg sm:rounded-xl font-medium hover:bg-blue-50 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                    >
                      <FaDownload className="w-4 h-4 sm:w-5 sm:h-5" />
                      Download PDF
                    </button>
                  </div>
                </div>

                {/* Book Details */}
                <div className="md:col-span-7 lg:col-span-8">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">{book.bookTitle}</h1>
                  <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">{book.authorName}</p>
                  
                  <div className="prose max-w-none space-y-6 sm:space-y-8">
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-900">Description</h3>
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{book.description || 'No description available.'}</p>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">Details</h3>
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                          <dt className="text-xs sm:text-sm text-gray-500 mb-1">Category</dt>
                          <dd className="text-gray-900 font-medium text-sm sm:text-base">{book.category}</dd>
                        </div>
                        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                          <dt className="text-xs sm:text-sm text-gray-500 mb-1">Language</dt>
                          <dd className="text-gray-900 font-medium text-sm sm:text-base">{book.language || 'English'}</dd>
                        </div>
                        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                          <dt className="text-xs sm:text-sm text-gray-500 mb-1">Pages</dt>
                          <dd className="text-gray-900 font-medium text-sm sm:text-base">{book.pages || 'N/A'}</dd>
                        </div>
                        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                          <dt className="text-xs sm:text-sm text-gray-500 mb-1">Published</dt>
                          <dd className="text-gray-900 font-medium text-sm sm:text-base">{new Date(book.createdAt).toLocaleDateString()}</dd>
                        </div>
                        {book.price && (
                          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                            <dt className="text-xs sm:text-sm text-gray-500 mb-1">Price</dt>
                            <dd className="text-gray-900 font-medium text-sm sm:text-base">${book.price.toFixed(2)}</dd>
                          </div>
                        )}
                      </dl>
                    </div>

                    {book.rating && (
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">Rating</h3>
                        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg sm:rounded-xl flex items-center gap-2 sm:gap-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={`w-5 h-5 sm:w-6 sm:h-6 ${
                                  i < Math.floor(book.rating)
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm sm:text-base text-gray-600 font-medium">
                            {book.rating} out of 5
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDF8F7] pt-20">
      <ToastContainer position="bottom-right" />
      
      {/* Header */}
      <div className="bg-white shadow-md sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="w-full sm:w-96">
              <div className="relative">
          <input
            type="text"
            placeholder="Search books..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-shadow hover:shadow-md text-gray-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
        </div>
        
            {/* Controls */}
            <div className="flex gap-3 items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="p-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                <FaFilter className={`w-5 h-5 ${showFilters ? "text-blue-500" : "text-gray-500"}`} />
              </motion.button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 transition-all text-gray-600 cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="title">Title</option>
                <option value="author">Author</option>
              </select>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-6 border-t mt-6">
                  <div className="flex flex-wrap gap-6 items-center">
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-700">Price Range</label>
                      <div className="flex gap-3 items-center">
                        <input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                          className="w-28 p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                          className="w-28 p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
            </div>
          </div>

                    <div className="flex gap-3 overflow-x-auto pb-1">
                      {categories.map(category => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`px-8 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all hover:scale-105 active:scale-95
                            ${selectedCategory === category.id
                              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          {category.name}
                        </button>
              ))}
            </div>
          </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {[...Array(10)].map((_, i) => (
              <BookSkeleton key={i} />
            ))}
      </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6"
          >
            {filteredAndSortedBooks.map(book => (
      <motion.div
                key={book._id}
                layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
                className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div 
                  className="aspect-[3/4] cursor-pointer"
                  onClick={() => setQuickViewBook(book)}
                >
                  <img
                    src={book.imgUrl || 'https://edit.org/images/cat/book-covers-big-2019101610.jpg'}
                    alt={book.bookTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(book.bookPdfUrl, '_blank');
                        }}
                        className="flex-1 bg-blue-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                      >
                        <FaBookOpen className="w-4 h-4" />
                        Read
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(book._id);
                        }}
                        className="p-2.5 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-all hover:scale-105 active:scale-95"
                      >
                        {wishlist.includes(book._id) ? (
                          <FaHeart className="w-4 h-4 text-blue-500" />
                        ) : (
                          <FaRegHeart className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-500 transition-colors line-clamp-1">
                    {book.bookTitle}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1.5">{book.authorName}</p>
                  {book.price && (
                    <p className="text-sm font-medium text-gray-900 mt-2">${book.price.toFixed(2)}</p>
                  )}
                </div>
              </motion.div>
        ))}
      </motion.div>
        )}

        {!loading && filteredAndSortedBooks.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-gray-900 mb-3">No books found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Book Details Modal */}
      <AnimatePresence>
        {quickViewBook && (
          <BookDetailsModal book={quickViewBook} onClose={() => setQuickViewBook(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;

