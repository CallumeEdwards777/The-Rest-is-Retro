import { Link, useNavigate } from 'react-router-dom';

import { useSession } from '../contexts/SessionContext';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  const { user, setUser } = useSession();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser({});
    navigate('/login');
  };

  const getInitials = (username) => {
    if (!username) return '';
    return username.slice(0, 2).toUpperCase();
  };

  return (
    <header className="site-header">
      <Link to="/" className="brand">The Rest Is Retro</Link>

      <nav>
        <Link to="/">Shop</Link>
        {token ? (
          <>
            <span className="avatar" title={user.username}>{getInitials(user.username)}</span>
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
