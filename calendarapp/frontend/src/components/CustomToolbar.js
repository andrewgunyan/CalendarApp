import React from 'react';
import { Button } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

const CustomToolbar = (props) => {
  const { label, onNavigate, onView } = props;

  const buttonStyle = {
    backgroundColor: '#c6c6c6', // Updated background color
    color: 'black', // Updated text color
    padding: '4px 8px', // Reduced padding for smaller buttons
    fontSize: '0.75rem',
    lineHeight: '1.5', // Adjust line height to center text vertically
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '0.5rem',
      background: '#f0f0f0'
    }}>
      {/* Left side: View selection buttons */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button variant="contained" size="small" style={buttonStyle} onClick={() => onView('month')}>Month</Button>
        <Button variant="contained" size="small" style={buttonStyle} onClick={() => onView('week')}>Week</Button>
        <Button variant="contained" size="small" style={buttonStyle} onClick={() => onView('day')}>Day</Button>
        <Button variant="contained" size="small" style={buttonStyle} onClick={() => onView('agenda')}>Agenda</Button>
      </div>

      {/* Center label */}
      <div style={{ flexGrow: 1, textAlign: 'center' }}>
        <span>{label}</span>
      </div>

      {/* Right side: Navigation buttons with arrows */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button variant="contained" size="small" style={buttonStyle} onClick={() => onNavigate('TODAY')}>
          Today
        </Button>
        <Button variant="contained" size="small" style={buttonStyle} onClick={() => onNavigate('PREV')}>
          <ArrowBack /> {/* Left arrow */}
        </Button>
        <Button variant="contained" size="small" style={buttonStyle} onClick={() => onNavigate('NEXT')}>
          <ArrowForward /> {/* Right arrow */}
        </Button>
      </div>
    </div>
  );
};

export default CustomToolbar;
