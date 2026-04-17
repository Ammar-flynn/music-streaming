import { Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react";
import { Song } from "../types";
import { RefObject } from "react";

interface NowPlayingBarProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  currentTime: number;
  duration: number;
  formatTime: (time: number) => string;
  audioRef: RefObject<HTMLAudioElement | null>;  // Change this to allow null
}

export function NowPlayingBar({ 
  currentSong, 
  isPlaying, 
  onPlayPause, 
  onNext, 
  onPrevious, 
  volume, 
  onVolumeChange, 
  currentTime, 
  duration, 
  formatTime,
  audioRef
}: NowPlayingBarProps) {
  if (!currentSong) return null;

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    onVolumeChange(Math.max(0, Math.min(1, percent)));
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (audioRef?.current && duration) {
      audioRef.current.currentTime = percent * duration;
    }
  };

  return (
    <div className="now-playing-bar">
      <div className="bar-content">
        <div className="bar-song-info">
          <div className="bar-song-image">
            <img src={currentSong.coverUrl} alt={currentSong.title} />
          </div>
          <div>
            <p className="bar-song-title">{currentSong.title}</p>
            <p className="bar-song-artist">{currentSong.artist}</p>
          </div>
        </div>
        <div className="bar-controls">
          <button onClick={onPrevious} className="bar-control-button">
            <SkipBack size={20} />
          </button>
          <button onClick={onPlayPause} className="bar-play-button">
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button onClick={onNext} className="bar-control-button">
            <SkipForward size={20} />
          </button>
        </div>
        <div className="bar-volume">
          <Volume2 size={16} />
          <div className="volume-slider-container" onClick={handleVolumeClick}>
            <div className="volume-progress" style={{ width: `${volume * 100}%` }} />
          </div>
        </div>
      </div>
      <div className="progress-wrapper">
        <div className="progress-slider" onClick={handleProgressClick}>
          <div className="progress-progress" style={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }} />
        </div>
        <span className="bar-time">{formatTime(currentTime)} / {formatTime(duration)}</span>
      </div>
    </div>
  );
}