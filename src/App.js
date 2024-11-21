// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PasswordPage from './PasswordPage.js';
import UserSelection from './UserSelection.js';
import Dashboard from './Dashboard.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/password" />} />
        <Route path="/password" element={<PasswordPage />} />
        <Route path="/select-user" element={<UserSelection />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
