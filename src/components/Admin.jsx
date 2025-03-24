import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaBook, FaBlog, FaTrash, FaEdit, FaCheck, FaTimes, FaUser } from 'react-icons/fa';
import { AuthContext } from '../contects/AuthProvider';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [books, setBooks] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdminAccess = async () => {
            const userRole = Cookies.get('userRole');
            const authToken = Cookies.get('authToken');

            if (!userRole || userRole !== 'admin' || !authToken) {
                navigate('/login');
                return;
            }

            try {
                // Verify admin status with backend
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/verify-admin`, {
                    headers: { Authorization: `Bearer ${authToken}` }
                });

                if (!response.data.isAdmin) {
                    navigate('/login');
                }
            } catch (error) {
                console.error('Admin verification failed:', error);
                navigate('/login');
            }
        };

        checkAdminAccess();
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const authToken = Cookies.get('authToken');

            try {
                const [usersResponse, booksResponse, blogsResponse] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_API_URL}/users`, {
                        headers: { Authorization: `Bearer ${authToken}` }
                    }),
                    axios.get(`${process.env.REACT_APP_API_URL}/books`, {
                        headers: { Authorization: `Bearer ${authToken}` }
                    }),
                    axios.get(`${process.env.REACT_APP_API_URL}/blogs`, {
                        headers: { Authorization: `Bearer ${authToken}` }
                    })
                ]);

                setUsers(usersResponse.data);
                setBooks(booksResponse.data);
                setBlogs(blogsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const authToken = Cookies.get('authToken');
                const response = await axios.delete(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
                    headers: { Authorization: `Bearer ${authToken}` }
                });

                if (response.status === 200) {
                    setUsers(users => users.filter(user => user._id !== userId));
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const handleToggleAdmin = async (userId, isCurrentlyAdmin) => {
        try {
            const authToken = Cookies.get('authToken');
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/users/${userId}/toggle-admin`,
                { isAdmin: !isCurrentlyAdmin },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );

            if (response.status === 200) {
                setUsers(users =>
                    users.map(user =>
                        user._id === userId ? { ...user, isAdmin: !isCurrentlyAdmin } : user
                    )
                );
            }
        } catch (error) {
            console.error('Error toggling admin status:', error);
        }
    };

    const handleDeleteBook = async (bookId) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                const authToken = Cookies.get('authToken');
                const response = await axios.delete(`${process.env.REACT_APP_API_URL}/books/${bookId}`, {
                    headers: { Authorization: `Bearer ${authToken}` }
                });

                if (response.status === 200) {
                    setBooks(books => books.filter(book => book._id !== bookId));
                }
            } catch (error) {
                console.error('Error deleting book:', error);
            }
        }
    };

    const handleDeleteBlog = async (blogId) => {
        if (window.confirm('Are you sure you want to delete this blog post?')) {
            try {
                const authToken = Cookies.get('authToken');
                const response = await axios.delete(`${process.env.REACT_APP_API_URL}/blogs/${blogId}`, {
                    headers: { Authorization: `Bearer ${authToken}` }
                });

                if (response.status === 200) {
                    setBlogs(blogs => blogs.filter(blog => blog._id !== blogId));
                }
            } catch (error) {
                console.error('Error deleting blog:', error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-[#FDF8F7] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-4 px-6" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`px-4 py-4 flex items-center gap-2 font-medium text-sm border-b-2 ${
                                    activeTab === 'users'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <FaUsers className="w-5 h-5" />
                                Users
                            </button>
                            <button
                                onClick={() => setActiveTab('books')}
                                className={`px-4 py-4 flex items-center gap-2 font-medium text-sm border-b-2 ${
                                    activeTab === 'books'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <FaBook className="w-5 h-5" />
                                Books
                            </button>
                            <button
                                onClick={() => setActiveTab('blogs')}
                                className={`px-4 py-4 flex items-center gap-2 font-medium text-sm border-b-2 ${
                                    activeTab === 'blogs'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <FaBlog className="w-5 h-5" />
                                Blogs
                            </button>
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {activeTab === 'users' && (
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">User Management</h3>
                                {loading ? (
                                    <div className="space-y-4">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="animate-pulse flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                                <div className="flex-1">
                                                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                                                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead>
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        User
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Email
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Role
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {users.map((user) => (
                                                    <tr key={user._id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                                    {user.photoURL ? (
                                                                        <img
                                                                            src={user.photoURL}
                                                                            alt={user.displayName}
                                                                            className="w-full h-full rounded-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <FaUser className="w-5 h-5 text-blue-500" />
                                                                    )}
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {user.displayName || 'No name'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">{user.email}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                user.isAdmin
                                                                    ? 'bg-blue-100 text-blue-800'
                                                                    : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {user.isAdmin ? 'Admin' : 'User'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            <button
                                                                onClick={() => handleToggleAdmin(user._id, user.isAdmin)}
                                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                                            >
                                                                {user.isAdmin ? (
                                                                    <FaTimes className="w-5 h-5" />
                                                                ) : (
                                                                    <FaCheck className="w-5 h-5" />
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteUser(user._id)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                <FaTrash className="w-5 h-5" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'books' && (
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Book Management</h3>
                                {loading ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} className="animate-pulse">
                                                <div className="h-40 bg-gray-200 rounded-xl mb-4"></div>
                                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {books.map((book) => (
                                            <div
                                                key={book._id}
                                                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                                            >
                                                <img
                                                    src={book.imageURL}
                                                    alt={book.title}
                                                    className="w-full h-40 object-cover"
                                                />
                                                <div className="p-4">
                                                    <h4 className="text-lg font-bold text-gray-900 mb-2">{book.title}</h4>
                                                    <p className="text-gray-600 text-sm mb-4">
                                                        by {book.author}
                                                        <br />
                                                        Uploaded by: {book.uploadedBy}
                                                    </p>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-blue-600 font-medium">${book.price}</span>
                                                        <button
                                                            onClick={() => handleDeleteBook(book._id)}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <FaTrash className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'blogs' && (
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Blog Management</h3>
                                {loading ? (
                                    <div className="space-y-6">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="animate-pulse">
                                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                                                <div className="h-20 bg-gray-200 rounded"></div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {blogs.map((blog) => (
                                            <div
                                                key={blog._id}
                                                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h4 className="text-xl font-bold text-gray-900 mb-2">
                                                            {blog.title}
                                                        </h4>
                                                        <p className="text-sm text-gray-500">
                                                            Posted by: {blog.author}
                                                            <br />
                                                            {new Date(blog.date).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteBlog(blog._id)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <FaTrash className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                <p className="text-gray-600">{blog.body}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin; 