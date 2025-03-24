import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const BooksShop = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'fiction', label: 'Fiction' },
    { value: 'non-fiction', label: 'Non-Fiction' },
    { value: 'programming', label: 'Programming' },
    { value: 'science', label: 'Science & Tech' },
    { value: 'history', label: 'History' },
    { value: 'business', label: 'Business' },
    { value: 'self-help', label: 'Self-Help' }
  ];

  useEffect(() => {
    fetchBooks();
  }, [selectedCategory, searchQuery]);

  const fetchBooks = async () => {
    try {
      let url = `${import.meta.env.VITE_API_URL}/api/all-books?`;
      if (selectedCategory) {
        url += `category=${selectedCategory}&`;
      }
      if (searchQuery) {
        url += `search=${encodeURIComponent(searchQuery)}&`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setBooks(data.books);
      } else {
        toast.error('Failed to fetch books');
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Error loading books');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Book Shop</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No books found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <Link
              to={`/book/${book._id}`}
              key={book._id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200"
            >
              <div className="relative">
                <img
                  src={book.imageURL || 'https://via.placeholder.com/400x300?text=No+Image'}
                  alt={book.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
                  {book.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 line-clamp-2">{book.title}</h3>
                <p className="text-gray-600 mb-2 line-clamp-2">{book.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-semibold">
                    ${book.price.toFixed(2)}
                  </span>
                  <span className="text-gray-500 text-sm">By {book.author}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksShop; 