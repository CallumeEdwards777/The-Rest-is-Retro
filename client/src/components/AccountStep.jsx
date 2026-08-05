import { useState } from 'react';
import api from '../api';

import { useSession } from '../contexts/SessionContext';

// Final panel of the welcome quiz: turn the answers into an account.
// onDone() runs after a successful signup/login and stores the picks.
const AccountStep = ({ onDone }) => {
  const { setUser } = useSession();

  const [mode, setMode] = useState('signup');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const isSignup = mode === 'signup';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);

    try {
      const response = isSignup
        ? await api.post('/api/users', { username, email, password })
        : await api.post('/api/users/login', { email: username, password });

      const data = response.data;
      localStorage.setItem('authToken', data.token);
      setUser({ username: data.userData.username, id: data.userData.id });
      onDone();
    } catch (err) {
      console.error(`${mode} failed`, err);
      setError(
        isSignup
          ? 'That username or email is already taken.'
          : err.response?.data?.message || 'Check your details and try again.',
      );
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Awesome!</h1>
      <p className="q-lead">Create an account to save your preferences.</p>

      <div className="tabs">
        <button type="button" className={isSignup ? 'on' : ''} onClick={() => setMode('signup')}>
          Sign up
        </button>
        <button type="button" className={isSignup ? '' : 'on'} onClick={() => setMode('login')}>
          Log in
        </button>
      </div>

      <label htmlFor="acc-username">{isSignup ? 'Username' : 'Username or email'}</label>
      <input
        id="acc-username"
        placeholder={isSignup ? 'disco_dan' : 'vintage_vera'}
        autoComplete="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      {isSignup && (
        <>
          <label htmlFor="acc-email">Email</label>
          <input
            id="acc-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </>
      )}

      <label htmlFor="acc-password">Password</label>
      <input
        id="acc-password"
        type="password"
        placeholder="••••••••••"
        autoComplete={isSignup ? 'new-password' : 'current-password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button className="btn btn-primary" type="submit" disabled={busy}>
        {isSignup ? 'Save my preferences →' : 'Log in and save →'}
      </button>

      {error && <div className="form-error">{error}</div>}
    </form>
  );
};

export default AccountStep;
