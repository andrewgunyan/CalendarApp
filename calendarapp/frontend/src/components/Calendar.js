import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CustomToolbar from './CustomToolbar';
import './Calendar.css';

const localizer = momentLocalizer(moment);

function CalendarComponent({ currentUser }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    start: new Date(),
    end: new Date(),
  });

  // Fetch events and goals from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch events
        const eventResponse = await fetch(`http://localhost:8000/events?creator_id=${currentUser}`);
        if (!eventResponse.ok) throw new Error('Failed to fetch events');
        const eventData = await eventResponse.json();
        const eventList = eventData.map(event => ({
          id: event.eventId,
          title: event.title,
          start: new Date(event.startDate),
          end: new Date(event.endDate),
          type: 'event'
        }));

        // Fetch goals
        const goalResponse = await fetch(`http://localhost:8000/goals?user_id=${currentUser}`);
        if (!goalResponse.ok) throw new Error('Failed to fetch goals');
        const goalData = await goalResponse.json();
        const goalList = goalData.map(goal => ({
          id: goal.goalId,
          title: goal.title,
          start: new Date(goal.endDate),
          end: new Date(goal.endDate),
          type: 'goal'
        }));

        // Combine events and goals
        setEvents([...eventList, ...goalList]);
      } catch (error) {
        console.error('Error fetching events and goals:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [currentUser]);

  // Show event form when clicking on a slot
  const handleSelectSlot = ({ start, end }) => {
    setNewEvent({ ...newEvent, start, end });
    setShowEventForm(true);
  };

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Save the new event to the database
    try {
      const response = await fetch('http://localhost:8000/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newEvent,
          creatorId: currentUser, // Pass the current user ID
        }),
      });

      if (!response.ok) throw new Error('Failed to create event');
      const newEventData = await response.json();
      setEvents([...events, newEventData]);
      setShowEventForm(false);
      setNewEvent({ title: '', description: '', start: new Date(), end: new Date() }); // Reset form
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ height: '90vh' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '90%' }}
        eventPropGetter={(event) => {
          let style = {};
          if (event.type === 'goal') {
            style.backgroundColor = '#0000FF';
          } else {
            style.backgroundColor = '#008000';
          }
          return { style };
        }}
        toolbar={(props) => <CustomToolbar {...props} />}
        selectable
        onSelectSlot={handleSelectSlot} // Add this line to handle slot selection
      />

      {showEventForm && (
        <div className="event-form">
          <h3>Add New Event</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={newEvent.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Description</label>
              <textarea
                name="description"
                value={newEvent.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Start Time</label>
              <input
                type="datetime-local"
                name="start"
                value={newEvent.start.toISOString().slice(0, -1)} // Format date for input
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>End Time</label>
              <input
                type="datetime-local"
                name="end"
                value={newEvent.end.toISOString().slice(0, -1)} // Format date for input
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit">Save Event</button>
            <button type="button" onClick={() => setShowEventForm(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default CalendarComponent;
