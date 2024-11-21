// UserSelection.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserSelection() {
  const [selectedUser, setSelectedUser] = useState('');
  const navigate = useNavigate();

  const handleSelect = () => {
    if (selectedUser) {
      navigate('/dashboard', { state: { user: selectedUser } });  // Pass selectedUser as state
    } else {
      alert('Please select a user.');
    }
  };

  return (
    <div>
      <h2>Select a User</h2>
      <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
        <option value="">--Select a User--</option>
        <option value="Shaymal">Shaymal</option>
        <option value="Vaishnavi">Vaishnavi</option>
        <option value="Shantanu">Shantanu</option>
        <option value="Abhishek">Abhishek</option>
      </select>
      <button onClick={handleSelect}>Go to Dashboard</button>
    </div>
  );
}

export default UserSelection;
