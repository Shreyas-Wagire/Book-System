import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay, EffectCoverflow } from "swiper/modules"
import { FaStar, FaQuoteLeft, FaQuoteRight, FaHeart } from "react-icons/fa"

// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/autoplay"
import "swiper/css/effect-coverflow"

const reviews = [
  {
    name: "Prathmesh Sutar",
    jobTitle: "Student",
    company: "ADCET",
    review:
      "This platform has transformed my learning experience. The comprehensive study materials and intuitive interface make studying a breeze.",
    rating: 5,
    avatarSrc: "https://i.pravatar.cc/100?img=1",
    backgroundColor: "from-blue-50 to-indigo-50",
    likes: 234,
    date: "2 days ago"
  },
  {
    name: "Dhanraj Gaikwad",
    jobTitle: "Student",
    company: "ADCET",
    review:
      "The quality of educational resources available here is outstanding. It's helped me stay ahead in my studies consistently.",
    rating: 4,
    avatarSrc: "https://i.pravatar.cc/100?img=2",
    backgroundColor: "from-purple-50 to-pink-50",
    likes: 189,
    date: "1 week ago"
  },
  {
    name: "Sarah Thompson",
    jobTitle: "UX Designer",
    company: "DesignHub",
    review:
      "As an educator, I'm impressed by the platform's user experience. It makes sharing knowledge and resources incredibly efficient.",
    rating: 5,
    avatarSrc: "https://i.pravatar.cc/100?img=3",
    backgroundColor: "from-emerald-50 to-teal-50",
    likes: 312,
    date: "3 days ago"
  },
  {
    name: "David Rodriguez",
    jobTitle: "Project Manager",
    company: "BuildCo",
    review:
      "The collaborative features have made group studying so much easier. It's like having a virtual study group available 24/7.",
    rating: 4,
    avatarSrc: "https://i.pravatar.cc/100?img=4",
    backgroundColor: "from-orange-50 to-amber-50",
    likes: 156,
    date: "5 days ago"
  },
  {
    name: "Lisa Patel",
    jobTitle: "Data Analyst",
    company: "DataInsights",
    review:
      "The way this platform organizes educational content is brilliant. Finding and accessing study materials has never been easier.",
    rating: 5,
    avatarSrc: "https://i.pravatar.cc/100?img=5",
    backgroundColor: "from-rose-50 to-pink-50",
    likes: 278,
    date: "1 day ago"
  },
]

const Review = () => {
  const [swiper, setSwiper] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [likedReviews, setLikedReviews] = useState({})
  const [stats, setStats] = useState({ total: 0, average: 0 })

  useEffect(() => {
    // Calculate statistics
    const total = reviews.length
    const average = (reviews.reduce((acc, curr) => acc + curr.rating, 0) / total).toFixed(1)
    setStats({ total, average })
  }, [])

  const handleLike = (index) => {
    setLikedReviews(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  return (
    <motion.section 
      className="py-16 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20" />
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          className="text-center mb-16"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Voices of Our <span className="text-blue-600">Community</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Discover what our users have to say about their learning journey with us
          </p>
          
          {/* Stats Section */}
          <div className="flex justify-center gap-8 mb-12">
            <motion.div 
              className="text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-gray-600">Total Reviews</div>
            </motion.div>
            <motion.div 
              className="text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-3xl font-bold text-blue-600">{stats.average}</div>
              <div className="text-gray-600">Average Rating</div>
            </motion.div>
          </div>
        </motion.div>

        <Swiper
          onSwiper={setSwiper}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop={reviews.length > 3}
          modules={[Pagination, Autoplay, EffectCoverflow]}
          className="mySwiper !pb-16"
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index} className="!w-[380px]">
              <motion.div
                className={`flex flex-col h-full p-8 rounded-2xl shadow-lg bg-gradient-to-br ${review.backgroundColor} backdrop-blur-sm border border-white/20`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="flex justify-between items-center mb-6">
                  <FaQuoteLeft className="text-2xl text-blue-500 opacity-50" />
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * i }}
                      >
                        <FaStar 
                          className={`w-5 h-5 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>

                <blockquote className="flex-grow mb-6">
                  <p className="text-lg leading-relaxed text-gray-700">{review.review}</p>
                </blockquote>

                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <motion.div
                      className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md"
                      whileHover={{ scale: 1.1 }}
                    >
                      <img
                        src={review.avatarSrc}
                        alt={review.name}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-semibold text-gray-800">{review.name}</h4>
                    <p className="text-sm text-gray-600">
                      {review.jobTitle} • {review.company}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{review.date}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <motion.button
                      className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors"
                      onClick={() => handleLike(index)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaHeart className={likedReviews[index] ? "text-red-500" : ""} />
                      <span className="text-sm">{review.likes + (likedReviews[index] ? 1 : 0)}</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {reviews.map((_, index) => (
            <motion.button
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                activeIndex === index ? "bg-blue-600 w-6" : "bg-gray-300"
              }`}
              onClick={() => swiper.slideTo(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>
    </motion.section>
  )
}

export default Review

