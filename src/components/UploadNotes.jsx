import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUpload, FaBook, FaPencilAlt, FaPrint, FaVideo, FaFileAlt, FaFileCode, FaFileAudio, FaLink, FaCloudUploadAlt, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../contects/AuthProvider';

const UploadNotes = () => {
  const navigate = useNavigate();
  const { user, refreshToken } = useContext(AuthContext);
  const [selectedCategory, setSelectedCategory] = useState('handwritten');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    price: '',
    fileUrl: '',
    previewUrl: '',
    thumbnailUrl: '',
    tags: []
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [apiStatus, setApiStatus] = useState('unknown');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  // Test API connection on component mount
  useEffect(() => {
    const testApiConnection = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/test`);
        if (response.ok) {
          const data = await response.json();
          console.log('API test successful:', data);
          setApiStatus('connected');
          toast.success('API connection successful!');
        } else {
          console.error('API test failed:', response.status);
          setApiStatus('error');
          toast.error('API connection failed. Please check server status.');
        }
      } catch (error) {
        console.error('API test error:', error);
        setApiStatus('error');
        toast.error(`API connection error: ${error.message}`);
      }
    };

    testApiConnection();
  }, []);

  const categories = [
    { id: 'handwritten', label: 'Handwritten Notes', icon: FaPencilAlt, color: 'bg-amber-100', textColor: 'text-amber-800' },
    { id: 'printed', label: 'Printed Notes', icon: FaPrint, color: 'bg-blue-100', textColor: 'text-blue-800' },
    { id: 'textbooks', label: 'Textbooks', icon: FaBook, color: 'bg-emerald-100', textColor: 'text-emerald-800' },
    { id: 'video', label: 'Video Lectures', icon: FaVideo, color: 'bg-red-100', textColor: 'text-red-800' },
    { id: 'assignments', label: 'Assignments', icon: FaFileAlt, color: 'bg-purple-100', textColor: 'text-purple-800' },
    { id: 'code', label: 'Code Samples', icon: FaFileCode, color: 'bg-gray-100', textColor: 'text-gray-800' },
    { id: 'audio', label: 'Audio Lectures', icon: FaFileAudio, color: 'bg-pink-100', textColor: 'text-pink-800' }
  ];

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
    'Engineering', 'Literature', 'History', 'Geography', 'Economics',
    'Business Studies', 'Accounting', 'Psychology', 'Sociology', 'Political Science',
    'Architecture', 'Medicine', 'Law', 'Arts', 'Music'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTagChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setFormData({
      ...formData,
      tags: tags
    });
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return false;
    }
    if (!formData.description.trim()) {
      toast.error('Please enter a description');
      return false;
    }
    if (!formData.subject) {
      toast.error('Please select a subject');
      return false;
    }
    if (!formData.price.trim()) {
      toast.error('Please enter a price');
      return false;
    }
    if (!formData.fileUrl.trim()) {
      toast.error('Please enter a file URL');
      return false;
    }
    if (!formData.thumbnailUrl.trim()) {
      toast.error('Please enter a thumbnail URL');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (apiStatus !== 'connected') {
      toast.error('API connection is not established. Cannot upload notes.');
      return;
    }
    
    if (!user || !user.email) {
      toast.error('You must be logged in to upload notes');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsUploading(true);
    
    // Simulate upload progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(progressInterval);
      }
    }, 200);
    
    try {
      // Prepare data for MongoDB
      const noteData = {
        title: formData.title,
        description: formData.description,
        subject: formData.subject,
        price: parseFloat(formData.price),
        fileUrl: formData.fileUrl,
        previewUrl: formData.previewUrl || formData.thumbnailUrl, // Use thumbnail as preview if no preview URL
        thumbnailUrl: formData.thumbnailUrl,
        category: selectedCategory,
        tags: formData.tags,
        authorEmail: user.email,
        authorName: user.displayName || 'Anonymous',
        authorPhoto: user.photoURL || '',
        createdAt: new Date().toISOString(),
        downloads: 0,
        views: 0,
        ratings: []
      };
      
      console.log('Sending note data:', noteData);
      console.log('API URL:', `${import.meta.env.VITE_API_URL}/api/notes`);
      
      // Send data to backend without token for now
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });
      
      console.log('Response status:', response.status);
      
      let responseData;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
        console.log('Response data:', responseData);
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned non-JSON response');
      }
      
      if (response.ok) {
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
          toast.success('Notes uploaded successfully!');
          
          // Reset form
          setFormData({
            title: '',
            description: '',
            subject: '',
            price: '',
            fileUrl: '',
            previewUrl: '',
            thumbnailUrl: '',
            tags: []
          });
          
          // Redirect to the notes page or dashboard
          setTimeout(() => {
            navigate('/notes');
          }, 2000);
        }, 500);
      } else {
        throw new Error(responseData.message || 'Failed to upload notes');
      }
    } catch (error) {
      clearInterval(progressInterval);
      setIsUploading(false);
      setUploadProgress(0);
      toast.error(error.message || 'Failed to upload notes. Please try again.');
      console.error('Error uploading notes:', error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      toast.error('Please upload a PDF file');
    }
  };

  // If user is not logged in, redirect to login page
  if (!user) {
    return (
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen pt-20">
        <div className="max-w-md mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-2xl shadow-lg"
          >
            <FaUpload className="text-5xl text-[#4CAF50] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-6">You need to be logged in to upload notes.</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-[#4CAF50] text-white rounded-xl font-medium hover:bg-[#43A047] transition-all"
            >
              Login to Continue
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 text-gray-600 hover:text-gray-900 flex items-center"
          >
            <FaArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            <span className="hidden md:inline">Back</span>
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Upload Your Notes</h1>
        </div>
        
        <p className="text-lg text-gray-600 max-w-2xl mb-8">
          Share your knowledge with other students and earn money while helping others succeed.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mobile Category Selector */}
          <div className="lg:hidden mb-4">
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex justify-between items-center" onClick={() => setShowCategoryMenu(!showCategoryMenu)}>
                <h2 className="text-lg font-semibold text-gray-900">Category: {categories.find(c => c.id === selectedCategory)?.label}</h2>
                <button className="text-gray-500">
                  {showCategoryMenu ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
              
              {showCategoryMenu && (
                <div className="mt-4 space-y-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(category.id);
                          setShowCategoryMenu(false);
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                          selectedCategory === category.id 
                            ? `${category.color} ${category.textColor} font-medium shadow-md` 
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${selectedCategory === category.id ? category.textColor : 'text-gray-500'}`} />
                        <span>{category.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Left Side - Categories (Desktop) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Choose Category</h2>
              
              <div className="space-y-3">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                        selectedCategory === category.id 
                          ? `${category.color} ${category.textColor} font-medium shadow-md` 
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${selectedCategory === category.id ? category.textColor : 'text-gray-500'}`} />
                      <span>{category.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 p-4 bg-[#4CAF50]/10 rounded-xl">
                <h3 className="font-medium text-gray-900 mb-2">Why Upload?</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Earn money from your study materials</li>
                  <li>• Help other students succeed</li>
                  <li>• Build your academic reputation</li>
                  <li>• Contribute to the learning community</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Side - Upload Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="title">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    placeholder="e.g., Complete JEE Mathematics Notes"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    placeholder="Describe your notes in detail..."
                    rows="4"
                    required
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="subject">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                      required
                    >
                      <option value="">Select a subject</option>
                      {subjects.map((subject, index) => (
                        <option key={index} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="price">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                      placeholder="e.g., 199"
                      min="0"
                      step="1"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="tags">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags.join(', ')}
                    onChange={handleTagChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    placeholder="e.g., JEE, Mathematics, Calculus"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="fileUrl">
                    File URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLink className="text-gray-400" />
                    </div>
                    <input
                      type="url"
                      id="fileUrl"
                      name="fileUrl"
                      value={formData.fileUrl}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                      placeholder="https://drive.google.com/file/d/your-file-id/view"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Upload your file to Google Drive, Dropbox, or any cloud storage and paste the shareable link here
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="thumbnailUrl">
                    Thumbnail URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLink className="text-gray-400" />
                    </div>
                    <input
                      type="url"
                      id="thumbnailUrl"
                      name="thumbnailUrl"
                      value={formData.thumbnailUrl}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                      placeholder="https://example.com/thumbnail.jpg"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Provide a URL to an image that represents your notes (JPG, PNG formats recommended)
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="previewUrl">
                    Preview URL (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLink className="text-gray-400" />
                    </div>
                    <input
                      type="url"
                      id="previewUrl"
                      name="previewUrl"
                      value={formData.previewUrl}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                      placeholder="https://example.com/preview.pdf"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Provide a URL to a preview or sample of your notes (optional)
                  </p>
                </div>

                {isUploading && (
                  <div className="mb-6">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-[#4CAF50] h-2.5 rounded-full transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 text-center">Uploading... {uploadProgress}%</p>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isUploading}
                    className={`w-full md:w-auto px-6 py-3 rounded-xl bg-[#4CAF50] text-white font-medium hover:bg-[#43A047] transition-colors flex items-center justify-center ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isUploading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FaCloudUploadAlt className="mr-2" />
                        Upload Notes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UploadNotes; 