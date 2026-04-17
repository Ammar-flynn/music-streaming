import { HomeIcon, Search, Heart, LogIn, LogOut, Menu, ListMusic } from "lucide-react";
import { Page } from "@/types";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  currentPage: Page;
  onPageChange: (page: Page) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
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
  queueLength, 
  onOpenQueue,
  favoritesCount
}: SidebarProps) {
  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-content">
        <button className="sidebar-toggle" onClick={onToggleCollapse}>
          <Menu size={20} />
        </button>
        
        <div className="logo-container" onClick={() => onPageChange("home")}>
          <div className="logo-icon-wrapper">
            <img src="/Flake.jpg" alt="Frozen Beats" className="logo-icon" />
          </div>
          {!collapsed && <h1 className="logo-text">Frozen Beats</h1>}
        </div>
        
        <nav className="nav">
          <button onClick={() => onPageChange("home")} className="nav-button">
            <HomeIcon className="nav-icon" />
            {!collapsed && <span>Home</span>}
          </button>
          <button onClick={() => onPageChange("search")} className="nav-button">
            <Search className="nav-icon" />
            {!collapsed && <span>Search</span>}
          </button>
          <button onClick={() => onPageChange("favorites")} className="nav-button">
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

        <button onClick={onOpenQueue} className="queue-toggle-button">
          <ListMusic size={20} />
          {!collapsed && <span>Queue ({queueLength})</span>}
        </button>

        {!collapsed && (
          <>
            {isLoggedIn ? (
              <button onClick={onLogout} className="auth-button">
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            ) : (
              <button onClick={() => onPageChange("login")} className="auth-button">
                <LogIn size={20} />
                <span>Login</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}