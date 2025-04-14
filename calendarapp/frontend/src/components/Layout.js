import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Layout.css';

function Layout({ children, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="layout-container">
      {/* Top Banner */}
      <header className="layout-header">
        <h1 className="layout-title">📅 Schedulife</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      {/* Sidebar and Main Content */}
      <div className="layout-body">
        <aside className="layout-sidebar">
          <nav>
            <ul>
              <li><Link to="/">📅 Calendar</Link></li>
              <li><Link to="/events">🎈 Events</Link></li>
              <li><Link to="/goals">🎯 Goals</Link></li>
              <li><Link to="/settings">⚙️ Settings</Link></li>
            </ul>
          </nav>
        </aside>

        <main className="layout-main">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
