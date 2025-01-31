import React from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Navigation } from "swiper/modules"
import { Link } from "react-router-dom"
import { FaCartShopping, FaBookOpen } from "react-icons/fa6"
import { StarIcon } from "lucide-react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"

const BookCards = ({ headLine, books }) => {
  const generateRandomRating = () => (Math.random() * (5 - 3) + 3).toFixed(1)

  return (
    <section className="my-16 px-4 lg:px-24">
      <h2 className="text-4xl md:text-5xl text-center font-bold text-gray-800 mb-8">{headLine}</h2>

      <div className="mt-12">
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
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
          modules={[Pagination, Navigation]}
          className="mySwiper w-full h-full"
        >
          {books.map((book) => (
            <SwiperSlide key={book._id} className="flex">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 flex flex-col h-full w-full">
                <Link to={`/book/${book._id}`} className="flex flex-col h-full">
                  <div className="relative aspect-w-3 aspect-h-4 flex-shrink-0">
                    <img
                      src={book.imgUrl || "/placeholder.svg"}
                      alt={book.bookTitle}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-3 right-3 bg-blue-600 hover:bg-blue-700 p-2 rounded-full transition-colors duration-300">
                      <FaCartShopping className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">{book.bookTitle}</h3>
                    <p className="text-sm text-gray-600 mb-2">{book.authorName}</p>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, index) => (
                        <StarIcon
                          key={index}
                          className={`w-4 h-4 ${
                            index < Math.floor(generateRandomRating())
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-sm text-gray-600">{generateRandomRating()}</span>
                    </div>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-lg font-bold text-green-600">Free</span>
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full flex items-center transition-colors duration-300"
                        onClick={(e) => {
                          e.preventDefault()
                          window.open(book.bookPdfUrl, "_blank")
                        }}
                      >
                        <FaBookOpen className="mr-2" />
                        View PDF
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default BookCards

