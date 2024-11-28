import React, { useState } from 'react';
import './App.css';
import UserTable from './components/UserTable';
import Settings from './components/Settings';
import Login from './components/Login';
import Logo from './components/Logo';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState('table');
  const [username, setUsername] = useState('');
  const [apiSettings, setApiSettings] = useState({
    apiUrl: 'https://jsonplaceholder.typicode.com/users',
    headers: '',
    method: 'GET'
  });

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setUsername(user);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setActiveView('table');
  };

  const handleSettingsSave = (newSettings) => {
    setApiSettings(newSettings);
    setActiveView('table');
  };

  return (
    <div className="app">
      {isLoggedIn ? (
        <>
          <nav className="nav-bar">
            <div className="nav-left">
              <Logo size="medium" />
            </div>
            <div className="nav-center">
              <a
                href="#"
                className={`nav-link ${activeView === 'table' ? 'active' : ''}`}
                onClick={() => setActiveView('table')}
              >
                Data Table
              </a>
              <a
                href="#"
                className={`nav-link ${activeView === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveView('settings')}
              >
                API Settings
              </a>
            </div>
            <div className="nav-right">
              <div className="user-menu">
                <div className="user-avatar">
                  <span>{username.charAt(0).toUpperCase()}</span>
                </div>
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </nav>
          <main className="main-content">
            {activeView === 'table' ? (
              <UserTable apiSettings={apiSettings} />
            ) : (
              <Settings onSave={handleSettingsSave} currentSettings={apiSettings} />
            )}
          </main>
        </>
      ) : (
        <div className="login-container">
          <div className="login-header">
            <Logo size="large" />
          </div>
          <Login onLogin={handleLogin} />
        </div>
      )}
    </div>
  );
}

export default App;
