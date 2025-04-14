import React, { useState, useEffect } from 'react';
import './Events.css';

function Events({ currentUser }) {
  const [events, setEvents] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocation, setShowLocation] = useState(false);
  const [invitees, setInvitees] = useState(['']);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    eventType: 'meeting',
    locationLatitude: null,
    locationLongitude: null,
    creatorId: currentUser || null
  });

  const formatDate = (datetimeString) => {
    const date = new Date(datetimeString);
    return date.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };  

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`http://localhost:8000/events?user_id=${currentUser}`);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
  
        const confirmed = data.filter(event => {
          const userAttendance = event.attendees.find(
            attendee => attendee.userId === currentUser
          );
          return userAttendance?.status === "confirmed";
        });
  
        const pending = data.filter(event => {
          const userAttendance = event.attendees.find(
            attendee => attendee.userId === currentUser
          );
          return userAttendance?.status === "pending";
        });
  
        setEvents(confirmed);
        setPendingEvents(pending);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
  
    if (currentUser) {
      fetchEvents();
    }
  }, [currentUser]);
  

  const handleStatusChange = async (eventId, status) => {
    try {
      const response = await fetch(`http://localhost:8000/events/${eventId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser,
          status: status,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || JSON.stringify(errorData));
      }
  
      // Update pending and confirmed events
      const updatedEvent = pendingEvents.find(event => event.eventId === eventId);
  
      // Remove from pending
      setPendingEvents(prev => prev.filter(event => event.eventId !== eventId));
  
      // If user confirmed, add to confirmed list
      if (status === 'confirmed' && updatedEvent) {
        const updatedAttendees = updatedEvent.attendees.map(att => 
          att.userId === currentUser ? { ...att, status: 'confirmed' } : att
        );
        const newConfirmedEvent = { ...updatedEvent, attendees: updatedAttendees };
  
        setEvents(prev => [...prev, newConfirmedEvent]);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  const toggleLocation = () => {
    if (showLocation) {
      setNewEvent(prev => ({
        ...prev,
        locationLatitude: null,
        locationLongitude: null
      }));
    }
    setShowLocation(!showLocation);
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();

    const startDate = new Date(newEvent.startDate);
    const endDate = new Date(newEvent.endDate);

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };
  
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    const event = {
      title: newEvent.title,
      description: newEvent.description,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      eventType: newEvent.eventType,
      locationLatitude: newEvent.locationLatitude ? parseFloat(newEvent.locationLatitude) : null,
      locationLongitude: newEvent.locationLongitude ? parseFloat(newEvent.locationLongitude) : null,
      creatorId: currentUser,
      invitees: invitees.filter(email => email.trim() !== '')
    };

    try {
      const response = await fetch('http://localhost:8000/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || JSON.stringify(errorData));
      }

      const data = await response.json();
      setEvents((prevEvents) => [...prevEvents, data]);
      setNewEvent({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        eventType: 'meeting',
        locationLatitude: null,
        locationLongitude: null
      });
      setShowLocation(false);
      setShowAddForm(false);
    } catch (error) {
      console.error('Full error:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInviteeChange = (index, value) => {
    const updated = [...invitees];
    updated[index] = value;
    setInvitees(updated);
  };
  
  const addInvitee = () => {
    setInvitees([...invitees, '']);
  };
  
  const removeInvitee = (index) => {
    const updated = invitees.filter((_, i) => i !== index);
    setInvitees(updated);
  };
  

  return (
    <div className="events-container">
      <div className="sidebar">
        <h2>Event Management</h2>
        <div className="sidebar-actions">
          <button className="add-event-btn" onClick={toggleAddForm}>
            {showAddForm ? 'Close Form' : 'Add Event'}
          </button>
          <input
            type="text"
            placeholder="Search events"
            className="search-input"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="events-main">
        <h1>Confirmed Events</h1>
        {showAddForm && (
          <div className="event-form">
            <h3>Create New Event</h3>
            <form onSubmit={handleAddEvent}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  className="form-input"
                  value={newEvent.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  className="form-input"
                  value={newEvent.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="date-inputs-container">
                <div className="date-input-group">
                  <label>Start Date *</label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={newEvent.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="date-input-group">
                  <label>End Date *</label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={newEvent.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Event Type *</label>
                <select
                  name="eventType"
                  className="form-input"
                  value={newEvent.eventType}
                  onChange={handleInputChange}
                >
                  <option value="meeting">Meeting</option>
                  <option value="appointment">Appointment</option>
                  <option value="workshop">Workshop</option>
                  <option value="social">Social</option>
                </select>
              </div>

              <div className="form-group">
                <label>Invite Users (by email)</label>
                {invitees.map((email, index) => (
                  <div key={index} className="invitee-input">
                    <input
                      type="email"
                      placeholder="user@example.com"
                      value={email}
                      onChange={(e) => handleInviteeChange(index, e.target.value)}
                      className="form-input"
                    />
                    <button
                      type="button"
                      onClick={() => removeInvitee(index)}
                      className="remove-invitee-btn"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addInvitee}
                  className="add-invitee-btn"
                >
                  Add User
                </button>
              </div>


              <div className="form-group">
                <button type="button" onClick={toggleLocation} className="location-toggle">
                  {showLocation ? 'Remove Location' : 'Add Location'}
                </button>
              </div>

              {showLocation && (
                <>
                  <div className="form-group">
                    <label>Location Latitude</label>
                    <input
                      type="number"
                      name="locationLatitude"
                      className="form-input"
                      value={newEvent.locationLatitude || ''}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Location Longitude</label>
                    <input
                      type="number"
                      name="locationLongitude"
                      className="form-input"
                      value={newEvent.locationLongitude || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}

              <div className="button-group">
                <button type="submit" className="submit-button">
                  Create Event
                </button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={toggleAddForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="events-list">
          {filteredEvents.length === 0 ? (
            <p>No events found</p>
          ) : (
            filteredEvents.map((event) => (
              <div key={event.eventId || event.id || `${event.title}-${event.startDate}`} className="event-card">
                <h3 className="event-title">{event.title}</h3>
                {event.description && <p>{event.description}</p>}
                <p><strong>Start:</strong> {formatDate(event.startDate)}</p>
                <p><strong>End:</strong> {formatDate(event.endDate)}</p>
                {event.location && <p><strong>Location:</strong> {event.location}</p>}
                <p><strong>Type:</strong> {event.eventType}</p>
              </div>
            ))
          )}
        </div>

        <h1>Pending Events</h1>
        <div className="events-list">
          {pendingEvents.length === 0 ? (
            <p>No pending events</p>
          ) : (
            pendingEvents.map((event) => (
            <div key={event.eventId || event.id || `${event.title}-${event.startDate}`} className="event-card">
              <h3 className="event-title">{event.title}</h3>
              {event.description && <p>{event.description}</p>}
              <p><strong>Start:</strong> {formatDate(event.startDate)}</p>
              <p><strong>End:</strong> {formatDate(event.endDate)}</p>
              <div className="button-group">
                <button onClick={() => handleStatusChange(event.eventId, "confirmed")}>Going</button>
                <button onClick={() => handleStatusChange(event.eventId, "not going")}>Not Going</button>
              </div>
            </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Events;
