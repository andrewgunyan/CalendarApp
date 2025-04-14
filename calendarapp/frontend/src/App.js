import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Login from './components/login';
import Home from './components/Home';
import Events from './components/Events';
import Layout from './components/Layout';
import Goals from './components/Goals';
import Calendar from './components/Calendar';

function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    if (storedToken) {
      setToken(storedToken);
      setCurrentUserId(storedUserId);
    }
    setLoading(false);
  }, []);

  const handleLogin = (newToken, uid) => {
    setToken(newToken);
    setCurrentUserId(uid);
    localStorage.setItem('token', newToken);
    localStorage.setItem('userId', uid);
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

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout onLogout={handleLogout}>
            <Calendar currentUser={currentUserId} />
          </Layout>
        }
      />
      <Route
        path="/events"
        element={
          token ? (
            <Layout onLogout={handleLogout}>
              <Events currentUser={currentUserId} />
            </Layout>
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/goals"
        element={
          <Layout onLogout={handleLogout}>
            <Goals currentUser={currentUserId} />
          </Layout>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
