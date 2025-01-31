import React, { useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay } from "swiper/modules"
import { FaStar } from "react-icons/fa"

// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/autoplay"

const reviews = [
  {
    name: "Prathmesh Sutar",
    jobTitle: "Student",
    company: "ADCET",
    review:
      "This product has revolutionized our workflow. The intuitive interface and powerful features have significantly boosted our team's productivity.",
    rating: 5,
    avatarSrc: "https://i.pravatar.cc/100?img=1",
  },
  {
    name: "Dhanraj Gaikwad",
    jobTitle: "Student",
    company: "ADCET",
    review:
      "As a developer, I appreciate the robust API and excellent documentation. It's been a joy to integrate this into our systems.",
    rating: 4,
    avatarSrc: "https://i.pravatar.cc/100?img=2",
  },
  {
    name: "Sarah Thompson",
    jobTitle: "UX Designer",
    company: "DesignHub",
    review:
      "The attention to detail in the user experience is outstanding. It's clear that a lot of thought went into making this product user-friendly.",
    rating: 5,
    avatarSrc: "https://i.pravatar.cc/100?img=3",
  },
  {
    name: "David Rodriguez",
    jobTitle: "Project Manager",
    company: "BuildCo",
    review:
      "This tool has streamlined our project management process. The collaborative features are particularly impressive.",
    rating: 4,
    avatarSrc: "https://i.pravatar.cc/100?img=4",
  },
  {
    name: "Lisa Patel",
    jobTitle: "Data Analyst",
    company: "DataInsights",
    review:
      "The data visualization capabilities are top-notch. It's made presenting complex information to stakeholders much easier.",
    rating: 5,
    avatarSrc: "https://i.pravatar.cc/100?img=5",
  },
]

const Review = () => {
  const [swiper, setSwiper] = useState(null)

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
        <Swiper
          onSwiper={setSwiper}
          slidesPerView={1}
          spaceBetween={30}
          pagination={{
            clickable: true,
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
          modules={[Pagination, Autoplay]}
          className="mySwiper"
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-col h-full p-6 bg-white rounded-lg shadow-lg border border-gray-200">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"} />
                  ))}
                </div>
                <blockquote className="flex-grow">
                  <p className="text-lg leading-relaxed text-gray-700">{review.review}</p>
                </blockquote>
                <div className="flex items-center mt-6 space-x-3">
                  <img
                    src={review.avatarSrc || "/placeholder.svg"}
                    alt={review.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-semibold">{review.name}</div>
                    <div className="text-sm text-gray-500">
                      {review.jobTitle}, {review.company}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default Review

