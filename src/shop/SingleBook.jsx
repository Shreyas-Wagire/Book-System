import React, { useState } from "react"
import { useLoaderData } from "react-router-dom"
import { FaDownload, FaBookOpen, FaShare } from "react-icons/fa"
import { motion } from "framer-motion"

const SingleBook = () => {
  const { _id, bookTitle, imgUrl, bookDescription, authorName, bookPdfUrl, publishDate, pageCount, genre } =
    useLoaderData()
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: bookTitle,
          text: `Check out this book: ${bookTitle} by ${authorName}`,
          url: window.location.href,
        })
        .then(() => {
          console.log("Successful share")
        })
        .catch((error) => {
          console.log("Error sharing", error)
        })
    } else {
      console.log("Web Share API not supported")
      // Fallback behavior here (e.g., copy link to clipboard)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-28 px-4 lg:px-24"
    >
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3">
            <motion.img
              src={imgUrl}
              alt={bookTitle}
              className="object-cover"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              width={300}   // Set fixed width
              height={400}  // Set fixed height
            />

          </div>
          <div className="md:w-2/3 p-8">
            <motion.h2
              className="text-4xl font-bold mb-4 text-gray-800"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {bookTitle}
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 mb-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              by <span className="font-semibold">{authorName}</span>
            </motion.p>
            <motion.div
              className="mb-6"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-gray-700 mb-2">
                <strong>Genre:</strong> {genre}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Published:</strong> {publishDate}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Pages:</strong> {pageCount}
              </p>
            </motion.div>
            <motion.div
              className="mb-6"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className={`text-gray-800 ${isDescriptionExpanded ? "" : "line-clamp-3"}`}>{bookDescription}</p>
              {bookDescription.length > 150 && (
                <button
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="text-blue-600 hover:text-blue-800 mt-2 focus:outline-none"
                >
                  {isDescriptionExpanded ? "Read less" : "Read more"}
                </button>
              )}
            </motion.div>
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <a
                href={bookPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full shadow-md transition duration-300 ease-in-out"
              >
                <FaDownload className="mr-2" />
                Download PDF
              </a>
              <button
                onClick={handleShare}
                className="flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-full shadow-md transition duration-300 ease-in-out"
              >
                <FaShare className="mr-2" />
                Share
              </button>
              <a
                href="#" // Add actual link to read online if available
                className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-full shadow-md transition duration-300 ease-in-out"
              >
                <FaBookOpen className="mr-2" />
                Read Online
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default SingleBook

