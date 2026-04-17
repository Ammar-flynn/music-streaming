import { Song } from "../types";
import { SongCard } from "./SongCard";

interface SearchPageProps {
  query: string;
  results: Song[];
  favorites: Song[];
  onPlay: (song: Song) => void;
  onToggleFavorite: (song: Song) => void;
  onAddToQueue: (song: Song) => void;
}

export function SearchPage({ query, results, favorites, onPlay, onToggleFavorite, onAddToQueue }: SearchPageProps) {
  return (
    <div>
      <h2 className="search-results">Search results for "{query}" ({results.length} songs)</h2>
      {results.length === 0 ? (
        <div className="empty-state">
          <p className="empty-message">No songs found</p>
        </div>
      ) : (
        <div className="songs-grid">
          {results.map((song) => (
            <SongCard
              key={song._id}
              song={song}
              isFavorite={favorites.some(f => f._id === song._id)}
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