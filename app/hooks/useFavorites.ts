import { useState } from "react";
import { Song } from "../types";

export function useFavorites(songs: Song[], isLoggedIn: boolean, user: any) {
  const [favorites, setFavorites] = useState<Song[]>([]);

  const fetchFavorites = async (userId: string) => {
    try {
      const res = await fetch(`/api/favorites?userId=${userId}`);
      if (res.ok) {
        const favoriteItems = await res.json();
        const favoriteSongs = songs.filter(song => 
          favoriteItems.some((fav: any) => fav.songId === song._id)
        );
        setFavorites(favoriteSongs);
        return favoriteSongs;
      }
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
    }
    return [];
  };

  const toggleFavorite = async (song: Song) => {
    // If not logged in, return false
    if (!isLoggedIn || !user) {
      return { success: false, requiresLogin: true };
    }
    
    const isFavorited = favorites.some(f => f._id === song._id);
    
    try {
      if (isFavorited) {
        const res = await fetch('/api/favorites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.userId, songId: song._id })
        });
        if (res.ok) {
          setFavorites(prev => prev.filter(f => f._id !== song._id));
          return { success: true, isNowFavorite: false };
        }
      } else {
        const res = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.userId, songId: song._id })
        });
        if (res.ok) {
          setFavorites(prev => [...prev, song]);
          return { success: true, isNowFavorite: true };
        }
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
    return { success: false, requiresLogin: false };
  };

  const resetFavorites = () => {
    setFavorites([]);
  };

  return { 
    favorites, 
    setFavorites, 
    fetchFavorites, 
    toggleFavorite,
    resetFavorites  
  };
}