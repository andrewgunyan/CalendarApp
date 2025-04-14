import React, { useEffect, useState } from 'react';
import './Goals.css';

function Goals({ currentUser }) {
  const [goals, setGoals] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    userId: currentUser || null
  });
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [editedGoal, setEditedGoal] = useState({});

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch(`http://localhost:8000/goals?user_id=${currentUser}`);
        if (!response.ok) throw new Error('Failed to fetch goals');
        const data = await response.json();
        setGoals(data);
      } catch (error) {
        console.error('Error fetching goals:', error);
      }
    };

    if (currentUser) fetchGoals();
  }, [currentUser]);

  const handleInputChange = (e, stateUpdater) => {
    const { name, value } = e.target;
    stateUpdater(prev => ({ ...prev, [name]: value }));
  };

  const handleAddGoal = async () => {
    try {
      const response = await fetch('http://localhost:8000/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGoal)
      });
      if (!response.ok) throw new Error('Failed to add goal');
      const createdGoal = await response.json();
      setGoals(prev => [...prev, createdGoal]);
      setNewGoal({ title: '', description: '', startDate: '', endDate: '', userId: currentUser });
      // console.log(newGoal);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const handleEdit = (goal) => {
    setEditingGoalId(goal.id);
    setEditedGoal(goal);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:8000/goals/${editedGoal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedGoal)
      });
      if (!response.ok) throw new Error('Failed to update goal');
      const updatedGoal = await response.json();
      setGoals(prev => prev.map(goal => goal.id === updatedGoal.id ? updatedGoal : goal));
      setEditingGoalId(null);
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/goals/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete goal');
      setGoals(prev => prev.filter(goal => goal.id !== id));
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const filteredGoals = goals.filter(goal =>
    goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    goal.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="goals-container">
      <h2 className="goals-header">Your Goals</h2>
      <div className="goals-controls">
        <input
          type="text"
          className="search-input"
          placeholder="Search goals..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <button className="toggle-add-form-btn" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add Goal'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-goal-form">
          <input name="title" value={newGoal.title} onChange={(e) => handleInputChange(e, setNewGoal)} placeholder="Title" />
          <input name="description" value={newGoal.description} onChange={(e) => handleInputChange(e, setNewGoal)} placeholder="Description" />
          <input name="startDate" type="date" value={newGoal.startDate} onChange={(e) => handleInputChange(e, setNewGoal)} />
          <input name="endDate" type="date" value={newGoal.endDate} onChange={(e) => handleInputChange(e, setNewGoal)} />
          <button onClick={handleAddGoal}>Submit</button>
        </div>
      )}

      <ul className="goals-list">
        {filteredGoals.map(goal => (
          <li className="goal-item" key={goal.goalId || goal.id}>
            {editingGoalId === goal.id ? (
              <div className="edit-goal-form">
                <input name="title" value={editedGoal.title} onChange={(e) => handleInputChange(e, setEditedGoal)} />
                <input name="description" value={editedGoal.description} onChange={(e) => handleInputChange(e, setEditedGoal)} />
                <input name="startDate" type="date" value={editedGoal.startDate} onChange={(e) => handleInputChange(e, setEditedGoal)} />
                <input name="endDate" type="date" value={editedGoal.endDate} onChange={(e) => handleInputChange(e, setEditedGoal)} />
                <button onClick={handleSaveEdit}>Save</button>
                <button onClick={() => setEditingGoalId(null)}>Cancel</button>
              </div>
            ) : (
              <div className="goal-view">
                <h4>{goal.title}</h4>
                <p>{goal.description}</p>
                <p>{goal.startDate} → {goal.endDate}</p>
                <button onClick={() => handleEdit(goal)}>Edit</button>
                <button onClick={() => handleDelete(goal.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Goals;