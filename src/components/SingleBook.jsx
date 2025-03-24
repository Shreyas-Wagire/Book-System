import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { FaBookmark, FaShare, FaStar } from 'react-icons/fa';

const SingleBook = () => {
  const { book } = useLoaderData();

  if (!book) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Book not found</h2>
          <p className="text-gray-600 mt-2">The book you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Image */}
          <div className="md:w-1/3">
            <div className="sticky top-8">
              <img
                src={book.imageURL || 'https://via.placeholder.com/400x600?text=No+Image'}
                alt={book.title}
                className="w-full rounded-lg shadow-lg"
              />
              <div className="mt-4 flex justify-center gap-4">
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <FaBookmark />
                  <span>Save</span>
                </button>
                <button className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                  <FaShare />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{book.title}</h1>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-lg text-gray-600">By {book.author}</span>
              <div className="flex items-center">
                <FaStar className="text-yellow-400" />
                <span className="ml-1 text-gray-600">4.5 (120 reviews)</span>
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <span className="text-2xl font-bold text-blue-600">${book.price}</span>
              <span className="text-gray-500 ml-2">/ Digital Copy</span>
            </div>
            <div className="prose max-w-none mb-8">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{book.description}</p>
            </div>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">Category:</span>
                  <span className="ml-2 text-gray-900">{book.category}</span>
                </div>
                <div>
                  <span className="text-gray-600">Format:</span>
                  <span className="ml-2 text-gray-900">Digital</span>
                </div>
                <div>
                  <span className="text-gray-600">Language:</span>
                  <span className="ml-2 text-gray-900">English</span>
                </div>
                <div>
                  <span className="text-gray-600">Pages:</span>
                  <span className="ml-2 text-gray-900">350</span>
                </div>
              </div>
            </div>
            <div className="border-t pt-8">
              <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBook;