import React, { useState, useEffect } from 'react';
import Login from './components/login';
import Home from './components/Home';

function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  }

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return <Home handleLogout={handleLogout} />;
}

export default App;
