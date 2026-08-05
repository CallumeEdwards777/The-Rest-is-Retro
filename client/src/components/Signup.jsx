import { useState } from 'react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '../contexts/SessionContext';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const { setUser } = useSession();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const displayError = (message) => {
    setError(message);
    setTimeout(() => {
      setError('');
    }, 3000);
  };

  const validatePassword = () => {
    if (password !== password2) {
      displayError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    try {
      const response = await api.post('/api/users', { username: userName, email: email, password: password, password2: password2 });
      const data = response.data;

      // server responds with { token, userData }
      localStorage.setItem('authToken', data.token);

      setUser({
        username: data.userData.username,
        id: data.userData.id,
      });

      navigate('/');
    } catch (err) {
      console.error('Signup failed', err);
      // Sequelize validation errors arrive under `errors`, not `message`
      const data = err.response?.data;
      displayError(
        data?.errors?.[0]?.message ||
          data?.message ||
          'Signup failed — that username or email may already be taken.',
      );
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
          <Link to="/login">Log in</Link>
          <button type="button" className="on">Sign up</button>
        </div>

        <label htmlFor="username">Username</label>
        <input
          id="username"
          placeholder="disco_dan"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="••••••••••"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label htmlFor="password2">Confirm password</label>
        <input
          id="password2"
          type="password"
          placeholder="••••••••••"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          required
        />

        <button className="btn btn-primary" type="submit">Join the archive →</button>

        {error && <div className="form-error">{error}</div>}
      </form>
    </div>
  );
};

export default Signup;
