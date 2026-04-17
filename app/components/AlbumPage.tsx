import { ChevronLeft, Play, Heart } from "lucide-react";
import { Album, Song } from "../types";

interface AlbumPageProps {
  album: Album;
  songs: Song[];
  favorites: Song[];
  onBack: () => void;
  onPlay: (song: Song) => void;
  onToggleFavorite: (song: Song) => void;
}

export function AlbumPage({ album, songs, favorites, onBack, onPlay, onToggleFavorite }: AlbumPageProps) {
  const albumSongs = songs.filter(song => song.album === album.name);

  return (
    <div>
      <button onClick={onBack} className="back-button">
        <ChevronLeft size={20} /> Back to Home
      </button>
      <div className="album-header frozen-card">
        <div className="album-header-content">
          <img src={album.image} alt={album.name} className="album-cover" />
          <div>
            <p className="album-type">📀 ALBUM</p>
            <h2 className="album-name-large">{album.name}</h2>
            <p className="album-details">{album.artist} • {album.year} • {album.songs} songs</p>
          </div>
        </div>
      </div>
      <h2 className="section-title" style={{ marginBottom: '24px' }}>🎵 Tracklist</h2>
      <div className="tracklist">
        {albumSongs.map((song, index) => (
          <div key={song._id} className="track-item frozen-card" onClick={() => onPlay(song)}>
            <div className="track-left">
              <span className="track-number">#{index + 1}</span>
              <div>
                <h3 className="track-title">{song.title}</h3>
              </div>
            </div>
            <div className="track-actions">
              <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(song); }} className="like-button">
                <Heart size={20} className={favorites.some(f => f._id === song._id) ? "like-icon-liked" : "like-icon"} />
              </button>
              <Play size={20} style={{ color: '#0A74DA' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}