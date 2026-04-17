import { Artist } from "@/types";

interface ArtistGridProps {
  artists: Artist[];
  onSelectArtist: (artist: Artist) => void;
}

export function ArtistGrid({ artists, onSelectArtist }: ArtistGridProps) {
  return (
    <div style={{ marginBottom: '48px' }}>
      <h2 className="section-title" style={{ marginBottom: '24px' }}>🎤 Popular Artists</h2>
      <div className="artist-grid">
        {artists.map((artist) => (
          <div key={artist.id} onClick={() => onSelectArtist(artist)} className="artist-card frozen-card">
            <img src={artist.image} alt={artist.name} className="artist-image" />
            <h3 className="artist-name">{artist.name}</h3>
            <p className="artist-followers">{artist.followers} followers</p>
          </div>
        ))}
      </div>
    </div>
  );
}