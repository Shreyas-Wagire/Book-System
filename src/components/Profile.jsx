import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contects/AuthProvider';
import { motion } from 'framer-motion';
import { FaUser, FaBook, FaBlog, FaCog, FaSignOutAlt, FaEdit, FaTrash, FaCamera, FaSave, FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const Profile = () => {
    const { user, logOut } = useContext(AuthContext);
    const [userBooks, setUserBooks] = useState([]);
    const [userBlogs, setUserBlogs] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState({
        displayName: user?.displayName || '',
        photoURL: user?.photoURL || 'https://via.placeholder.com/150',
        bio: '',
        skills: [],
        newSkill: ''
    });
    const [previewImage, setPreviewImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const authToken = Cookies.get('authToken');
            if (!authToken) {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/verify-user`, {
                    headers: { Authorization: `Bearer ${authToken}` }
                });

                if (!response.data.isValid) {
                    navigate('/login');
                }
            } catch (error) {
                console.error('Auth verification failed:', error);
                navigate('/login');
            }
        };

        checkAuth();
    }, [navigate]);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            const authToken = Cookies.get('authToken');

            try {
                const [profileResponse, booksResponse, blogsResponse] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_API_URL}/users/profile`, {
                        headers: { Authorization: `Bearer ${authToken}` }
                    }),
                    axios.get(`${process.env.REACT_APP_API_URL}/users/books`, {
                        headers: { Authorization: `Bearer ${authToken}` }
                    }),
                    axios.get(`${process.env.REACT_APP_API_URL}/users/blogs`, {
                        headers: { Authorization: `Bearer ${authToken}` }
                    })
                ]);

                setProfileData(profileResponse.data);
                setUserBooks(booksResponse.data);
                setUserBlogs(blogsResponse.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchUserData();
        }
    }, [user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddSkill = () => {
        if (profileData.newSkill.trim()) {
            setProfileData(prev => ({
                ...prev,
                skills: [...prev.skills, prev.newSkill.trim()],
                newSkill: ''
            }));
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setProfileData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const authToken = Cookies.get('authToken');
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/users/profile`,
                profileData,
                { headers: { Authorization: `Bearer ${authToken}` } }
            );

            if (response.status === 200) {
                setProfileData(response.data);
            }
        } catch (error) {
            console.error('Error saving profile:', error);
        } finally {
            setLoading(false);
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
                    setUserBooks(books => books.filter(book => book._id !== bookId));
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
                    setUserBlogs(blogs => blogs.filter(blog => blog._id !== blogId));
                }
            } catch (error) {
                console.error('Error deleting blog:', error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-[#FDF8F7] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
                    >
                        <div className="text-center mb-8">
                            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                {previewImage || profileData.photoURL ? (
                                    <img
                                        src={previewImage || profileData.photoURL}
                                        alt={user?.displayName}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <FaUser className="w-12 h-12 text-blue-500" />
                                )}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">{user?.displayName || 'User'}</h2>
                            <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
                            {isAdmin && (
                                <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                    Admin
                                </span>
                            )}
                        </div>

                        <nav className="space-y-2">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`w-full px-4 py-2 rounded-xl flex items-center gap-3 transition-colors ${
                                    activeTab === 'profile'
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <FaUser className="w-5 h-5" />
                                Profile
                            </button>
                            <button
                                onClick={() => setActiveTab('books')}
                                className={`w-full px-4 py-2 rounded-xl flex items-center gap-3 transition-colors ${
                                    activeTab === 'books'
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <FaBook className="w-5 h-5" />
                                My Books
                            </button>
                            <button
                                onClick={() => setActiveTab('blogs')}
                                className={`w-full px-4 py-2 rounded-xl flex items-center gap-3 transition-colors ${
                                    activeTab === 'blogs'
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <FaBlog className="w-5 h-5" />
                                My Blogs
                            </button>
                            {isAdmin && (
                                <button
                                    onClick={() => setActiveTab('admin')}
                                    className={`w-full px-4 py-2 rounded-xl flex items-center gap-3 transition-colors ${
                                        activeTab === 'admin'
                                            ? 'bg-blue-500 text-white'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <FaCog className="w-5 h-5" />
                                    Admin Panel
                                </button>
                            )}
                            <button
                                onClick={logOut}
                                className="w-full px-4 py-2 rounded-xl flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <FaSignOutAlt className="w-5 h-5" />
                                Sign Out
                            </button>
                        </nav>
                    </motion.div>

                    {/* Main Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:col-span-3 bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
                    >
                        {activeTab === 'profile' && (
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <p className="mt-1 text-gray-900">{user?.displayName || 'Not set'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <p className="mt-1 text-gray-900">{user?.email}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Role</label>
                                        <p className="mt-1 text-gray-900">{isAdmin ? 'Admin' : 'User'}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'books' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900">My Books</h3>
                                    <Link
                                        to="/upload-book"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                                    >
                                        Upload New Book
                                    </Link>
                                </div>
                                {loading ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="animate-pulse">
                                                <div className="h-40 bg-gray-200 rounded-xl mb-4"></div>
                                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                            </div>
                                        ))}
                                    </div>
                                ) : userBooks.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {userBooks.map((book) => (
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
                                                    <p className="text-gray-600 text-sm mb-4">{book.author}</p>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-blue-600 font-medium">${book.price}</span>
                                                        <button
                                                            onClick={() => handleDeleteBook(book._id)}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-600 text-center py-8">You haven't uploaded any books yet.</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'blogs' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900">My Blog Posts</h3>
                                    <Link
                                        to="/create-blog"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                                    >
                                        Create New Post
                                    </Link>
                                </div>
                                {loading ? (
                                    <div className="space-y-6">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="animate-pulse">
                                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                                                <div className="h-20 bg-gray-200 rounded"></div>
                                            </div>
                                        ))}
                                    </div>
                                ) : userBlogs.length > 0 ? (
                                    <div className="space-y-6">
                                        {userBlogs.map((blog) => (
                                            <div
                                                key={blog._id}
                                                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                                            >
                                                <h4 className="text-xl font-bold text-gray-900 mb-2">{blog.title}</h4>
                                                <p className="text-gray-600 mb-4">{blog.body}</p>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(blog.date).toLocaleDateString()}
                                                    </span>
                                                    <button
                                                        onClick={() => handleDeleteBlog(blog._id)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-600 text-center py-8">You haven't created any blog posts yet.</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'admin' && isAdmin && (
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Admin Panel</h3>
                                {/* Admin features will be added in the next step */}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Profile; 