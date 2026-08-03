import React from 'react';
import { Link } from 'react-router-dom';

import { useSession } from '../contexts/SessionContext';
import { useTheme } from '../contexts/ThemeContext';

import headerImg from '../assets/header.png';

const Header = () => {
  //const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  const { user } = useSession();
  //const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    //navigate('/login');
  };

  const wordCase = (word) => {
    if (word === undefined) {
      return '';
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  // getInitials was being called but never existed — added it here so the avatar doesn't crash on login
  const getInitials = (username) => {
    if (!username) return '';
    return username.slice(0, 2).toUpperCase();
  };

  return (
    <header className="site-header">
      <img src={headerImg} alt="The Rest Is Retro" />

      <nav>
        <Link to="/">Shop</Link>
        {token ? (
          <>
            <span className="avatar" title={user.username}>{getInitials(user.username)}</span>
            <Link to="/profile">{wordCase(user.username)}'s Saved Items</Link>
            <Link to="/create-item">List an Item</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </nav>

      
    </header>
  );
};

export default Header;