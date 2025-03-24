import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaBook, FaBlog, FaCog, FaSignOutAlt, FaChartLine } from 'react-icons/fa';
import { AuthContext } from '../contects/AuthProvider';

const Dashboard = () => {
    const { user, logOut, isAdmin } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalBlogs: 0,
        recentActivity: []
    });
    const navigate = useNavigate();

    useEffect(() => {
        // Here you would typically fetch dashboard data from your backend
        // For now, we'll use mock data
        setStats({
            totalBooks: 25,
            totalBlogs: 10,
            recentActivity: [
                { type: 'book', action: 'added', title: 'The Great Gatsby', date: '2024-03-20' },
                { type: 'blog', action: 'published', title: 'Reading Habits', date: '2024-03-19' },
                { type: 'book', action: 'updated', title: '1984', date: '2024-03-18' }
            ]
        });
    }, []);

    const handleLogout = async () => {
        try {
            await logOut();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: FaChartLine },
        { id: 'profile', label: 'Profile', icon: FaUser },
        { id: 'books', label: 'Books', icon: FaBook },
        { id: 'blogs', label: 'Blogs', icon: FaBlog },
        { id: 'settings', label: 'Settings', icon: FaCog }
    ];

    if (isAdmin()) {
        menuItems.push({ id: 'admin', label: 'Admin Panel', icon: FaCog });
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex">
                {/* Sidebar */}
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="w-64 bg-white h-screen shadow-lg fixed"
                >
                    <div className="p-6">
                        <div className="flex items-center space-x-4 mb-6">
                            <img
                                src={user?.photoURL || 'https://via.placeholder.com/40'}
                                alt="Profile"
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                <h3 className="font-medium text-gray-900">{user?.displayName || 'User'}</h3>
                                <p className="text-sm text-gray-500">{user?.email}</p>
                            </div>
                        </div>

                        <nav className="space-y-1">
                            {menuItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        if (item.id === 'profile') {
                                            navigate('/profile');
                                        }
                                    }}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 text-sm rounded-lg transition-colors ${
                                        activeTab === item.id
                                            ? 'bg-purple-50 text-purple-700'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </button>
                            ))}

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <FaSignOutAlt className="w-5 h-5" />
                                <span>Logout</span>
                            </button>
                        </nav>
                    </div>
                </motion.div>

                {/* Main Content */}
                <div className="flex-1 ml-64 p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                                
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white rounded-xl shadow-sm p-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-medium text-gray-900">Total Books</h3>
                                            <FaBook className="w-8 h-8 text-purple-500" />
                                        </div>
                                        <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalBooks}</p>
                                    </div>

                                    <div className="bg-white rounded-xl shadow-sm p-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-medium text-gray-900">Total Blogs</h3>
                                            <FaBlog className="w-8 h-8 text-purple-500" />
                                        </div>
                                        <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalBlogs}</p>
                                    </div>

                                    <div className="bg-white rounded-xl shadow-sm p-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-medium text-gray-900">Role</h3>
                                            <FaUser className="w-8 h-8 text-purple-500" />
                                        </div>
                                        <p className="mt-2 text-xl font-medium text-gray-900">
                                            {isAdmin() ? 'Administrator' : 'User'}
                                        </p>
                                    </div>
                                </div>

                                {/* Recent Activity */}
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                                    <div className="space-y-4">
                                        {stats.recentActivity.map((activity, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    {activity.type === 'book' ? (
                                                        <FaBook className="w-5 h-5 text-purple-500" />
                                                    ) : (
                                                        <FaBlog className="w-5 h-5 text-purple-500" />
                                                    )}
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {activity.title}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="text-sm text-gray-500">{activity.date}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 