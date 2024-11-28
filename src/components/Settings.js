import React, { useState, useEffect } from 'react';
import './Settings.css';

const apiOptions = [
  {
    name: 'JSONPlaceholder Users',
    url: 'https://jsonplaceholder.typicode.com/users',
    description: 'Mock user data for testing and prototyping'
  },
  {
    name: 'JSONPlaceholder Posts',
    url: 'https://jsonplaceholder.typicode.com/posts',
    description: 'Mock blog post data'
  },
  {
    name: 'Random User Generator',
    url: 'https://randomuser.me/api/?results=10',
    description: 'Random user data including names, emails, and avatars'
  },
  {
    name: 'Pokemon API',
    url: 'https://pokeapi.co/api/v2/pokemon?limit=10',
    description: 'Information about Pokemon characters'
  },
  {
    name: 'Countries REST',
    url: 'https://restcountries.com/v3.1/all',
    description: 'Detailed information about countries'
  }
];

function Settings({ onSave, currentSettings }) {
  const [selectedApi, setSelectedApi] = useState(apiOptions[0]);
  const [customUrl, setCustomUrl] = useState('');
  const [customHeaders, setCustomHeaders] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  useEffect(() => {
    if (currentSettings) {
      const matchingApi = apiOptions.find(api => api.url === currentSettings.apiUrl);
      if (matchingApi) {
        setSelectedApi(matchingApi);
        setUseCustom(false);
      } else {
        setCustomUrl(currentSettings.apiUrl);
        setUseCustom(true);
      }
      setCustomHeaders(currentSettings.headers || '');
    }
  }, [currentSettings]);

  const handleApiSelect = (e) => {
    const selected = apiOptions.find(api => api.name === e.target.value);
    setSelectedApi(selected);
  };

  const handleSave = () => {
    const settings = {
      apiUrl: useCustom ? customUrl : selectedApi.url,
      headers: customHeaders,
      method: 'GET'
    };
    onSave(settings);
  };

  return (
    <div className="settings-container">
      <h2>API Settings</h2>
      
      <div className="settings-section">
        <h3>Select API</h3>
        <div className="form-group">
          <label>
            <input
              type="radio"
              checked={!useCustom}
              onChange={() => setUseCustom(false)}
            />
            Predefined APIs
          </label>
          
          {!useCustom && (
            <select value={selectedApi.name} onChange={handleApiSelect}>
              {apiOptions.map(api => (
                <option key={api.name} value={api.name}>
                  {api.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="form-group">
          <label>
            <input
              type="radio"
              checked={useCustom}
              onChange={() => setUseCustom(true)}
            />
            Custom API
          </label>
          
          {useCustom && (
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="Enter API URL"
            />
          )}
        </div>
      </div>

      <div className="settings-section">
        <h3>API Description</h3>
        <p className="api-description">
          {useCustom ? 'Custom API endpoint' : selectedApi.description}
        </p>
      </div>

      <div className="settings-section">
        <h3>Custom Headers</h3>
        <textarea
          value={customHeaders}
          onChange={(e) => setCustomHeaders(e.target.value)}
          placeholder="Enter custom headers in JSON format"
          rows="4"
        />
      </div>

      <button className="save-button" onClick={handleSave}>
        Save Settings
      </button>
    </div>
  );
}

export default Settings;
