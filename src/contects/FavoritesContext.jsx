import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthProvider';

export const FavoritesContext = createContext();

const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { user } = useContext(AuthContext);

  // Load favorites from localStorage when component mounts or user changes
  useEffect(() => {
    if (user) {
      const storedFavorites = localStorage.getItem(`favorites-${user.uid}`);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } else {
      setFavorites([]);
    }
  }, [user]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`favorites-${user.uid}`, JSON.stringify(favorites));
    }
  }, [favorites, user]);

  // Add a note to favorites
  const addToFavorites = (note) => {
    if (!user) return;
    
    // Check if note is already in favorites
    if (!favorites.some(fav => fav._id === note._id)) {
      setFavorites([...favorites, note]);
    }
  };

  // Remove a note from favorites
  const removeFromFavorites = (noteId) => {
    if (!user) return;
    
    setFavorites(favorites.filter(note => note._id !== noteId));
  };

  // Check if a note is in favorites
  const isInFavorites = (noteId) => {
    return favorites.some(note => note._id === noteId);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isInFavorites,
    favoritesCount: favorites.length
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesProvider; 