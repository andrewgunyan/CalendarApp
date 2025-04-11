import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css'; // ← Import your CSS file

function App() {
  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <h1>📅 My Calendar App</h1>
      </header>

      {/* Body */}
      <div className="app-body">
        {/* Sidebar */}
        <aside className="app-sidebar">
          <nav className="app-nav">
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">Events</a></li>
              <li><a href="#">Settings</a></li>
            </ul>
          </nav>
        </aside>

        {/* Main content */}
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
