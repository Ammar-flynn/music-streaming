import { Song } from "../types";
import { SongCard } from "./SongCard";

interface FavoritesPageProps {
  favorites: Song[];
  onPlay: (song: Song) => void;
  onToggleFavorite: (song: Song) => void;
  onAddToQueue: (song: Song) => void;
}

export function FavoritesPage({ favorites, onPlay, onToggleFavorite, onAddToQueue }: FavoritesPageProps) {
  return (
    <div>
      <h2 className="search-results">✨ Your Favorites ({favorites.length} songs)</h2>
      {favorites.length === 0 ? (
        <div className="empty-state">
          <p className="empty-message">No favorites yet</p>
          <p className="empty-hint">Click the ❤️ icon on any song to add it to your favorites!</p>
        </div>
      ) : (
        <div className="songs-grid">
          {favorites.map((song) => (
            <SongCard
              key={song._id}
              song={song}
              isFavorite={true}
              onPlay={onPlay}
              onToggleFavorite={onToggleFavorite}
              onAddToQueue={onAddToQueue}
            />
          ))}
        </div>
      )}
    </div>
  );
}