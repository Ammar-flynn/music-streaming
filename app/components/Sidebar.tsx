import { HomeIcon, Search, Heart, LogIn, LogOut, Menu, ListMusic, Key } from "lucide-react";
import { Page } from "../types";

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

  return (
    <>
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
        </div>
      </div>
    </>
  );
}