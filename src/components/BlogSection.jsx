import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const BlogSection = () => {
    const blogs = [
        {
            id: 1,
            category: 'STUDY TIPS',
            title: 'Effective Study Techniques for JEE/NEET',
            image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?ixlib=rb-4.0.3',
            price: '₹49.99',
            color: 'bg-emerald-100',
            textColor: 'text-emerald-800',
            size: 'large'
        },
        {
            id: 2,
            category: 'ARCHITECTURE',
            title: 'Top Architecture Colleges in India',
            image: 'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?ixlib=rb-4.0.3',
            price: '₹39.99',
            color: 'bg-slate-800',
            textColor: 'text-white',
            size: 'medium'
        },
        {
            id: 3,
            category: 'TRAVEL',
            title: 'Campus Life at IIT Delhi',
            image: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3',
            price: '₹29.99',
            color: 'bg-amber-100',
            textColor: 'text-amber-800',
            size: 'medium'
        },
        {
            id: 4,
            category: 'INTERIOR',
            title: 'Best Study Room Setup Ideas',
            image: 'https://images.unsplash.com/photo-1598276975867-c059c169223b',
            price: '₹19.99',
            color: 'bg-sky-100',
            textColor: 'text-sky-800',
            size: 'small'
        },
        {
            id: 5,
            category: 'HEALTH',
            title: 'Stress Management During Exams',
            image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
            price: '₹24.99',
            color: 'bg-rose-100',
            textColor: 'text-rose-800',
            size: 'small'
        },
        {
            id: 6,
            category: 'PHOTOGRAPHY',
            title: 'Capturing College Memories',
            image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce',
            price: '₹34.99',
            color: 'bg-blue-100',
            textColor: 'text-blue-800',
            size: 'large'
        }
    ];

    return (
        <section className="py-8 md:py-16 px-4 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6 md:mb-12 flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">Lifestyle.</h2>
                        <p className="text-gray-600 text-sm md:text-base">
                            The latest and best articles for Indian students.
                        </p>
                    </div>
                    <Link to="/blogs" className="hidden md:flex items-center text-blue-600 hover:text-blue-800 mt-4 md:mt-0">
                        <span className="mr-2">View all articles</span>
                        <FaArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Mobile Horizontal Scroll */}
                <div className="md:hidden overflow-x-auto -mx-4 px-4 pb-6">
                    <div className="flex space-x-4" style={{ minWidth: 'min-content' }}>
                        {blogs.slice(0, 4).map((blog) => (
                            <motion.div
                                key={blog.id}
                                className="rounded-xl overflow-hidden flex-shrink-0 w-72"
                                whileHover={{ y: -5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Link to={`/blog/${blog.id}`} className="block h-full">
                                    <div className={`relative h-full ${blog.color} group`}>
                                        <div className="aspect-[4/3] overflow-hidden">
                                            <img 
                                                src={blog.image} 
                                                alt={blog.title}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${blog.textColor} mb-2`}>
                                                {blog.category}
                                            </span>
                                            <h3 className={`text-lg font-bold mb-2 line-clamp-2 ${
                                                blog.category === 'ARCHITECTURE' ? 'text-white' : 'text-gray-900'
                                            }`}>
                                                {blog.title}
                                            </h3>
                                            <div className={`inline-flex items-center gap-1 ${
                                                blog.category === 'ARCHITECTURE' ? 'text-white' : 'text-gray-700'
                                            }`}>
                                                <span className="text-xs">Read for</span>
                                                <span className="font-medium text-sm">{blog.price}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Mobile View All Button */}
                <div className="md:hidden text-center mb-8">
                    <Link to="/blogs" className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm">
                        <span className="mr-2">View all articles</span>
                        <FaArrowRight className="w-3 h-3" />
                    </Link>
                </div>

                {/* Desktop Grid */}
                <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map((blog) => (
                        <motion.div
                            key={blog.id}
                            className={`rounded-2xl overflow-hidden ${
                                blog.size === 'large' ? 'lg:col-span-2 lg:row-span-2' : 
                                blog.size === 'medium' ? 'lg:col-span-1 lg:row-span-2' : ''
                            }`}
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Link to={`/blog/${blog.id}`} className="block h-full">
                                <div className={`relative h-full ${blog.color} group`}>
                                    <div className="aspect-[4/3] overflow-hidden">
                                        <img 
                                            src={blog.image} 
                                            alt={blog.title}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${blog.textColor} mb-4`}>
                                            {blog.category}
                                        </span>
                                        <h3 className={`text-xl md:text-2xl font-bold mb-4 ${
                                            blog.category === 'ARCHITECTURE' ? 'text-white' : 'text-gray-900'
                                        }`}>
                                            {blog.title}
                                        </h3>
                                        <div className={`inline-flex items-center gap-2 ${
                                            blog.category === 'ARCHITECTURE' ? 'text-white' : 'text-gray-700'
                                        }`}>
                                            <span className="text-sm">Read for</span>
                                            <span className="font-medium">{blog.price}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BlogSection; 