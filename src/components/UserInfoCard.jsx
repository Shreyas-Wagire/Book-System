import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaExternalLinkAlt } from 'react-icons/fa';
import { AuthContext } from '../contects/AuthProvider';

const UserInfoCard = ({ compact = false, showLink = true }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
        <div className="bg-gray-200 p-3 rounded-full mr-3">
          <FaUser className="w-5 h-5 text-gray-400" />
        </div>
        <div>
          <p className="text-gray-800 font-medium">Not logged in</p>
          <p className="text-sm text-gray-500">Please sign in to view your profile</p>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-md p-3 flex items-center">
        <div className="mr-3 flex-shrink-0">
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName || user.email} 
              className="w-10 h-10 rounded-full border-2 border-gray-200"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=random`;
              }}
            />
          ) : (
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FaUser className="w-5 h-5 text-blue-600" />
            </div>
          )}
        </div>
        <div className="overflow-hidden">
          <p className="font-medium text-gray-900 truncate">{user.displayName || 'User'}</p>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
        </div>
        {showLink && (
          <Link to="/user-details" className="ml-auto text-blue-500 hover:text-blue-700">
            <FaExternalLinkAlt className="w-4 h-4" />
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <div className="mr-4 flex-shrink-0">
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName || user.email} 
              className="w-16 h-16 rounded-full border-2 border-gray-200"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=random`;
              }}
            />
          ) : (
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <FaUser className="w-8 h-8 text-blue-600" />
            </div>
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{user.displayName || 'User'}</h3>
          <p className="text-gray-600">{user.email}</p>
        </div>
        {showLink && (
          <Link to="/user-details" className="ml-auto text-blue-500 hover:text-blue-700 flex items-center">
            <span className="mr-1 hidden sm:inline">View Profile</span>
            <FaExternalLinkAlt className="w-4 h-4" />
          </Link>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <FaUser className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="text-gray-900">{user.displayName || 'Not provided'}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="bg-purple-100 p-2 rounded-full mr-3">
            <FaEnvelope className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-gray-900">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoCard; 