import React, { useContext, useState } from 'react';
import { AuthContext } from '../contects/AuthProvider';
import { FaUser, FaEnvelope, FaEdit, FaCamera, FaTimes, FaSave } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const UserDetails = () => {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [isHovering, setIsHovering] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gray-200 p-8 rounded-full mx-auto mb-4">
            <FaUser className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Not Logged In</h2>
          <p className="text-gray-600 mb-6">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    try {
      // In a real app, you would update the user profile in Firebase or your backend
      // For now, we'll just show a success message
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setDisplayName(user.displayName || '');
    setPhotoURL(user.photoURL || '');
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-center relative">
          <div 
            className="relative inline-block"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {isEditing ? (
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto overflow-hidden border-4 border-white">
                  {photoURL ? (
                    <img 
                      src={photoURL} 
                      alt={displayName || user.email} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || user.email)}&background=random`;
                      }}
                    />
                  ) : (
                    <FaUser className="w-10 h-10 text-white" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer">
                  <FaCamera className="w-4 h-4 text-gray-700" />
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        // In a real app, you would upload this file to storage
                        // For now, we'll just create a local URL
                        const url = URL.createObjectURL(file);
                        setPhotoURL(url);
                      }
                    }}
                  />
                </label>
              </div>
            ) : (
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto overflow-hidden border-4 border-white">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || user.email} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=random`;
                      }}
                    />
                  ) : (
                    <FaUser className="w-10 h-10 text-white" />
                  )}
                </div>
                {isHovering && (
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="text-white"
                    >
                      <FaEdit className="w-6 h-6" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {isEditing ? (
            <div className="mt-4">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Display Name"
                className="w-full px-3 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 mb-2"
              />
            </div>
          ) : (
            <h2 className="text-xl font-bold text-white mt-4">
              {user.displayName || 'User'}
            </h2>
          )}
          
          <p className="text-white/80 text-sm mt-1">{user.email}</p>
          
          {isEditing && (
            <div className="flex justify-center mt-4 space-x-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg flex items-center"
              >
                <FaSave className="mr-2" /> Save
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-white/20 text-white rounded-lg flex items-center"
              >
                <FaTimes className="mr-2" /> Cancel
              </button>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <FaUser className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                <p className="text-gray-900">{user.displayName || 'Not provided'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-purple-100 p-2 rounded-full mr-4">
                <FaEnvelope className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                <p className="text-gray-900">{user.email}</p>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-4 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Account Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Account Created</h4>
                  <p className="text-gray-900">{user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Unknown'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Last Sign In</h4>
                  <p className="text-gray-900">{user.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : 'Unknown'}</p>
                </div>
              </div>
            </div>
            
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <FaEdit className="mr-2" /> Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails; 