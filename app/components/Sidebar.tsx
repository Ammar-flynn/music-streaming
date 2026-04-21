import { HomeIcon, Search, Heart, LogIn, LogOut, Menu, ListMusic, Key, Monitor } from "lucide-react";
import { Page } from "../types";
import { useState } from "react";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  currentPage: Page;
  onPageChange: (page: Page) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  onOpenChangePassword: () => void; 
  queueLength: number;
  onOpenQueue: () => void;
  favoritesCount: number;
}

export function Sidebar({ 
  collapsed, 
  onToggleCollapse, 
  currentPage, 
  onPageChange, 
  isLoggedIn, 
  onLogout, 
  onOpenChangePassword, 
  queueLength, 
  onOpenQueue,
  favoritesCount
}: SidebarProps) {
  const [showDesktopModal, setShowDesktopModal] = useState(false);
  
  const handleChangePassword = () => {
    console.log("🔐 Change Password button clicked");
    console.log("isLoggedIn:", isLoggedIn);
    console.log("collapsed:", collapsed);
    onOpenChangePassword();
  };

  // Function to close mobile menu when clicking a link
  const closeMobileMenu = () => {
    const checkbox = document.getElementById('mobile-menu-toggle') as HTMLInputElement;
    if (checkbox) checkbox.checked = false;
  };

  const handlePageChange = (page: Page) => {
    onPageChange(page);
    closeMobileMenu();
  };

  // Detect if already running as desktop app
  const isDesktopApp = navigator.userAgent.includes('Electron') || !!(window as any).electronAPI;

  return (
    <>
      {/* Desktop App Modal Popup - Using unique class names */}
      {showDesktopModal && (
        <div className="desktop-app-modal-overlay" onClick={() => setShowDesktopModal(false)}>
          <div className="desktop-app-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="desktop-app-modal-header">
              <Monitor size={28} />
              <h2>Frozen Beats Desktop App</h2>
              <button className="desktop-app-modal-close" onClick={() => setShowDesktopModal(false)}>✕</button>
            </div>
            <div className="desktop-app-modal-body">
              <p>Take your music experience to the next level with the Frozen Beats desktop application!</p>
              
              <div className="desktop-app-modal-features">
                <h3>✨ Features:</h3>
                <ul>
                  <li>🎵 High-quality audio playback</li>
                  <li>⚡ Faster performance than browser</li>
                </ul>
              </div>
              
              <div className="desktop-app-modal-requirements">
                <h3>📋 Requirements:</h3>
                <ul>
                  <li>Windows 10 or later (64-bit)</li>
                  <li>Internet connection for streaming</li>
                  <li>250MB free disk space</li>
                </ul>
              </div>
              
              <div className="desktop-app-modal-buttons">
                <a 
                  href="https://frozenbeats.vercel.app/download/Frozen Beats Setup.exe" 
                  className="desktop-app-download-btn"
                  download
                >
                  <Monitor size={18} />
                  Download for Windows
                </a>
                <button className="desktop-app-cancel-btn" onClick={() => setShowDesktopModal(false)}>
                  Maybe Later
                </button>
              </div>
              
              <p className="desktop-app-modal-note">
                💡 <strong>Note:</strong> You're currently using the web version. 
                The desktop app offers a richer experience!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hidden checkbox for mobile menu */}
      <input type="checkbox" id="mobile-menu-toggle" className="mobile-menu-toggle" />
      
      {/* Hamburger menu label */}
      <label htmlFor="mobile-menu-toggle" className="mobile-menu-button">
         <img src="/Flake.jpg" alt="Frozen Beats" className="logo-icon" />
      </label>
      
      {/* Overlay when sidebar is open */}
      <label htmlFor="mobile-menu-toggle" className="sidebar-overlay"></label>
      
      <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-content">
          <button className="sidebar-toggle" onClick={onToggleCollapse}>
          <div className="logo-container" onClick={() => handlePageChange("home")}>
            <div className="logo-icon-wrapper">
              <img src="/Flake.jpg" alt="Frozen Beats" className="logo-icon" />
            </div>
            {!collapsed && <h1 className="logo-text">Frozen Beats</h1>}
          </div>
          </button>
          
          <nav className="nav">
            <button onClick={() => handlePageChange("home")} className="nav-button">
              <HomeIcon className="nav-icon" />
              {!collapsed && <span>Home</span>}
            </button>
            <button onClick={() => handlePageChange("search")} className="nav-button">
              <Search className="nav-icon" />
              {!collapsed && <span>Search</span>}
            </button>
            <button onClick={() => handlePageChange("favorites")} className="nav-button">
              <Heart className="nav-icon" />
              {!collapsed && <span>Favorites</span>}
            </button>
            {!collapsed && (
              <div className="library-section">
                <p className="library-title">Your Library</p>
                <div className="library-items">
                  <div className="library-item library-item-primary">
                    ✨ Favorites ({favoritesCount})
                  </div>
                </div>
              </div>
            )}
          </nav>

          <button onClick={() => {
            onOpenQueue();
            closeMobileMenu();
          }} className="queue-toggle-button">
            <ListMusic size={20} />
            {!collapsed && <span>Queue ({queueLength})</span>}
          </button>

          {/* Change Password Button */}
          {isLoggedIn && !collapsed && (
            <button 
              onClick={() => {
                handleChangePassword();
                closeMobileMenu();
              }}
              className="auth-button change-password-btn"
            >
              <Key size={20} />
              <span>Change Password</span>
            </button>
          )}

          {!collapsed && (
            <>
              {isLoggedIn ? (
                <button onClick={() => {
                  onLogout();
                  closeMobileMenu();
                }} className="auth-button">
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              ) : (
                <button onClick={() => handlePageChange("login")} className="auth-button">
                  <LogIn size={20} />
                  <span>Login</span>
                </button>
              )}
            </>
          )}

          {/* Desktop App Section*/}
          {!collapsed && !isDesktopApp && (
            <div className="desktop-app-section">
              <button 
                className="desktop-app-button"
                onClick={() => setShowDesktopModal(true)}
              >
                <Monitor size={18} />
                <span>Desktop App</span>
              </button>
              <p className="desktop-app-hint">Download the native app for better experience</p>
            </div>
          )}

          {/* Show different message if already in desktop app */}
          {!collapsed && isDesktopApp && (
            <div className="desktop-app-section desktop-active">
              <div className="desktop-app-badge">
                <Monitor size={18} />
                <span>Desktop Version</span>
              </div>
              <p className="desktop-app-hint">✨ You're using the native app</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}