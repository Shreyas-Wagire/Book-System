import { useEffect, useState } from "react"
import { Table, Spinner, Button, TextInput } from "flowbite-react"
import { Link } from "react-router-dom"
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa"
import { motion } from "framer-motion"

const Manage = () => {
  const [allBooks, setAllBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const booksPerPage = 10

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = () => {
    setLoading(true)
    fetch("https://book-site-express-server.vercel.app/all-books")
      .then((res) => res.json())
      .then((data) => {
        setAllBooks(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching books:", error)
        setLoading(false)
      })
  }

  const handleDeleteBook = (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      setLoading(true)
      fetch(`https://book-site-express-server.vercel.app/book/${bookId}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then(() => {
          setAllBooks(allBooks.filter((book) => book._id !== bookId))
          setLoading(false)
          alert("Book deleted successfully!")
        })
        .catch((error) => {
          console.error("Error deleting book:", error)
          setLoading(false)
        })
    }
  }

  const filteredBooks = allBooks.filter((book) => book.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()))

  const indexOfLastBook = currentPage * booksPerPage
  const indexOfFirstBook = indexOfLastBook - booksPerPage
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <motion.div className="px-4 my-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h2 className="mb-8 text-3xl font-bold text-gray-800">Manage Your Books</h2>

      <div className="mb-4 flex justify-between items-center">
        <div className="relative">
          <TextInput
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={FaSearch}
          />
        </div>
        <Link to="/admin/dashboard/upload-book">
          <Button gradientDuoTone="greenToBlue">Add New Book</Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="xl" />
        </div>
      ) : (
        <>
          <Table striped className="lg:w-full">
            <Table.Head>
              <Table.HeadCell>No.</Table.HeadCell>
              <Table.HeadCell>Book Name</Table.HeadCell>
              <Table.HeadCell>Author Name</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Price</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y">
              {currentBooks.map((book, index) => (
                <Table.Row key={book._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{indexOfFirstBook + index + 1}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {book.bookTitle}
                  </Table.Cell>
                  <Table.Cell>{book.authorName}</Table.Cell>
                  <Table.Cell>{book.category}</Table.Cell>
                  <Table.Cell>${book.price || "10"}</Table.Cell>
                  <Table.Cell>
                    <Link
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 mr-5"
                      to={`/admin/dashboard/edit-book/${book._id}`}
                    >
                      <FaEdit className="inline mr-1" /> Edit
                    </Link>
                    <Button onClick={() => handleDeleteBook(book._id)} color="failure" size="sm">
                      <FaTrash className="mr-1" /> Delete
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          <div className="flex justify-center mt-4">
            {Array.from({ length: Math.ceil(filteredBooks.length / booksPerPage) }, (_, i) => (
              <Button
                key={i}
                onClick={() => paginate(i + 1)}
                color={currentPage === i + 1 ? "blue" : "gray"}
                className="mx-1"
              >
                {i + 1}
              </Button>
            ))}
          </div>
        </>
      )}
    </motion.div>
  )
}

export default Manage
