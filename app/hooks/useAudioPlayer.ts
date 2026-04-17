import { useState, useRef, useEffect } from "react";
import { Song } from "../types";

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);  // Add loading state

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const playSong = (song: Song, index?: number) => {
    if (isLoading) return; // Don't interrupt loading
    
    setCurrentSong(song);
    if (index !== undefined) {
      setCurrentQueueIndex(index);
    }
    setIsPlaying(true);
  };

  const addToQueue = (song: Song) => {
    setQueue(prevQueue => {
      if (prevQueue.some(s => s._id === song._id)) {
        return prevQueue;
      }
      return [...prevQueue, song];
    });
  };

  const removeFromQueue = (index: number) => {
    setQueue(prevQueue => {
      const newQueue = prevQueue.filter((_, i) => i !== index);
      if (currentQueueIndex > index) {
        setCurrentQueueIndex(prev => prev - 1);
      } else if (currentQueueIndex === index) {
        setCurrentQueueIndex(-1);
        setIsPlaying(false);
      }
      return newQueue;
    });
  };

  const playNext = () => {
    if (isLoading) return;
    
    if (queue.length > 0 && currentQueueIndex < queue.length - 1) {
      const nextIndex = currentQueueIndex + 1;
      const nextSong = queue[nextIndex];
      setCurrentQueueIndex(nextIndex);
      setCurrentSong(nextSong);
      setIsPlaying(true);
    }
  };

  const playPrevious = () => {
    if (isLoading) return;
    
    if (audioRef.current && currentTime > 3) {
      audioRef.current.currentTime = 0;
    } else if (queue.length > 0 && currentQueueIndex > 0) {
      const prevIndex = currentQueueIndex - 1;
      const prevSong = queue[prevIndex];
      setCurrentQueueIndex(prevIndex);
      setCurrentSong(prevSong);
      setIsPlaying(true);
    }
  };

  const clearQueue = () => {
    setQueue([]);
    setCurrentQueueIndex(-1);
    setIsPlaying(false);
    setCurrentSong(null);
  };

  const playSongWithQueue = (song: Song) => {
    if (isLoading) return;
    
    const existingIndex = queue.findIndex(s => s._id === song._id);
    
    if (existingIndex !== -1) {
      setCurrentQueueIndex(existingIndex);
      setCurrentSong(song);
      setIsPlaying(true);
    } else {
      setQueue(prevQueue => [...prevQueue, song]);
      const newIndex = queue.length;
      setCurrentQueueIndex(newIndex);
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  // Load new song effect 
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    const audio = audioRef.current;
    
    // Mark as loading
    setIsLoading(true);
    
    // Store the current play intention
    const shouldPlay = isPlaying;
    
    // Set source and load
    audio.src = currentSong.audioUrl;
    audio.load();
    
    // Wait for canplay event before playing
    const handleCanPlay = () => {
      setIsLoading(false);
      if (shouldPlay) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Playback failed:", error);
            setIsPlaying(false);
          });
        }
      }
    };
    
    const handleError = () => {
      setIsLoading(false);
      console.error("Failed to load audio");
      setIsPlaying(false);
    };
    
    audio.addEventListener('canplay', handleCanPlay, { once: true });
    audio.addEventListener('error', handleError, { once: true });
    
    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      // Don't abort loading on cleanup
    };
  }, [currentSong]);

  // Play/Pause effect 
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong || isLoading) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Playback failed:", error);
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong, isLoading]);

  // Time update effect
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (queue.length > 0 && currentQueueIndex < queue.length - 1) {
        const nextIndex = currentQueueIndex + 1;
        const nextSong = queue[nextIndex];
        setCurrentQueueIndex(nextIndex);
        setCurrentSong(nextSong);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [queue, currentQueueIndex]);

  // Volume effect
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return {
    audioRef,
    currentTime,
    duration,
    volume,
    setVolume,
    currentSong,
    setCurrentSong,
    isPlaying,
    setIsPlaying,
    queue,
    currentQueueIndex,
    formatTime,
    isLoading,  // Export loading state
    playSong,
    addToQueue,
    removeFromQueue,
    playNext,
    playPrevious,
    clearQueue,
    playSongWithQueue,
  };
}