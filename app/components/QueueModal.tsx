import { X, Trash2, Music, ListMusic } from "lucide-react";
import { Song } from "../types";

interface QueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  queue: Song[];
  currentSong: Song | null;
  currentQueueIndex: number;
  onPlaySong: (song: Song, index: number) => void;
  onRemoveFromQueue: (index: number) => void;
  onClearQueue: () => void;
}

export function QueueModal({ isOpen, onClose, queue, currentSong, currentQueueIndex, onPlaySong, onRemoveFromQueue, onClearQueue }: QueueModalProps) {
  if (!isOpen) return null;

  return (
    <div className="queue-overlay" onClick={onClose}>
      <div className="queue-slider" onClick={(e) => e.stopPropagation()}>
        <div className="queue-header">
          <h2><Music size={20} /> Queue ({queue.length})</h2>
          <div>
            {queue.length > 0 && <button onClick={onClearQueue} className="clear-queue-button"><Trash2 size={20} /></button>}
            <button onClick={onClose} className="close-queue"><X size={24} /></button>
          </div>
        </div>
        <div className="queue-content">
          {queue.length === 0 ? (
            <div className="empty-queue">
              <ListMusic size={48} />
              <p>Your queue is empty</p>
              <p>Click the + icon to add songs!</p>
            </div>
          ) : (
            queue.map((song, index) => (
              <div 
                key={song._id} 
                className={`queue-item ${index === currentQueueIndex && currentSong?._id === song._id ? 'active' : ''}`} 
                onClick={() => onPlaySong(song, index)}
              >
                <div className="queue-number">{index + 1}</div>
                <img src={song.coverUrl} alt={song.title} className="queue-image" />
                <div className="queue-info">
                  <h4>{song.title}</h4>
                  <p>{song.artist}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); onRemoveFromQueue(index); }} className="remove-from-queue">
                  <X size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}