import { Heart, Plus, Play } from "lucide-react";
import { Song } from "@/types";

interface SongCardProps {
  song: Song;
  isFavorite: boolean;
  onPlay: (song: Song) => void;
  onToggleFavorite: (song: Song) => void;
  onAddToQueue: (song: Song) => void;
}

export function SongCard({ song, isFavorite, onPlay, onToggleFavorite, onAddToQueue }: SongCardProps) {
  return (
    <div className="song-card frozen-card" onClick={() => onPlay(song)}>
      <div className="song-image-container">
        <img src={song.coverUrl} alt={song.title} className="song-image" />
        <div className="song-overlay">
          <button className="song-play-button">
            <Play size={24} />
          </button>
        </div>
      </div>
      <div className="song-info">
        <div>
          <h3 className="song-title">{song.title}</h3>
          <p className="song-artist">{song.artist}</p>
          <p className="song-plays">❄️ {song.plays.toLocaleString()} plays</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              onToggleFavorite(song); 
            }} 
            className="like-button"
          >
            <Heart size={20} className={isFavorite ? "like-icon-liked" : "like-icon"} />
          </button>
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              onAddToQueue(song); 
            }} 
            className="add-to-queue-button" 
            title="Add to queue"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}