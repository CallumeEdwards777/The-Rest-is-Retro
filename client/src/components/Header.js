import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import "../styles/components/header.css";

export default function Header() {
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="header">
      <div className="container header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <img src="/logo.png" alt="Retro - Everything Vintage" className="logo-img" />
        </Link>

        {/* Navigation */}
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/eras">Eras</Link>
          <Link to="/new">New</Link>
          <Link to="/sale">Sale</Link>
          <Link to="/about">About</Link>
        </nav>

        {/* Search Bar */}
        <input type="text" className="search-bar" placeholder="Search..." />

        {/* Right Icons */}
        <div className="header-right">
          {/* Theme Toggle */}
          <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
            {isDark ? "☀️" : "🌙"}
          </button>

          {/* Account */}
          <div className="account-dropdown">
            <button className="icon-btn">👤</button>
            <div className="dropdown-menu">
              {isAuthenticated ? (
                <>
                  <span className="user-name">{user?.username}</span>
                  <Link to="/my-listings">My Listings</Link>
                  <Link to="/account">Account</Link>
                  <button onClick={logout} className="logout-btn">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/register">Register</Link>
                </>
              )}
            </div>
          </div>

          {/* Cart */}
          <Link to="/cart" className="cart-btn">
            🛒
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}
