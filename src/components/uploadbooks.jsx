// src/components/UploadBook.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UploadBook = () => {
  const [bookTitle, setBookTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [category, setCategory] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const navigate = useNavigate();

  const handleUpload = (e) => {
    e.preventDefault();
    const bookData = {
      bookTitle,
      authorName,
      category,
      imgUrl,
      userId: user.uid, // Assuming user ID is stored in user object
    };

    fetch('http://localhost:5000/upload-book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    })
      .then((res) => res.json())
      .then((data) => {
        alert('Book uploaded successfully!');
        navigate('/manage');
      })
      .catch((error) => {
        console.error('Error uploading book:', error);
      });
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-3xl font-bold mb-4">Upload a New Book</h2>
      <form onSubmit={handleUpload}>
        <div className="mb-4">
          <label className="block text-gray-700">Book Title:</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Author Name:</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Category:</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Image URL:</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md"
            value={imgUrl}
            onChange={(e) => setImgUrl(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Upload Book
        </button>
      </form>
    </div>
  );
};

export default UploadBook;
