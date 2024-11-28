import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'password') {
      onLogin(username);
    } else {
      setError('Invalid credentials. Use admin/password');
    }
  };

  return (
    <div className="login-form-container">
      <h2 className="login-title">Welcome Back!</h2>
      <p className="login-subtitle">Please sign in to continue</p>
      
      <form onSubmit={handleSubmit} className="login-form">
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>
        
        <button type="submit" className="login-button">
          Sign In
        </button>
        
        <div className="login-help">
          <p>Demo credentials:</p>
          <p>Username: admin</p>
          <p>Password: password</p>
        </div>
      </form>
    </div>
  );
};

export default Login;
