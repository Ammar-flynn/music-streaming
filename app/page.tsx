"use client";

import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";

import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Heart, 
  Volume2,
  Search,
  Home as HomeIcon,
  Library,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  ListMusic,
  Plus,
  Trash2,
  Music
} from "lucide-react";
import "./global.css";

// Full music database (same as before)
const artists = [
  { id: 1, name: "Elsa Melody", image: "https://picsum.photos/id/104/200/200", followers: "2.5M" },
  { id: 2, name: "Sabrina Carpenter", image: "https://i.ytimg.com/vi/51zjlMhdSTE/maxresdefault.jpg", followers: "222.5M" }
  ];

const albums = [
  { id: 1, name: "Frozen Echoes", artist: "Snow Symphony", image: "https://picsum.photos/id/15/200/200", year: "2023", songs: 10 },
  { id: 2, name: "Short N' Sweet", artist: "Sabrina Carpenter", image: "https://i.scdn.co/image/ab67616d0000b273fd8d7a8d96871e791cb1f626", year: "2024", songs: 12 }
 ];

const allSongs = [
  { id: 1, title: "Frozen Heart", artist: "Elsa Melody", artistId: 1, album: "Winter Tales", albumId: 1, duration: "3:45", coverUrl: "https://picsum.photos/id/104/200/200", plays: "1.2M", trending: true, audioUrl: "https://res.cloudinary.com/dqxuz1q6i/video/upload/v1775568901/Sabrina_Carpenter_-_Espresso_sfhscb.mp3" },
  { id: 2, title: "Espresso", artist: "Sabrina Carpenter", artistId: 2, album: "Short n' Sweet", albumId: 2, duration: "3:21", coverUrl: "https://i.ytimg.com/vi/51zjlMhdSTE/maxresdefault.jpg", plays: "900M", trending: true, audioUrl: "https://res.cloudinary.com/dqxuz1q6i/video/upload/v1775568901/Sabrina_Carpenter_-_Espresso_sfhscb.mp3" },
  { id: 7, title: "Winter Magic", artist: "Elsa Melody", artistId: 1, album: "Winter Tales", albumId: 1, duration: "3:52", coverUrl: "https://picsum.photos/id/20/200/200", plays: "1.8M", trending: true, audioUrl: "https://res.cloudinary.com/dqxuz1q6i/video/upload/v1775568901/Sabrina_Carpenter_-_Espresso_sfhscb.mp3" },
];

type Page = "home" | "artist" | "album" | "search";

export default function Home() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  
  const [currentSong, setCurrentSong] = useState(allSongs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likedSongs, setLikedSongs] = useState<number[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedArtist, setSelectedArtist] = useState<any>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [playlistSongs, setPlaylistSongs] = useState<any[]>([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);
  const [songs, setSongs] = useState<any[]>([]);

useEffect(() => {
  fetch('/api/songs')
    .then(res => res.json())
    .then(data => setSongs(data))
}, []);

console.log("songs from API:", songs);

  // Auto-play next song when current song ends
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      playNextSong();
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [playlistSongs, currentQueueIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration || 0);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoaded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoaded);
    };
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.load();
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  

  const toggleLike = (songId: number) => {
    setLikedSongs(prev => 
      prev.includes(songId) 
        ? prev.filter(id => id !== songId)
        : [...prev, songId]
    );
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchQuery(searchInput);
      setCurrentPage("search");
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setCurrentPage("home");
  };

  const goToArtist = (artist: any) => {
    setSelectedArtist(artist);
    setCurrentPage("artist");
  };

  const goToAlbum = (album: any) => {
    setSelectedAlbum(album);
    setCurrentPage("album");
  };

  const goToHome = () => {
    setCurrentPage("home");
    setSelectedArtist(null);
    setSelectedAlbum(null);
    setSearchQuery("");
    setSearchInput("");
  };

  const getCurrentSongs = () => {
    if (currentPage === "artist" && selectedArtist) {
      return allSongs.filter(song => song.artistId === selectedArtist.id);
    }
    if (currentPage === "album" && selectedAlbum) {
      return allSongs.filter(song => song.albumId === selectedAlbum.id);
    }
    if (currentPage === "search" && searchQuery) {
      return allSongs.filter(song => 
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return [];
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const currentSongs = getCurrentSongs();
  const trendingSongs = songs;

  const nextSlide = () => {
    setSliderIndex((prev) => (prev + 1) % trendingSongs.length);
  };

  const prevSlide = () => {
    setSliderIndex((prev) => (prev - 1 + trendingSongs.length) % trendingSongs.length);
  };

  // Playlist queue functions
  const addToPlaylist = (song: any) => {
      setPlaylistSongs([...playlistSongs, song]);
    };

const removeFromPlaylist = (index: number) => {
  const newPlaylist = playlistSongs.filter((_, i) => i !== index);
  setPlaylistSongs(newPlaylist);
  if (currentQueueIndex >= newPlaylist.length) {
    setCurrentQueueIndex(Math.max(0, newPlaylist.length - 1));
  }
};

  const playSongFromPlaylist = (index: number) => {
    if (playlistSongs[index]) {
      setCurrentSong(playlistSongs[index]);
      setCurrentQueueIndex(index);
      setIsPlaying(true);
    }
  };

 const playNextSong = () => {
  if (playlistSongs.length > 1) {
    const newPlaylist = playlistSongs.slice(1);
    setPlaylistSongs(newPlaylist);
    setCurrentSong(newPlaylist[0]);
    setCurrentQueueIndex(0);
    setIsPlaying(true);
  } else {
    setPlaylistSongs([]);
    setCurrentQueueIndex(0);
    setIsPlaying(false);
  }
};

  const playPreviousSong = () => {
    if (playlistSongs.length > 0 && currentQueueIndex - 1 >= 0) {
      const prevIndex = currentQueueIndex - 1;
      setCurrentSong(playlistSongs[prevIndex]);
      setCurrentQueueIndex(prevIndex);
      setIsPlaying(true);
    }
  };

  const clearPlaylist = () => {
    setPlaylistSongs([]);
    setCurrentQueueIndex(0);
    setIsPlaying(false);
  };

  const playSongWithQueue = (song: any) => {
    // Check if song is already in playlist
    const existingIndex = playlistSongs.findIndex(s => (s._id || s.id) === (song._id || song.id));
    
    if (existingIndex !== -1) {
      // If song exists, play it from its position
      playSongFromPlaylist(existingIndex);
    } else {
      // If not, add to playlist and play it
      const newPlaylist = [...playlistSongs, song];
      setPlaylistSongs(newPlaylist);
      const newIndex = newPlaylist.length - 1;
      setCurrentSong(song);
      setCurrentQueueIndex(newIndex);
      setIsPlaying(true);
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-content">
          <div className="logo-container" onClick={goToHome}>
            <div className="logo-icon-wrapper">
              <img src="/Flake.jpg" alt="Frozen Beats Logo" className="logo-icon" />
            </div>
            <h1 className="logo-text">Frozen Beats</h1>
          </div>
          
          <nav className="nav">
            <button onClick={goToHome} className="nav-button">
              <HomeIcon className="nav-icon" />
              <span>Home</span>
            </button>
            <button className="nav-button">
              <Search className="nav-icon" />
              <span>Search</span>
            </button>
            <button className="nav-button">
              <Library className="nav-icon" />
              <span>Library</span>
            </button>
            <button className="nav-button">
              <User className="nav-icon" />
              <span>Profile</span>
            </button>
          </nav>

          <div className="library-section">
            <p className="library-title">Your Library</p>
            <div className="library-items">
              <div className="library-item library-item-primary">
                ✨ Favorites ({likedSongs.length})
              </div>
              <div className="library-item library-item-secondary">
                ❄️ Recently Played
              </div>
              <div className="library-item library-item-secondary">
                🎵 Playlists
              </div>
            </div>
          </div>

          {/* Playlist Button */}
          <button 
            onClick={() => setIsPlaylistOpen(true)}
            className="playlist-toggle-button"
          >
            <ListMusic size={20} />
            <span>Queue ({playlistSongs.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`main-content ${isPlaylistOpen ? 'with-playlist' : ''}`}>
        {/* Header with Search */}
        <div className="header">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search frozen melodies... (Press Enter)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="search-input"
            />
            {searchInput && (
              <button onClick={clearSearch} className="clear-search">
                <X className="clear-icon" />
              </button>
            )}
          </div>
          <div className="user-section">
            <div className="user-greeting">
              <p className="welcome-text">Welcome back</p>
              <p className="user-name">❄️ Music Lover</p>
            </div>
          </div>
        </div>

        {/* Hero Section - Now Playing */}
        <div className="now-playing-card frozen-card">
          <div className="now-playing-content">
            <div className="now-playing-image">
              <img src={currentSong.coverUrl} alt={currentSong.title} />
            </div>
            <div>
              <p className="now-playing-label">❄️ NOW PLAYING</p>
              <h2 className="now-playing-title">{currentSong.title}</h2>
              <p className="now-playing-meta">{currentSong.artist} • {currentSong.album}</p>
              <div className="controls">
                <button 
                  onClick={playPreviousSong}
                  className="control-button"
                  disabled={playlistSongs.length === 0 || currentQueueIndex === 0}
                >
                  <SkipBack size={20} />
                </button>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="play-button"
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button 
                  onClick={playNextSong}
                  className="control-button"
                  disabled={playlistSongs.length === 0 || currentQueueIndex === playlistSongs.length - 1}
                >
                  <SkipForward size={20} />
                </button>
                <button className="control-button">
                  <Volume2 size={20} />
                </button>
              </div>
              {playlistSongs.length > 0 && (
                <p className="queue-info">
                  Queue: {currentQueueIndex + 1} of {playlistSongs.length}
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* HOME PAGE */}
        {currentPage === "home" && (
          <>
            {/* Trending Slider */}
            {/* Trending Slider */}
            {trendingSongs.length > 0 && <div className="trending-slider">
              <div className="section-header">
                <h2 className="section-title">🔥 Trending Now</h2>
                <div className="slider-nav">
                  <button onClick={prevSlide} className="slider-button">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={nextSlide} className="slider-button">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
              <div className="slider-container">
                <div className="slider-track">
                  <div className="slider-item">
                    <div className="trending-card frozen-card">
                      <div className="trending-content">
                        <img 
                          src={trendingSongs[sliderIndex].coverUrl} 
                          alt={trendingSongs[sliderIndex].title}
                          className="trending-image"
                        />
                        <div className="trending-info">
                          <div className="trending-badge">
                            <span className="trending-rank">#{sliderIndex + 1}</span>
                            <span className="trending-label">Trending</span>
                          </div>
                          <h3 className="trending-title">{trendingSongs[sliderIndex].title}</h3>
                          <p className="trending-artist">{trendingSongs[sliderIndex].artist}</p>
                          <p className="trending-plays">{trendingSongs[sliderIndex].plays} plays</p>
                          <button 
                            onClick={() => {
                              playSongWithQueue(trendingSongs[sliderIndex]);
                            }}
                            className="play-button"
                            style={{ marginTop: '16px', padding: '8px 24px' }}
                          >
                            <Play size={16} style={{ display: 'inline', marginRight: '8px' }} /> Add to Queue & Play
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>}

            {/* Popular Artists */}
            <div style={{ marginBottom: '48px' }}>
              <h2 className="section-title" style={{ marginBottom: '24px' }}>🎤 Popular Artists</h2>
              <div className="artist-grid">
                {artists.map((artist) => (
                  <div
                    key={artist.id}
                    onClick={() => goToArtist(artist)}
                    className="artist-card frozen-card"
                  >
                    <img src={artist.image} alt={artist.name} className="artist-image" />
                    <h3 className="artist-name">{artist.name}</h3>
                    <p className="artist-followers">{artist.followers} followers</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Albums */}
            <div style={{ marginBottom: '48px' }}>
              <h2 className="section-title" style={{ marginBottom: '24px' }}>📀 Featured Albums</h2>
              <div className="album-grid">
                {albums.map((album) => (
                  <div
                    key={album.id}
                    onClick={() => goToAlbum(album)}
                    className="album-card frozen-card"
                  >
                    <img src={album.image} alt={album.name} className="album-image" />
                    <h3 className="album-name">{album.name}</h3>
                    <p className="album-meta">{album.artist} • {album.year}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Songs Grid */}
            <div>
              <h2 className="section-title" style={{ marginBottom: '24px' }}>❄️ Trending Tracks</h2>
              <div className="songs-grid">
                {trendingSongs.map((song) => (
                  <div
                    key={song.id}
                    className="song-card frozen-card"
                    onClick={() => {
                      playSongWithQueue(song);
                    }}
                  >
                    <div className="song-image-container">
                      <img 
                        src={song.coverUrl} 
                        alt={song.title}
                        className="song-image"
                      />
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
                        <p className="song-plays">❄️ {song.plays} plays</p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(song.id);
                          }}
                          className="like-button"
                        >
                          <Heart 
                            size={20}
                            className={likedSongs.includes(song.id) ? "like-icon-liked" : "like-icon"}
                          />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToPlaylist(song);
                          }}
                          className="add-to-playlist-button"
                          title="Add to queue"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ARTIST PAGE */}
        {currentPage === "artist" && selectedArtist && (
          <div>
            <button onClick={goToHome} className="back-button">
              <ChevronLeft size={20} /> Back to Home
            </button>
            
            <div className="artist-header frozen-card">
              <div className="artist-header-content">
                <img src={selectedArtist.image} alt={selectedArtist.name} className="artist-avatar" />
                <div>
                  <p className="artist-type">🎤 ARTIST</p>
                  <h2 className="artist-name-large">{selectedArtist.name}</h2>
                  <p className="artist-stats">{selectedArtist.followers} monthly listeners</p>
                </div>
              </div>
            </div>

            <h2 className="section-title" style={{ marginBottom: '24px' }}>🎵 Popular Songs</h2>
            <div className="songs-grid">
              {currentSongs.map((song) => (
                <div
                  key={song.id}
                  className="song-card frozen-card"
                  onClick={() => {
                    playSongWithQueue(song);
                  }}
                >
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
                      <p className="song-artist">{song.album}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={(e) => { e.stopPropagation(); toggleLike(song.id); }} className="like-button">
                        <Heart size={20} className={likedSongs.includes(song.id) ? "like-icon-liked" : "like-icon"} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToPlaylist(song);
                        }}
                        className="add-to-playlist-button"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ALBUM PAGE */}
        {currentPage === "album" && selectedAlbum && (
          <div>
            <button onClick={goToHome} className="back-button">
              <ChevronLeft size={20} /> Back to Home
            </button>
            
            <div className="album-header frozen-card">
              <div className="album-header-content">
                <img src={selectedAlbum.image} alt={selectedAlbum.name} className="album-cover" />
                <div>
                  <p className="album-type">📀 ALBUM</p>
                  <h2 className="album-name-large">{selectedAlbum.name}</h2>
                  <p className="album-details">{selectedAlbum.artist} • {selectedAlbum.year} • {selectedAlbum.songs} songs</p>
                </div>
              </div>
            </div>

            <h2 className="section-title" style={{ marginBottom: '24px' }}>🎵 Tracklist</h2>
            <div className="tracklist">
              {currentSongs.map((song, index) => (
                <div
                  key={song.id}
                  className="track-item frozen-card"
                  onClick={() => {
                    playSongWithQueue(song);
                  }}
                >
                  <div className="track-left">
                    <span className="track-number">#{index + 1}</span>
                    <div>
                      <h3 className="track-title">{song.title}</h3>
                      <p className="track-duration">{song.duration}</p>
                    </div>
                  </div>
                  <div className="track-actions">
                    <button onClick={(e) => { e.stopPropagation(); toggleLike(song.id); }} className="like-button">
                      <Heart size={20} className={likedSongs.includes(song.id) ? "like-icon-liked" : "like-icon"} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToPlaylist(song);
                      }}
                      className="add-to-playlist-button"
                    >
                      <Plus size={20} />
                    </button>
                    <Play size={20} style={{ color: '#0A74DA' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEARCH PAGE */}
        {currentPage === "search" && (
          <div>
            <h2 className="search-results">
              {currentSongs.length === 0 ? `No results for "${searchQuery}"` : `Search results for "${searchQuery}" (${currentSongs.length} songs)`}
            </h2>
            {currentSongs.length === 0 ? (
              <div className="empty-state">
                <p className="empty-message">No songs found matching "{searchQuery}"</p>
                <p className="empty-hint">Try searching for "Frozen", "Ice", or "Snow"</p>
              </div>
            ) : (
              <div className="songs-grid">
                {currentSongs.map((song) => (
                  <div
                    key={song.id}
                    className="song-card frozen-card"
                    onClick={() => {
                      playSongWithQueue(song);
                    }}
                  >
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
                        <p className="song-plays">❄️ {song.plays} plays</p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={(e) => { e.stopPropagation(); toggleLike(song.id); }} className="like-button">
                          <Heart size={20} className={likedSongs.includes(song.id) ? "like-icon-liked" : "like-icon"} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToPlaylist(song);
                          }}
                          className="add-to-playlist-button"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Now Playing Bar */}
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
              <button onClick={playPreviousSong} className="bar-control-button" disabled={playlistSongs.length === 0 || currentQueueIndex === 0}>
                <SkipBack size={20} />
              </button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="bar-play-button"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button onClick={playNextSong} className="bar-control-button" disabled={playlistSongs.length === 0 || currentQueueIndex === playlistSongs.length - 1}>
                <SkipForward size={20} />
              </button>
            </div>
            
            <div className="bar-volume">
              <Volume2 size={16} style={{ color: 'white' }} />
              <div 
                className="volume-slider-container"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const percent = (e.clientX - rect.left) / rect.width;
                  setVolume(Math.max(0, Math.min(1, percent)));
                }}
              >
                <div className="volume-progress" style={{ width: `${volume * 100}%` }} />
              </div>
            </div>
          </div>
          
          <div className="progress-wrapper">
            <div 
              className="progress-slider"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                if (audioRef.current && duration) {
                  const newTime = percent * duration;
                  audioRef.current.currentTime = newTime;
                  setCurrentTime(newTime);
                }
              }}
            >
              <div className="progress-progress" style={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }} />
            </div>
            <span className="bar-time">{formatTime(currentTime)} / {formatTime(duration)}</span>
          </div>
        </div>

        <audio ref={audioRef} src={currentSong.audioUrl} />
      </div>

      {/* Playlist Slider */}
      {isPlaylistOpen && (
        <div className="playlist-slider-overlay" onClick={() => setIsPlaylistOpen(false)}>
          <div className="playlist-slider" onClick={(e) => e.stopPropagation()}>
            <div className="playlist-header">
              <h2 className="playlist-title">
                <Music size={20} style={{ marginRight: '8px' }} />
                Queue ({playlistSongs.length})
              </h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                {playlistSongs.length > 0 && (
                  <button onClick={clearPlaylist} className="clear-playlist-button" title="Clear queue">
                    <Trash2 size={20} />
                  </button>
                )}
                <button onClick={() => setIsPlaylistOpen(false)} className="close-playlist">
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="playlist-content">
              {playlistSongs.length === 0 ? (
                <div className="empty-playlist">
                  <ListMusic size={48} />
                  <p>Your queue is empty</p>
                  <p className="empty-playlist-hint">Click the <Plus size={16} /> icon or tap any song to add to queue!</p>
                </div>
              ) : (
                <div className="playlist-songs">
                  {playlistSongs.map((song, index) => (
                    <div
                      key={song.id}
                     className={`playlist-song-item ${
                                  index === currentQueueIndex &&
                                  ((currentSong as any)._id || currentSong.id) === (song._id || song.id)
                                    ? "active"
                                    : ""
                                }`}
                      onClick={() => playSongFromPlaylist(index)}
                    >
                      <div className="playlist-song-number">{index + 1}</div>
                      <img src={song.coverUrl} alt={song.title} className="playlist-song-image" />
                      <div className="playlist-song-info">
                        <h4 className="playlist-song-title">{song.title}</h4>
                        <p className="playlist-song-artist">{song.artist}</p>
                      </div>
                      <div className="playlist-song-duration">{song.duration}</div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromPlaylist(index);
                        }}
                        className="remove-from-playlist"
                        title="Remove from queue"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}