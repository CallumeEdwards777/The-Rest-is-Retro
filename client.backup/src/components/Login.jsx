import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

import { useSession } from '../contexts/SessionContext';

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();

  const { setUser } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/users/login', { email: email, password: password });
      const data = response.data;

    
      // Update the user in the context
      setUser({
        username: data.userData.username,
        id: data.userData.id,
      });


      localStorage.setItem('authToken', data.token);
      navigate('/');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
