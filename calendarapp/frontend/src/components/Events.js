import React, { useState } from 'react';

const eventsData = [
  { id: 1, title: 'Meeting with Bob', description: 'Discuss project progress', date: '2025-04-15' },
  { id: 2, title: 'Dentist Appointment', description: 'Routine check-up', date: '2025-04-16' },
  { id: 3, title: 'Team Workshop', description: 'Learn new technologies', date: '2025-04-17' },
];

function Events() {
  const [events, setEvents] = useState(eventsData);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddEvent = () => {
    const event = { ...newEvent, id: events.length + 1 };
    setEvents([...events, event]);
    setNewEvent({ title: '', description: '', date: '' });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="events-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Event Management</h2>
        <div className="sidebar-actions">
          <button onClick={() => alert('Add Event functionality')}>
            Add Event
          </button>
          <input
            type="text"
            placeholder="Search events"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="events-main">
        <h1>All Events</h1>
        <div className="events-list">
          {filteredEvents.length === 0 ? (
            <p>No events found</p>
          ) : (
            filteredEvents.map((event) => (
              <div key={event.id} className="event-card">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <p><strong>Date:</strong> {event.date}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Events;
