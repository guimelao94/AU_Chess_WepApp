import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import SongDetailPage from './pages/SongDetailPage';
import AdminPage from './pages/AdminPage';
import OutOfServicePage from './pages/OutOfServicePage';

// Set this to true to enable the out of service page
// Set to false to restore normal operation
const OUT_OF_SERVICE = true;

function App() {
  // If out of service, show only the out of service page
  if (OUT_OF_SERVICE) {
    return (
      <Router>
        <div className="app">
          <Routes>
            <Route path="*" element={<OutOfServicePage />} />
          </Routes>
        </div>
      </Router>
    );
  }

  // Normal operation
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/song/:category/:songName" element={<SongDetailPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

