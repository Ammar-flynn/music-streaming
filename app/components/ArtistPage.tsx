import { ChevronLeft, Play, Heart, Plus } from "lucide-react";
import { Artist, Song } from "../types";
import { SongCard } from "./SongCard";

interface ArtistPageProps {
  artist: Artist;
  songs: Song[];
  favorites: Song[];
  onBack: () => void;
  onPlay: (song: Song) => void;
  onToggleFavorite: (song: Song) => void;
  onAddToQueue: (song: Song) => void;
}

export function ArtistPage({ artist, songs, favorites, onBack, onPlay, onToggleFavorite, onAddToQueue }: ArtistPageProps) {
  const artistSongs = songs.filter(song => song.artist === artist.name);

  return (
    <div>
      <button onClick={onBack} className="back-button">
        <ChevronLeft size={20} /> Back to Home
      </button>
      <div className="artist-header frozen-card">
        <div className="artist-header-content">
          <img src={artist.image} alt={artist.name} className="artist-avatar" />
          <div>
            <p className="artist-type">🎤 ARTIST</p>
            <h2 className="artist-name-large">{artist.name}</h2>
            <p className="artist-stats">{artist.followers} monthly listeners</p>
          </div>
        </div>
      </div>
      <h2 className="section-title" style={{ marginBottom: '24px' }}>🎵 Popular Songs</h2>
      <div className="songs-grid">
        {artistSongs.map((song) => (
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
    </div>
  );
}