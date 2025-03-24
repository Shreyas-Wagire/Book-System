import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaDownload, FaShare, FaSearch, FaFilter, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ManageNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterCategory, setFilterCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchNotes();
    fetchCategories();
  }, [sortField, sortDirection, filterCategory]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (sortField) params.append('sort', sortField);
      if (sortDirection) params.append('order', sortDirection);
      if (filterCategory) params.append('category', filterCategory);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notes?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch notes: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Validate response structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format');
      }
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch notes');
      }
      
      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid data format: expected an array of notes');
      }
      
      setNotes(data.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchNotes();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notes/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete note: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to delete note');
      }
      
      toast.success('Note deleted successfully');
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error(error.message);
    }
  };

  const handleDownload = (note) => {
    if (!note || !note.fileUrl) {
      toast.error('Download link not available');
      return;
    }
    
    try {
      window.open(note.fileUrl, '_blank');
      toast.success('Download started!');
      
      // Increment download count in the background
      fetch(`${import.meta.env.VITE_API_URL}/api/notes/download/${note._id}`, {
        method: 'POST'
      }).catch(error => {
        console.error('Error updating download count:', error);
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handleSortChange = (field) => {
    if (sortField === field) {
      toggleSortDirection();
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (note.description && note.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-0">Manage Your Notes</h1>
          <Link
            to="/upload-note"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center justify-center"
          >
            Upload New Note
          </Link>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Search Form */}
            <div className="flex-1">
              <form onSubmit={handleSearch} className="flex">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search notes..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Filter Dropdown */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative inline-block text-left">
                <div className="flex items-center">
                  <FaFilter className="mr-2 text-gray-500" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="relative inline-block text-left">
                <div className="flex items-center">
                  {sortDirection === 'desc' ? (
                    <FaSortAmountDown className="mr-2 text-gray-500" />
                  ) : (
                    <FaSortAmountUp className="mr-2 text-gray-500" />
                  )}
                  <select
                    value={sortField}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="createdAt">Date Created</option>
                    <option value="title">Title</option>
                    <option value="views">Views</option>
                    <option value="downloads">Downloads</option>
                  </select>
                </div>
              </div>
              
              <button
                onClick={toggleSortDirection}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {sortDirection === 'desc' ? 'Descending' : 'Ascending'}
              </button>
            </div>
          </div>
        </div>

        {/* Notes List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchNotes}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No notes found. Try a different search or filter.</p>
            </div>
          ) : (
            <div>
              {/* Desktop View */}
              <div className="hidden md:block">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Note
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stats
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredNotes.map((note) => (
                      <tr key={note._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-md object-cover"
                                src={note.thumbnailUrl || `https://via.placeholder.com/100x100?text=${encodeURIComponent(note.title.charAt(0))}`}
                                alt={note.title}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = `https://via.placeholder.com/100x100?text=${encodeURIComponent(note.title.charAt(0))}`;
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{note.title}</div>
                              {note.subject && (
                                <div className="text-sm text-gray-500">{note.subject}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {note.category ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {note.category}
                            </span>
                          ) : (
                            <span className="text-gray-500 text-sm">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center text-sm text-gray-500">
                              <FaEye className="mr-1 h-4 w-4" />
                              {note.views || 0}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <FaDownload className="mr-1 h-4 w-4" />
                              {note.downloads || 0}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Link
                              to={`/notes/${note._id}`}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="View"
                            >
                              <FaEye className="h-5 w-5" />
                            </Link>
                            <button
                              onClick={() => handleDownload(note)}
                              className="text-green-600 hover:text-green-900 p-1"
                              title="Download"
                            >
                              <FaDownload className="h-5 w-5" />
                            </button>
                            <Link
                              to={`/edit-note/${note._id}`}
                              className="text-indigo-600 hover:text-indigo-900 p-1"
                              title="Edit"
                            >
                              <FaEdit className="h-5 w-5" />
                            </Link>
                            <button
                              onClick={() => handleDelete(note._id)}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Delete"
                            >
                              <FaTrash className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden">
                <ul className="divide-y divide-gray-200">
                  {filteredNotes.map((note) => (
                    <li key={note._id} className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            className="h-16 w-16 rounded-md object-cover"
                            src={note.thumbnailUrl || `https://via.placeholder.com/100x100?text=${encodeURIComponent(note.title.charAt(0))}`}
                            alt={note.title}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://via.placeholder.com/100x100?text=${encodeURIComponent(note.title.charAt(0))}`;
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{note.title}</p>
                          {note.category && (
                            <p className="mt-1">
                              <span className="px-2 py-0.5 text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {note.category}
                              </span>
                            </p>
                          )}
                          <div className="mt-2 flex items-center text-xs text-gray-500 space-x-3">
                            <div className="flex items-center">
                              <FaEye className="mr-1 h-3 w-3" />
                              {note.views || 0} views
                            </div>
                            <div className="flex items-center">
                              <FaDownload className="mr-1 h-3 w-3" />
                              {note.downloads || 0} downloads
                            </div>
                            <div>
                              <FaCalendarAlt className="mr-1 h-3 w-3 inline" />
                              {new Date(note.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <Link
                          to={`/notes/${note._id}`}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          <FaEye className="mr-1.5 h-3 w-3" />
                          View
                        </Link>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDownload(note)}
                            className="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
                            title="Download"
                          >
                            <FaDownload className="h-4 w-4" />
                          </button>
                          <Link
                            to={`/edit-note/${note._id}`}
                            className="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
                            title="Edit"
                          >
                            <FaEdit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(note._id)}
                            className="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-sm text-red-600 bg-white hover:bg-gray-50"
                            title="Delete"
                          >
                            <FaTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageNotes; 