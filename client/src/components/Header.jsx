import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useSession } from "../contexts/SessionContext";
import { useSaved } from "../contexts/SavedContext";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const [query, setQuery] = useState("");

  const { user, setUser } = useSession();
  const { refreshSaved } = useSaved();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser({});
    refreshSaved();
    navigate("/login");
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const getInitials = (username) => {
    if (!username) return "";
    return username.slice(0, 2).toUpperCase();
  };

  return (
    <header className="site-header">
      <div className="wrap">
        <Link to="/" className="logo">
          The <span className="rest">Rest</span> is{" "}
          <span className="retro">Retro</span>
        </Link>

        <div className="search">
          <span>⌕</span>
          <input
            placeholder="Search for relics…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        <nav className="nav">
          {token ? (
            <>
              <Link to="/create-item">Sell an item</Link>
              <Link to="/saved">Saved</Link>
              <Link to="/my-listings">My listings</Link>
              <span className="avatar" title={user.username}>
                {getInitials(user.username)}
              </span>
              <button
                className="btn btn-ghost btn-compact"
                onClick={handleLogout}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/signup">Sign up</Link>
              <Link className="btn btn-ghost btn-compact" to="/login">
                Log in
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
