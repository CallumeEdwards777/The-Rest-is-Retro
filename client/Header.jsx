import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useSession } from '../contexts/SessionContext';
import { useTheme } from '../contexts/ThemeContext';

import headerImg from '../assets/header.png';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  const { user } = useSession();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const wordCase = (word) => {
    if (word === undefined) {
      return '';
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  return (
    <header className="site-header">
      <img src={headerImg} alt="LMS3000" />

      <nav>
        <Link to="/">All Courses</Link>
        {token ? (
          <>
            <span className="avatar" title={user.username}>{getInitials(user.username)}</span>
            <Link to="/profile">{wordCase(user.username)}'s Courses</Link>
            <Link to="/create-course">Create Course</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </nav>

      <button
        className="theme-toggle" onClick={toggleTheme}
        aria-label="Toggle dark mode">
       {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
</button>
    </header>
  );
};

export default Header;