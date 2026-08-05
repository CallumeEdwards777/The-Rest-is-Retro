import { useState } from 'react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';

import { useSession } from '../contexts/SessionContext';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { setUser } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/api/users/login', { email: login, password: password });
      const data = response.data;

      // server responds with { token, userData }
      localStorage.setItem('authToken', data.token);

      setUser({
        username: data.userData.username,
        id: data.userData.id,
      });

      navigate('/');
    } catch (err) {
      console.error('Login failed', err);
      setError(err.response?.data?.message || 'Login failed — check your details and try again.');
    }
  };

  return (
    <div className="auth-page">
      <form className="auth" onSubmit={handleSubmit}>
        <Link className="logo" to="/">
          The <span className="rest">Rest</span> is <span className="retro">Retro</span>
        </Link>
        <div className="tagline">Where every era lives again.</div>

        <div className="tabs">
          <button type="button" className="on">Log in</button>
          <Link to="/signup">Sign up</Link>
        </div>

        <label htmlFor="login">Username or email</label>
        <input
          id="login"
          placeholder="vintage_vera"
          autoComplete="username"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="••••••••••"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="btn btn-primary" type="submit">Step into your era →</button>

        {error && <div className="form-error">{error}</div>}

        <div className="hint">Demo login: <code>vintage_vera</code> / <code>password123</code></div>
      </form>
    </div>
  );
};

export default Login;
