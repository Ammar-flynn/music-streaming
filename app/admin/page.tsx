"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, Music, Image, X, CheckCircle, AlertCircle, LogOut, User } from "lucide-react";
import "./admin.css";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    album: "",
    audio: null as File | null,
    cover: null as File | null,
    artistCover: null as File | null, // NEW: Artist cover image
  });

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role === 'admin') {
        setUser({ userId: payload.userId, role: payload.role, username: payload.username });
        setIsAuthorized(true);
      } else {
        router.replace('/');
      }
    } catch (err) {
      router.replace('/login');
    } finally {
      setIsCheckingAuth(false);
    }
  }, [router]);

  if (isCheckingAuth) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Checking authorization...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!formData.title || !formData.artist || !formData.album || !formData.audio || !formData.cover) {
      setError("Please fill in all fields and upload audio and song cover");
      setLoading(false);
      return;
    }

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("artist", formData.artist);
    submitData.append("album", formData.album);
    submitData.append("audio", formData.audio);
    submitData.append("cover", formData.cover);
    if (formData.artistCover) {
      submitData.append("artistCover", formData.artistCover);
    }

    try {
      const token = localStorage.getItem('token');
      
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: submitData,
      });

      const data = await res.json();
      
      if (res.ok) {
        let successMessage = `✅ Song "${formData.title}" uploaded successfully!\n`;
        if (data.artist?.created) {
          successMessage += `🎨 New artist "${data.artist.name}" was created with custom image!`;
        } else {
          successMessage += `🎨 Added to existing artist "${data.artist.name}"`;
          if (formData.artistCover) {
            successMessage += `\n🖼️ Artist image was updated!`;
          }
        }
        setSuccess(successMessage);
        
        setFormData({
          title: "",
          artist: "",
          album: "",
          audio: null,
          cover: null,
          artistCover: null,
        });
        // Reset file inputs
        const audioInput = document.getElementById('audio') as HTMLInputElement;
        const coverInput = document.getElementById('cover') as HTMLInputElement;
        const artistCoverInput = document.getElementById('artistCover') as HTMLInputElement;
        if (audioInput) audioInput.value = '';
        if (coverInput) coverInput.value = '';
        if (artistCoverInput) artistCoverInput.value = '';
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err) {
      setError("Failed to upload song. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>🎵 Admin Dashboard - Upload Songs</h1>
        <button onClick={handleLogout} className="logout-button">
          <LogOut size={20} />
          Logout
        </button>
      </div>

      <div className="admin-content">
        {success && (
          <div className="success-message">
            <CheckCircle size={20} />
            <span style={{ whiteSpace: 'pre-line' }}>{success}</span>
            <button onClick={() => setSuccess(null)}><X size={16} /></button>
          </div>
        )}

        {error && (
          <div className="error-message">
            <AlertCircle size={20} />
            <span>{error}</span>
            <button onClick={() => setError(null)}><X size={16} /></button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label>Song Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter song title"
              required
            />
          </div>

          <div className="form-group">
            <label>Artist Name</label>
            <input
              type="text"
              name="artist"
              value={formData.artist}
              onChange={handleInputChange}
              placeholder="Enter artist name"
              required
            />
          </div>

          <div className="form-group">
            <label>Album Name</label>
            <input
              type="text"
              name="album"
              value={formData.album}
              onChange={handleInputChange}
              placeholder="Enter album name"
              required
            />
          </div>

          <div className="form-group">
            <label>Audio File (MP3)</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="audio"
                name="audio"
                accept="audio/*"
                onChange={handleFileChange}
                required
              />
              <Music size={20} />
              <span>{formData.audio ? formData.audio.name : "Choose audio file"}</span>
            </div>
          </div>

          <div className="form-group">
            <label>Song Cover Image</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="cover"
                name="cover"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
              <Image size={20} />
              <span>{formData.cover ? formData.cover.name : "Choose song cover image"}</span>
            </div>
          </div>

          <div className="form-group">
            <label>Artist Cover Image (Optional)</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="artistCover"
                name="artistCover"
                accept="image/*"
                onChange={handleFileChange}
              />
              <User size={20} />
              <span>{formData.artistCover ? formData.artistCover.name : "Choose artist image (optional)"}</span>
            </div>
            <small className="help-text">If not provided, song cover will be used for artist</small>
          </div>

          <button type="submit" disabled={loading} className="upload-button">
            {loading ? "Uploading..." : "Upload Song"}
            {!loading && <Upload size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
}