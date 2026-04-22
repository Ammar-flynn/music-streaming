import { Song, Artist, Album } from "../types";
import { SongCard } from "./SongCard";

interface SearchPageProps {
  query: string;
  songs: Song[];
  artists: Artist[];
  albums: Album[];
  favorites: Song[];
  onPlay: (song: Song) => void;
  onToggleFavorite: (song: Song) => void;
  onAddToQueue: (song: Song) => void;
  onSelectArtist: (artist: Artist) => void;
  onSelectAlbum: (album: Album) => void;
}

export function SearchPage({ 
  query, 
  songs, 
  artists, 
  albums, 
  favorites, 
  onPlay, 
  onToggleFavorite, 
  onAddToQueue,
  onSelectArtist,
  onSelectAlbum
}: SearchPageProps) {
  
  // Filter artists based on search query
  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(query.toLowerCase())
  );
  
  // Filter albums based on search query
  const filteredAlbums = albums.filter(album =>
    album.name.toLowerCase().includes(query.toLowerCase()) ||
    album.artist.toLowerCase().includes(query.toLowerCase())
  );
  
  // Filter songs based on search query
  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(query.toLowerCase()) ||
    song.artist.toLowerCase().includes(query.toLowerCase()) ||
    song.album.toLowerCase().includes(query.toLowerCase())
  );
  
  const hasResults = filteredSongs.length > 0 || filteredArtists.length > 0 || filteredAlbums.length > 0;
  
  return (
    <div>
      <h2 className="search-results">Search results for "{query}"</h2>
      
      {!hasResults && (
        <div className="empty-state">
          <p className="empty-message">No results found</p>
          <p className="empty-hint">Try searching for songs, artists, or albums</p>
        </div>
      )}
      
      {/* Artists Section - Simple "Artists" title for search */}
      {filteredArtists.length > 0 && (
        <div style={{ marginBottom: '48px' }}>
          <h2 className="section-title" style={{ marginBottom: '24px' }}>🎤 Artists ({filteredArtists.length})</h2>
          <div className="artist-grid">
            {filteredArtists.map((artist) => (
              <div key={artist.id} onClick={() => onSelectArtist(artist)} className="artist-card frozen-card">
                <img src={artist.image} alt={artist.name} className="artist-image" />
                <h3 className="artist-name">{artist.name}</h3>
                <p className="artist-followers">{artist.followers} followers</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Albums Section - Simple "Albums" title for search */}
      {filteredAlbums.length > 0 && (
        <div style={{ marginBottom: '48px' }}>
          <h2 className="section-title" style={{ marginBottom: '24px' }}>📀 Albums ({filteredAlbums.length})</h2>
          <div className="album-grid">
            {filteredAlbums.map((album) => (
              <div key={album.id} onClick={() => onSelectAlbum(album)} className="album-card frozen-card">
                <img src={album.image} alt={album.name} className="album-image" />
                <h3 className="album-name">{album.name}</h3>
                <p className="album-meta">{album.artist} • {album.year}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Songs Section */}
      {filteredSongs.length > 0 && (
        <div>
          <h2 className="section-title" style={{ marginBottom: '24px' }}>🎵 Songs ({filteredSongs.length})</h2>
          <div className="songs-grid">
            {filteredSongs.map((song) => (
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
      )}
    </div>
  );
}