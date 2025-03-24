import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { booksApi } from '../utils/api';
import { toast } from 'react-hot-toast';

const ManageBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBooks();
    }, [selectedCategory]);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await booksApi.getAll(selectedCategory !== 'all' ? selectedCategory : null);
            
            if (response && Array.isArray(response.books)) {
                setBooks(response.books);
                if (response.books.length > 0) {
                    toast.success(`${response.books.length} books loaded successfully`);
                } else {
                    toast.info('No books found');
                }
            } else {
                throw new Error('Invalid response format from server');
            }
        } catch (error) {
            console.error('Error fetching books:', error);
            setError(error.message || 'Failed to fetch books. Please try again later.');
            toast.error(error.message || 'Failed to fetch books. Please try again later.');
            setBooks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await booksApi.delete(id);
                setBooks(books.filter(book => book._id !== id));
                toast.success('Book deleted successfully');
            } catch (error) {
                console.error('Error deleting book:', error);
                toast.error(error.message || 'Failed to delete book');
            }
        }
    };

    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            book.author?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ['all', ...new Set(books.map(book => book.category))];

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Manage Books</h1>
                    <Link
                        to="/admin/dashboard/upload"
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Add New Book
                    </Link>
                </div>

                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Search books..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 rounded-lg border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="rounded-lg border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredBooks.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBooks.map((book) => (
                            <motion.div
                                key={book._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-lg shadow-md overflow-hidden"
                            >
                                <img
                                    src={book.imageURL}
                                    alt={book.title}
                                    className="w-full h-48 object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                    }}
                                />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{book.title}</h3>
                                    <p className="text-gray-600 mb-2">By {book.author}</p>
                                    <p className="text-sm text-gray-500 mb-2">{book.description}</p>
                                    <p className="text-purple-600 font-medium mb-4">${book.price}</p>
                                    <div className="flex justify-between items-center">
                                        <Link
                                            to={`/admin/dashboard/edit-book/${book._id}`}
                                            className="text-blue-600 hover:text-blue-700 flex items-center"
                                        >
                                            <FaEdit className="mr-1" />
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(book._id)}
                                            className="text-red-600 hover:text-red-700 flex items-center"
                                        >
                                            <FaTrash className="mr-1" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No books found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageBooks; 