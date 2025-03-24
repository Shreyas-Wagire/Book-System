import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPencilAlt, FaPrint, FaBook, FaVideo, FaFileAlt, FaFileCode, FaFileAudio, FaGraduationCap, FaHistory, FaClipboard, FaArrowRight } from 'react-icons/fa';

const NotesCategories = () => {
  const categories = [
    {
      id: 'handwritten',
      name: 'Handwritten Notes',
      icon: FaPencilAlt,
      description: 'Personal study notes written by students',
      count: '200+ Notes',
      color: 'bg-amber-50',
      textColor: 'text-amber-700'
    },
    {
      id: 'printed',
      name: 'Printed Notes',
      icon: FaFileAlt,
      description: 'Professionally prepared study materials',
      count: '150+ Notes',
      color: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      id: 'textbooks',
      name: 'Core Textbooks',
      icon: FaBook,
      description: 'Essential course textbooks and references',
      count: '100+ Books',
      color: 'bg-emerald-50',
      textColor: 'text-emerald-700'
    },
    {
      id: 'reference',
      name: 'Reference Materials',
      icon: FaGraduationCap,
      description: 'Additional study resources and guides',
      count: '120+ Materials',
      color: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      id: 'previous-papers',
      name: 'Previous Papers',
      icon: FaHistory,
      description: 'Past exam papers and solutions',
      count: '300+ Papers',
      color: 'bg-red-50',
      textColor: 'text-red-700'
    },
    {
      id: 'assignments',
      name: 'Assignment Help',
      icon: FaClipboard,
      description: 'Assignment guidelines and samples',
      count: '80+ Resources',
      color: 'bg-indigo-50',
      textColor: 'text-indigo-700'
    }
  ];

  return (
    <section className="py-8 md:py-16 px-4 bg-gradient-to-br from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4"
          >
            Explore Notes by Category
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Find the perfect study materials for your needs
          </motion.p>
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden overflow-x-auto -mx-4 px-4 pb-4 mb-6">
          <div className="flex space-x-4" style={{ minWidth: 'min-content' }}>
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.id}
                  whileHover={{ y: -5 }}
                  className={`${category.color} rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all flex-shrink-0 w-60`}
                >
                  <Link to={`/shop?category=${category.id}`} className="block p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-lg ${category.color} shadow-sm`}>
                        <Icon className={`w-5 h-5 ${category.textColor}`} />
                      </div>
                      <span className={`text-xs font-medium ${category.textColor} bg-white/50 px-2 py-0.5 rounded-full`}>
                        {category.count}
                      </span>
                    </div>
                    <h3 className={`text-lg font-bold mb-1 ${category.textColor}`}>
                      {category.name}
                    </h3>
                    <p className="text-gray-700 text-xs mb-3 line-clamp-2">
                      {category.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-medium ${category.textColor}`}>
                        Browse Collection
                      </span>
                      <FaArrowRight className={`w-4 h-4 ${category.textColor}`} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                whileHover={{ y: -5 }}
                className={`${category.color} rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all`}
              >
                <Link to={`/shop?category=${category.id}`} className="block p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${category.color} shadow-md`}>
                      <Icon className={`w-6 h-6 ${category.textColor}`} />
                    </div>
                    <span className={`text-sm font-medium ${category.textColor} bg-white/50 px-3 py-1 rounded-full`}>
                      {category.count}
                    </span>
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${category.textColor}`}>
                    {category.name}
                  </h3>
                  <p className="text-gray-700 text-sm mb-4">
                    {category.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-medium ${category.textColor}`}>
                      Browse Collection
                    </span>
                    <FaArrowRight className={`w-5 h-5 ${category.textColor}`} />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 md:mt-12 text-center">
          <Link 
            to="/upload-note" 
            className="inline-flex items-center gap-2 bg-[#4CAF50] text-white px-4 py-2 md:px-6 md:py-3 rounded-full hover:bg-[#43A047] transition-colors shadow-md hover:shadow-lg text-sm md:text-base"
          >
            <span>Upload Your Notes</span>
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotesCategories; 