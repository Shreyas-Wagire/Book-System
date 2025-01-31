
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"

const BookCard = ({ book, handleButtonClick }) => (
  <motion.div
    className="bg-white rounded-lg shadow-lg overflow-hidden"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <img src={book.imgUrl || "/placeholder.svg"} alt={book.bookTitle} className="w-full h-64 object-cover" />
    <div className="p-4">
      <h3 className="text-xl font-bold mb-2 truncate">{book.bookTitle}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{book.bookDescription}</p>
      <button
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-1"
        onClick={() => handleButtonClick(book.bookPdfUrl)}
      >
        View PDF
      </button>
    </div>
  </motion.div>
)

const Shop = () => {
  const [books, setBooks] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredBooks, setFilteredBooks] = useState([])

  useEffect(() => {
    fetch("http://localhost:5000/all-books")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data)
        setFilteredBooks(data)
      })
  }, [])

  useEffect(() => {
    const results = books.filter((book) => book.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredBooks(results)
  }, [searchTerm, books])

  const handleButtonClick = (url) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="mt-28 px-4 lg:px-24">
      <motion.h2
        className="text-5xl font-bold text-center mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Discover Our Collection
      </motion.h2>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search books..."
          className="w-full p-4 pr-12 rounded-full border-2 border-gray-300 focus:outline-none focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      <motion.div
        className="grid gap-8 my-12 lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {filteredBooks.map((book, index) => (
          <BookCard key={book._id} book={book} handleButtonClick={handleButtonClick} />
        ))}
      </motion.div>

      {filteredBooks.length === 0 && (
        <motion.p
          className="text-center text-gray-500 text-xl mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          No books found. Try a different search term.
        </motion.p>
      )}
    </div>
  )
}

export default Shop

