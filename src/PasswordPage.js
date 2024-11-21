// PasswordPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PasswordPage() {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'noted2425') {
      navigate('/select-user');
    } else {
      alert('Incorrect password. Please try again.');
    }
  };

  return (
    <div>
      <h2>Enter Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default PasswordPage;
