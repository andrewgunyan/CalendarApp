import React from 'react';

const Home = ({ handleLogout }) => {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📅 My Calendar App</h1>
        <button onClick={handleLogout}>Logout</button>
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
};

export default Home;
