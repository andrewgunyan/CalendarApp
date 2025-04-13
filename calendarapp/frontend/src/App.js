import React, { useState } from 'react';
import Login from './components/Login';

function App() {
  const [token, setToken] = useState(null);

  const handleLogin = (idToken) => {
    setToken(idToken);
    console.log('Firebase token:', idToken);
    // Optionally: store in localStorage or send to backend
  };

  if (!token) return <Login onLogin={handleLogin} />;

  return (
    <div>
      <h1>Welcome to the Calendar App</h1>
      {/* Render app content here */}
    </div>
  );
}

export default App;
