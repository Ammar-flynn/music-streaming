import { Album } from "@/types";

interface AlbumGridProps {
  albums: Album[];
  onSelectAlbum: (album: Album) => void;
}

export function AlbumGrid({ albums, onSelectAlbum }: AlbumGridProps) {
  return (
    <div style={{ marginBottom: '48px' }}>
      <h2 className="section-title" style={{ marginBottom: '24px' }}>📀 Featured Albums</h2>
      <div className="album-grid">
        {albums.map((album) => (
          <div key={album.id} onClick={() => onSelectAlbum(album)} className="album-card frozen-card">
            <img src={album.image} alt={album.name} className="album-image" />
            <h3 className="album-name">{album.name}</h3>
            <p className="album-meta">{album.artist} • {album.year}</p>
          </div>
        ))}
      </div>
    </div>
  );
}