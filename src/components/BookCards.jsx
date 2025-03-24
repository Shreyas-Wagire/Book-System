import React, { useState, useEffect } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Navigation, Autoplay, EffectCoverflow } from "swiper/modules"
import { Link } from "react-router-dom"
import { FaCartShopping, FaBookOpen, FaHeart, FaShare } from "react-icons/fa6"
import { StarIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import "swiper/css/effect-coverflow"

const BookCards = ({ headLine, books }) => {
  const [hoveredId, setHoveredId] = useState(null);
  const [likedBooks, setLikedBooks] = useState(new Set());
  const [showToast, setShowToast] = useState({ show: false, message: "" });
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    // Generate and store random ratings for each book
    const newRatings = {};
    books.forEach(book => {
      newRatings[book._id] = (Math.random() * (5 - 3) + 3).toFixed(1);
    });
    setRatings(newRatings);
  }, [books]);

  const toggleLike = (bookId, e) => {
    e.preventDefault();
    setLikedBooks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(bookId)) {
        newSet.delete(bookId);
        showToastMessage("Removed from favorites");
      } else {
        newSet.add(bookId);
        showToastMessage("Added to favorites");
      }
      return newSet;
    });
  };

  const showToastMessage = (message) => {
    setShowToast({ show: true, message });
    setTimeout(() => setShowToast({ show: false, message: "" }), 2000);
  };

  const handleShare = async (e, book) => {
    e.preventDefault();
    try {
      await navigator.share({
        title: book.bookTitle,
        text: `Check out this book: ${book.bookTitle} by ${book.authorName}`,
        url: window.location.href,
      });
    } catch (err) {
      console.log("Share failed:", err);
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="my-16 px-4 lg:px-24 relative"
    >
      <h2 className="text-4xl md:text-5xl text-center font-bold text-gray-800 mb-8">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          {headLine}
        </span>
      </h2>

      <div className="mt-12">
        <Swiper
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          coverflowEffect={{
            rotate: 30,
            stretch: 0,
            depth: 100,
            modifier: 1.5,
            slideShadows: true,
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={true}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
          }}
          loop={books.length > 4}
          modules={[Pagination, Navigation, Autoplay, EffectCoverflow]}
          className="mySwiper w-full h-full"
        >
          {books.map((book) => (
            <SwiperSlide key={book._id} className="flex">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col h-full w-full relative group"
                onHoverStart={() => setHoveredId(book._id)}
                onHoverEnd={() => setHoveredId(null)}
              >
                <Link to={`/book/${book._id}`} className="flex flex-col h-full">
                  <div className="relative aspect-w-3 aspect-h-4 flex-shrink-0 overflow-hidden">
                    <motion.img
                      src={book.imgUrl || "https://edit.org/images/cat/book-covers-big-2019101610.jpg"}
                      alt={book.bookTitle}
                      className="w-full h-96 object-cover transform transition-transform duration-700"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{ opacity: hoveredId === book._id ? 1 : 0 }}
                    >
                      <div className="absolute bottom-4 left-4 right-4">
                        <motion.button
                          className="w-full bg-white text-blue-600 py-2 px-6 rounded-full font-semibold shadow-lg backdrop-blur-sm bg-white/90"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View Details
                        </motion.button>
                      </div>
                    </motion.div>
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <motion.button
                        className={`p-2 rounded-full backdrop-blur-sm ${
                          likedBooks.has(book._id) 
                            ? 'bg-red-500 text-white' 
                            : 'bg-white/90 text-gray-600'
                        } shadow-lg transform transition-transform`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => toggleLike(book._id, e)}
                      >
                        <FaHeart className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        className="bg-blue-600/90 p-2 rounded-full text-white shadow-lg backdrop-blur-sm"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaCartShopping className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        className="bg-green-500/90 p-2 rounded-full text-white shadow-lg backdrop-blur-sm"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => handleShare(e, book)}
                      >
                        <FaShare className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow bg-gradient-to-b from-white to-gray-50">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                      {book.bookTitle}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 italic">{book.authorName}</p>
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <StarIcon
                            className={`w-5 h-5 ${
                              index < Math.floor(ratings[book._id])
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        </motion.div>
                      ))}
                      <span className="ml-2 text-sm font-medium text-gray-600">
                        {ratings[book._id]}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-lg font-bold text-green-600">Free</span>
                      <motion.button
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-6 rounded-full flex items-center shadow-lg"
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(book.bookPdfUrl, "_blank");
                        }}
                      >
                        <FaBookOpen className="mr-2" />
                        Read Now
                      </motion.button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg z-50"
          >
            {showToast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-1/3 -right-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </motion.section>
  )
}

export default BookCards

