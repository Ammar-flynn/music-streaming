"use client";

import { useState, useEffect } from "react";
import { AlertCircle, Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { NowPlayingBar } from "./components/NowPlaying";
import { TrendingSlider } from "./components/TrendingSlider";
import { ArtistGrid } from "./components/ArtistGrid";
import { AlbumGrid } from "./components/AlbumGrid";
import { SongGrid } from "./components/SongGrid";
import { QueueModal } from "./components/QueueModal";
import { AuthModal } from "./components/AuthModal";
import { ArtistPage } from "./components/ArtistPage";
import { AlbumPage } from "./components/AlbumPage";
import { SearchPage } from "./components/SearchPage";
import { FavoritesPage } from "./components/FavoritesPage";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
import { useAuth } from "./hooks/useAuth";
import { useFavorites } from "./hooks/useFavorites";
import { Page, Song, Artist, Album } from "./types";

export default function Home() {
  // ========== STATE ==========
  const [songs, setSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([
    { id: "default-1", name: "Sabrina Carpenter", image: "https://i.ytimg.com/vi/51zjlMhdSTE/maxresdefault.jpg", followers: "222.5M" },
    { id: "default-2", name: "Elsa Melody", image: "https://picsum.photos/id/104/200/200", followers: "2.5M" }
  ]);
  const [albums, setAlbums] = useState<Album[]>([
    { id: "default-1", name: "Short N' Sweet", artist: "Sabrina Carpenter", image: "https://i.scdn.co/image/ab67616d0000b273fd8d7a8d96871e791cb1f626", year: "2024", songs: 12 },
    { id: "default-2", name: "Frozen Echoes", artist: "Snow Symphony", image: "https://picsum.photos/id/15/200/200", year: "2023", songs: 10 }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // ========== HOOKS ==========
  const {
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
    playSong,
    addToQueue,
    removeFromQueue,
    playNext,
    playPrevious,
    clearQueue,
    playSongWithQueue,
  } = useAudioPlayer();

  const {
  isLoggedIn,
  user,
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  registerUsername,
  setRegisterUsername,
  registerEmail,
  setRegisterEmail,
  registerPassword,
  setRegisterPassword,
  otp,                 
  setOtp,              
  showOtpInput,        
  authError,
  authMode,
  setAuthMode,
  isLoading,           
  handleLogin,
  handleRegister,
  handleVerifyOtp,     
  handleResendOtp,     
  handleLogout,
} = useAuth();

  const { favorites, setFavorites, fetchFavorites, toggleFavorite, resetFavorites } = useFavorites(songs, isLoggedIn, user);

  // ========== HARDCODED DATA ==========
  const hardcodedSongs: Song[] = [
    {
      _id: "hardcoded_1",
      title: "Espresso",
      artist: "Sabrina Carpenter",
      album: "Short N' Sweet",
      coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3SuAvXxSHfSqDe0jS5hZexnC7-ovu3SudDw&s",
      audioUrl: "https://res.cloudinary.com/dqxuz1q6i/video/upload/v1775568901/Sabrina_Carpenter_-_Espresso_sfhscb.mp3",
      plays: 125678
    },
    {
      _id: "hardcoded_2",
      title: "Frozen Heart",
      artist: "Elsa Melody",
      album: "Frozen Echoes",
      coverUrl: "https://picsum.photos/id/104/200/200",
      audioUrl: "",
      plays: 50000
    }
  ];

  // ========== HELPER FUNCTIONS ==========
  const extractArtistsFromSongs = (apiSongs: Song[]) => {
    const artistMap = new Map();
    apiSongs.forEach(song => {
      if (!artistMap.has(song.artist)) {
        artistMap.set(song.artist, {
          id: `api-${song.artist.toLowerCase().replace(/\s/g, '-')}`,
          name: song.artist,
          image: song.coverUrl,
          followers: Math.floor(Math.random() * 1000000).toLocaleString()
        });
      }
    });
    return Array.from(artistMap.values());
  };

  const extractAlbumsFromSongs = (apiSongs: Song[]) => {
    const albumMap = new Map();
    apiSongs.forEach(song => {
      const key = `${song.album}-${song.artist}`;
      if (!albumMap.has(key)) {
        albumMap.set(key, {
          id: `api-${key.toLowerCase().replace(/\s/g, '-')}`,
          name: song.album,
          artist: song.artist,
          image: song.coverUrl,
          year: "2024",
          songs: 1
        });
      } else {
        const existing = albumMap.get(key);
        existing.songs += 1;
        albumMap.set(key, existing);
      }
    });
    return Array.from(albumMap.values());
  };

  // ========== MAIN FUNCTIONS ==========
  const fetchSongs = async () => {
    try {
      setLoading(true);
      let apiSongs: Song[] = [];
      
      try {
        const res = await fetch('/api/songs');
        if (res.ok) {
          apiSongs = await res.json();
        }
      } catch (err) {
        console.log('API not available');
      }
      
      const allSongs = [...hardcodedSongs];
      for (const apiSong of apiSongs) {
        const isDuplicate = hardcodedSongs.some(hardcoded => 
          hardcoded.title === apiSong.title && hardcoded.artist === apiSong.artist
        );
        if (!isDuplicate) {
          allSongs.push(apiSong);
        }
      }
      
      setSongs(allSongs);
      
      if (apiSongs.length > 0) {
        const apiArtists = extractArtistsFromSongs(apiSongs);
        const apiAlbums = extractAlbumsFromSongs(apiSongs);
        
        const mergedArtists = [...artists];
        for (const apiArtist of apiArtists) {
          const exists = mergedArtists.some(a => a.name === apiArtist.name);
          if (!exists) {
            mergedArtists.push(apiArtist);
          }
        }
        setArtists(mergedArtists);
        
        const mergedAlbums = [...albums];
        for (const apiAlbum of apiAlbums) {
          const exists = mergedAlbums.some(a => a.name === apiAlbum.name && a.artist === apiAlbum.artist);
          if (!exists) {
            mergedAlbums.push(apiAlbum);
          }
        }
        setAlbums(mergedAlbums);
      }
      
    } catch (err) {
      setError('Failed to load songs');
      console.error(err);
      setSongs(hardcodedSongs);
    } finally {
      setLoading(false);
    }
  };

  const incrementPlays = async (songId: string) => {
    if (songId.startsWith('hardcoded')) return;
    try {
      await fetch('/api/songs/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songId })
      });
    } catch (err) {
      console.error('Failed to increment plays:', err);
    }
  };

  const handlePlaySong = (song: Song) => {
    playSongWithQueue(song);
    incrementPlays(song._id);
  };

  const handleToggleFavorite = async (song: Song) => {
    const result = await toggleFavorite(song);
    if (result.requiresLogin) {
      setCurrentPage("login");
    }
  };

  // LOGOUT HANDLER - Clears everything
  const handleLogoutClick = () => {
    // Clear audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    
    // Clear player state
    clearQueue();
    setIsPlaying(false);
    setCurrentSong(null);
    
    // Clear auth
    handleLogout();
    
    // Clear favorites
    resetFavorites();
    
    // Reset UI state
    setCurrentPage("home");
    setSearchInput("");
    setSearchQuery("");
    setSelectedArtist(null);
    setSelectedAlbum(null);
    setError(null);
    setSliderIndex(0);
  };

  // In your page.tsx, add this handler
const handleVerifyOtpAndRedirect = async (e: React.FormEvent) => {
  const success = await handleVerifyOtp(e);
  
  if (success) {
    // Clear any existing player state
    clearQueue();
    setIsPlaying(false);
    setCurrentSong(null);
    
    // Reset search and selection
    setSearchInput("");
    setSearchQuery("");
    setSelectedArtist(null);
    setSelectedAlbum(null);
    setError(null);
    
    // Redirect to home page
    setCurrentPage("home");
    
    // Optional: Show success message
    console.log("Account created and logged in successfully!");
  }
};

  // LOGIN HANDLER - Resets and loads user data
  const handleLoginClick = async (e: React.FormEvent) => {
    const success = await handleLogin(e);
    
    if (success) {
      // Clear previous state before loading new user data
      clearQueue();
      setIsPlaying(false);
      setCurrentSong(null);
      setCurrentPage("home");
      setSearchInput("");
      setSearchQuery("");
      setSelectedArtist(null);
      setSelectedAlbum(null);
      setError(null);
      
      // Favorites will be loaded automatically by the useEffect
      // that watches isLoggedIn and user
    }
  };

  // ========== DERIVED DATA ==========
  const trendingSongs = [...songs].sort((a, b) => b.plays - a.plays).slice(0, 10);
  const searchResults = () => {
    if (!searchQuery) return [];
    return songs.filter(song => 
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // ========== USE EFFECTS ==========
  useEffect(() => {
    fetchSongs();
  }, []);

  useEffect(() => {
    if (isLoggedIn && user) {
      fetchFavorites(user.userId);
    } else {
      resetFavorites();
    }
  }, [isLoggedIn, user, songs]);

  // ========== LOADING STATE ==========
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your frozen beats...</p>
      </div>
    );
  }

  // ========== RENDER ==========
  return (
    <div className="app-container">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentPage={currentPage}
        onPageChange={(page) => {
          setCurrentPage(page);
          if (page === "home") {
            setSelectedArtist(null);
            setSelectedAlbum(null);
          }
        }}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogoutClick}
        queueLength={queue.length}
        onOpenQueue={() => setIsQueueOpen(true)}
        favoritesCount={favorites.length}
      />

      <div className={`main-content ${sidebarCollapsed ? 'collapsed' : ''} ${isQueueOpen ? 'with-queue' : ''}`}>
        <Header
          searchInput={searchInput}
          onSearchInputChange={setSearchInput}
          onSearch={() => {
            setSearchQuery(searchInput);
            setCurrentPage("search");
          }}
          onClearSearch={() => {
            setSearchInput("");
            setSearchQuery("");
          }}
          isLoggedIn={isLoggedIn}
          username={user?.username}
        />

        {error && (
          <div className="error-banner">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {currentSong && (
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
                  <button onClick={playPrevious} className="control-button">
                    <SkipBack size={20} />
                  </button>
                  <button onClick={() => setIsPlaying(!isPlaying)} className="play-button">
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </button>
                  <button onClick={playNext} className="control-button">
                    <SkipForward size={20} />
                  </button>
                </div>
                {queue.length > 0 && currentQueueIndex >= 0 && (
                  <p className="queue-info">Queue: {currentQueueIndex + 1} of {queue.length}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {currentPage === "home" && (
          <>
            <TrendingSlider
              trendingSongs={trendingSongs}
              sliderIndex={sliderIndex}
              onPrevSlide={() => setSliderIndex((prev) => (prev - 1 + trendingSongs.length) % trendingSongs.length)}
              onNextSlide={() => setSliderIndex((prev) => (prev + 1) % trendingSongs.length)}
              onPlay={handlePlaySong}
            />
            <ArtistGrid artists={artists} onSelectArtist={(artist) => {
              setSelectedArtist(artist);
              setCurrentPage("artist");
            }} />
            <AlbumGrid albums={albums} onSelectAlbum={(album) => {
              setSelectedAlbum(album);
              setCurrentPage("album");
            }} />
            <div>
              <h2 className="section-title" style={{ marginBottom: '24px' }}>❄️ All Tracks</h2>
              <SongGrid
                songs={songs.slice(0, 6)}
                favorites={favorites}
                onPlay={handlePlaySong}
                onToggleFavorite={handleToggleFavorite}
                onAddToQueue={addToQueue}
              />
            </div>
          </>
        )}

        {currentPage === "artist" && selectedArtist && (
          <ArtistPage
            artist={selectedArtist}
            songs={songs}
            favorites={favorites}
            onBack={() => setCurrentPage("home")}
            onPlay={handlePlaySong}
            onToggleFavorite={handleToggleFavorite}
            onAddToQueue={addToQueue}
          />
        )}

        {currentPage === "album" && selectedAlbum && (
          <AlbumPage
            album={selectedAlbum}
            songs={songs}
            favorites={favorites}
            onBack={() => setCurrentPage("home")}
            onPlay={handlePlaySong}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {currentPage === "search" && (
          <SearchPage
            query={searchQuery}
            results={searchResults()}
            favorites={favorites}
            onPlay={handlePlaySong}
            onToggleFavorite={handleToggleFavorite}
            onAddToQueue={addToQueue}
          />
        )}

        {currentPage === "favorites" && (
          <FavoritesPage
            favorites={favorites}
            onPlay={handlePlaySong}
            onToggleFavorite={handleToggleFavorite}
            onAddToQueue={addToQueue}
          />
        )}


    {currentPage === "login" && !isLoggedIn && (
        <AuthModal
          mode={authMode}
          onModeChange={setAuthMode}
          loginEmail={loginEmail}
          setLoginEmail={setLoginEmail}
          loginPassword={loginPassword}
          setLoginPassword={setLoginPassword}
          registerUsername={registerUsername}
          setRegisterUsername={setRegisterUsername}
          registerEmail={registerEmail}
          setRegisterEmail={setRegisterEmail}
          registerPassword={registerPassword}
          setRegisterPassword={setRegisterPassword}
          otp={otp}
          setOtp={setOtp}
          showOtpInput={showOtpInput}
          error={authError}
          isLoading={isLoading}
          onLogin={handleLoginClick}
          onRegister={handleRegister}
          onVerifyOtp={handleVerifyOtpAndRedirect}  // ← Use this instead
          onResendOtp={handleResendOtp}
          onGuestContinue={() => setCurrentPage("home")}
        />
      )}
      </div>

      <NowPlayingBar
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onNext={playNext}
        onPrevious={playPrevious}
        volume={volume}
        onVolumeChange={setVolume}
        currentTime={currentTime}
        duration={duration}
        formatTime={formatTime}
        audioRef={audioRef}
      />

      <audio ref={audioRef} />

      <QueueModal
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
        queue={queue}
        currentSong={currentSong}
        currentQueueIndex={currentQueueIndex}
        onPlaySong={playSong}
        onRemoveFromQueue={removeFromQueue}
        onClearQueue={clearQueue}
      />
    </div>
  );
}