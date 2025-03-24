import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaTags, FaClock } from 'react-icons/fa';
import SearchBar from './SearchBar';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'STUDY TIPS', name: 'Study Tips' },
    { id: 'ARCHITECTURE', name: 'Architecture' },
    { id: 'CAMPUS LIFE', name: 'Campus Life' },
    { id: 'INTERIOR', name: 'Interior' },
    { id: 'HEALTH', name: 'Health' },
    { id: 'PHOTOGRAPHY', name: 'Photography' }
  ];

  const blogPosts = [
    {
      id: 1,
      title: 'Effective Study Techniques for JEE/NEET',
      category: 'STUDY TIPS',
      author: 'Dr. Sharma',
      date: '2024-03-15',
      image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?ixlib=rb-4.0.3',
      readTime: 10,
      excerpt: 'Master the art of efficient studying with proven techniques specifically designed for JEE and NEET aspirants.',
      price: '₹49.99',
      color: 'bg-emerald-100',
      textColor: 'text-emerald-800',
      size: 'large'
    },
    {
      id: 2,
      title: 'Top Architecture Colleges in India 2024',
      category: 'ARCHITECTURE',
      author: 'Priya Patel',
      date: '2024-03-14',
      image: 'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?ixlib=rb-4.0.3',
      readTime: 8,
      excerpt: 'A comprehensive guide to the best architecture colleges in India, including admission criteria and placement records.',
      price: '₹39.99',
      color: 'bg-slate-800',
      textColor: 'text-white',
      size: 'medium'
    },
    {
      id: 3,
      title: 'Life at IIT Delhi: A Student\'s Perspective',
      category: 'CAMPUS LIFE',
      author: 'Rahul Kumar',
      date: '2024-03-13',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3',
      readTime: 7,
      excerpt: 'An insider\'s look at the daily life, challenges, and experiences of students at IIT Delhi.',
      price: '₹29.99',
      color: 'bg-amber-100',
      textColor: 'text-amber-800',
      size: 'medium'
    },
    {
      id: 4,
      title: 'Create Your Perfect Study Space',
      category: 'INTERIOR',
      author: 'Anjali Singh',
      date: '2024-03-12',
      image: 'https://images.unsplash.com/photo-1598276975867-c059c169223b',
      readTime: 5,
      excerpt: 'Design tips and organization hacks to create an optimal study environment at home.',
      price: '₹19.99',
      color: 'bg-sky-100',
      textColor: 'text-sky-800',
      size: 'small'
    },
    {
      id: 5,
      title: 'Managing Exam Stress: Expert Tips',
      category: 'HEALTH',
      author: 'Dr. Mehra',
      date: '2024-03-11',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
      readTime: 6,
      excerpt: 'Learn effective strategies to cope with exam pressure and maintain mental well-being.',
      price: '₹24.99',
      color: 'bg-rose-100',
      textColor: 'text-rose-800',
      size: 'small'
    },
    {
      id: 6,
      title: 'Documenting College Memories',
      category: 'PHOTOGRAPHY',
      author: 'Arjun Kapoor',
      date: '2024-03-10',
      image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce',
      readTime: 8,
      excerpt: 'Tips and techniques for capturing and preserving your precious college moments.',
      price: '₹34.99',
      color: 'bg-blue-100',
      textColor: 'text-blue-800',
      size: 'large'
    }
  ];

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.title);
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="py-24 px-4 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Student Life
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            The latest and best articles for Indian students, curated by our editorial team.
          </motion.p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
            <div className="w-full md:w-96">
              <SearchBar
                placeholder="Search articles..."
                suggestions={blogPosts}
                onSearch={handleSearch}
                onSuggestionClick={handleSuggestionClick}
              />
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 w-full md:w-auto justify-start md:justify-center">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all hover:scale-105 active:scale-95
                    ${selectedCategory === category.id
                      ? 'bg-[#4CAF50] text-white shadow-lg shadow-[#4CAF50]/25'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                    }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`rounded-2xl overflow-hidden ${
                  post.size === 'large' ? 'lg:col-span-2 lg:row-span-2' : 
                  post.size === 'medium' ? 'lg:col-span-1 lg:row-span-2' : ''
                }`}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Link to={`/blog/${post.id}`} className="block h-full">
                  <div className={`relative h-full ${post.color} group`}>
                    <div className="aspect-[4/3] overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${post.textColor}`}>
                          {post.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <FaClock className="w-3 h-3" />
                          {post.readTime} min read
                        </span>
                      </div>
                      <h3 className={`text-xl md:text-2xl font-bold mb-3 ${
                        post.category === 'ARCHITECTURE' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {post.title}
                      </h3>
                      <p className={`text-sm mb-4 line-clamp-2 ${
                        post.category === 'ARCHITECTURE' ? 'text-gray-200' : 'text-gray-600'
                      }`}>
                        {post.excerpt}
                      </p>
                      <div className={`flex items-center justify-between ${
                        post.category === 'ARCHITECTURE' ? 'text-white' : 'text-gray-700'
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Read for</span>
                          <span className="font-medium">{post.price}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm opacity-75">
                          <FaUser className="w-3 h-3" />
                          <span>{post.author}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* No Results Message */}
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <h3 className="text-xl font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Blog;
