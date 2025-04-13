import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import { auth } from './firebase';
import Login from './components/Login';

function App() {
  const [token, setToken] = useState(null);

  // If no token, show login
  if (!token) {
    return <Login onLogin={(t) => setToken(t)} />;
  }

  // Once logged in, show the main app
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📅 My Calendar App</h1>
      </header>

      <div className="app-body">
        <aside className="app-sidebar">
          <nav className="app-nav">
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">Events</a></li>
              <li><a href="#">Settings</a></li>
            </ul>
          </nav>
        </aside>

        <main className="app-main">
          <h2>Welcome!</h2>
          <p>Your calendar will appear here.</p>
        </main>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
