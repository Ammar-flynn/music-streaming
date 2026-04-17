import { SongCard } from "./SongCard";
import { Song } from "@/types";

interface SongGridProps {
  songs: Song[];
  favorites: Song[];
  onPlay: (song: Song) => void;
  onToggleFavorite: (song: Song) => void;
  onAddToQueue: (song: Song) => void;
}

export function SongGrid({ songs, favorites, onPlay, onToggleFavorite, onAddToQueue }: SongGridProps) {
  return (
    <div className="songs-grid">
      {songs.map((song) => (
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
  );
}