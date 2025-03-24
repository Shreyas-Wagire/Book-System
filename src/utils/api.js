import axios from 'axios';
import { toast } from 'react-hot-toast';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: `${baseURL}/api`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: Date.now()
    };
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    toast.error('Failed to send request. Please check your connection.');
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  async error => {
    const { config, response } = error;
    
    // If the error is due to network issues or 5xx server errors
    if (!response || (response.status >= 500 && response.status <= 599)) {
      // Retry the request up to 3 times
      config.__retryCount = config.__retryCount || 0;
      
      if (config.__retryCount < 3) {
        config.__retryCount += 1;
        await new Promise(resolve => setTimeout(resolve, 1000 * config.__retryCount));
        return api(config);
      }
    }
    
    console.error('API Error:', error);
    
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'An error occurred';
      toast.error(message);
      
      // Handle specific error codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          toast.error('You do not have permission to perform this action');
          break;
        case 404:
          toast.error('Resource not found');
          break;
        case 500:
          toast.error('Server error. Please try again later');
          break;
        default:
          toast.error(message);
      }
      
      throw {
        status: error.response.status,
        message,
        error: error.response.data
      };
    } else if (error.request) {
      // Request was made but no response
      const message = 'Network error. Please check your connection and try again.';
      toast.error(message);
      throw {
        status: 0,
        message,
        error: error.request
      };
    } else {
      // Something else happened
      const message = error.message || 'An unexpected error occurred';
      toast.error(message);
      throw {
        status: 0,
        message,
        error
      };
    }
  }
);

// API endpoints
export const booksApi = {
  getAll: async (category) => {
    try {
      console.log('Fetching books with category:', category);
      const response = await api.get('/all-books', { 
        params: { 
          category,
          _t: Date.now() // Cache busting
        } 
      });
      console.log('Books API response:', response);
      
      if (!response || !response.success) {
        throw new Error(response?.message || 'Failed to fetch books');
      }

      // Ensure all required fields are present
      const books = response.books.map(book => ({
        _id: book._id,
        title: book.title || book.bookTitle || 'Untitled',
        author: book.author || book.authorName || 'Unknown Author',
        description: book.description || '',
        price: book.price || 0,
        category: book.category || 'uncategorized',
        imageURL: book.imageURL || book.imgUrl || 'https://via.placeholder.com/400x300?text=No+Image'
      }));

      return {
        ...response,
        books
      };
    } catch (error) {
      console.error('Error in booksApi.getAll:', error);
      throw error;
    }
  },
  getById: (id) => api.get(`/books/${id}`),
  create: (data) => api.post('/books', data),
  update: (id, data) => api.patch(`/books/${id}`, data),
  delete: (id) => api.delete(`/books/${id}`)
};

export const notesApi = {
  getAll: async (params = {}) => {
    try {
      console.log('Fetching notes with params:', params);
      const response = await api.get('/notes', { 
        params: {
          ...params,
          _t: Date.now() // Cache busting
        }
      });
      console.log('Notes API response:', response);

      if (!response || !response.success) {
        throw new Error(response?.message || 'Failed to fetch notes');
      }

      // Ensure all required fields are present
      const notes = response.notes.map(note => ({
        _id: note._id,
        title: note.title || 'Untitled Note',
        description: note.description || '',
        category: note.category || 'uncategorized',
        author: note.author || 'Anonymous',
        createdAt: note.createdAt || new Date().toISOString(),
        downloads: note.downloads || 0,
        views: note.views || 0,
        ratings: note.ratings || [],
        fileUrl: note.fileUrl || '',
        thumbnailUrl: note.thumbnailUrl || 'https://via.placeholder.com/400x300?text=No+Image'
      }));

      return {
        ...response,
        notes
      };
    } catch (error) {
      console.error('Error in notesApi.getAll:', error);
      throw error;
    }
  },
  getById: (id) => api.get(`/notes/${id}`),
  getByAuthor: (email) => api.get(`/notes/author/${email}`),
  create: (data) => api.post('/notes', data),
  update: (id, data) => api.put(`/notes/${id}`, data),
  delete: (id) => api.delete(`/notes/${id}`),
  addRating: (id, rating) => api.post(`/notes/${id}/rating`, { rating }),
  download: (id) => api.post(`/notes/${id}/download`)
};

export const authApi = {
  getToken: (email, uid) => api.post('/auth/token', { email, uid }),
  test: () => api.get('/test')
};

export default api; 