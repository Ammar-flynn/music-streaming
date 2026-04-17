import { Search, X } from "lucide-react";

interface HeaderProps {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onSearch: () => void;
  onClearSearch: () => void;
  isLoggedIn: boolean;
  username?: string;
}

export function Header({ 
  searchInput, 
  onSearchInputChange, 
  onSearch, 
  onClearSearch, 
  isLoggedIn, 
  username 
}: HeaderProps) {
  return (
    <div className="header">
      <div className="search-container">
        <Search className="search-icon" />
        <input
          type="text"
          placeholder="Search frozen melodies... (Press Enter)"
          value={searchInput}
          onChange={(e) => onSearchInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSearch();
            }
          }}
          className="search-input"
        />
        {searchInput && (
          <button onClick={onClearSearch} className="clear-search">
            <X className="clear-icon" />
          </button>
        )}
      </div>
      <div className="user-section">
        <div className="user-greeting">
          <p className="welcome-text">Welcome back</p>
          <p className="user-name">
            {isLoggedIn ? username : "❄️ Guest"}
          </p>
        </div>
      </div>
    </div>
  );
}