import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem('worshipJamAdmin');
      setIsAuthenticated(authStatus === 'authenticated');
    };
    
    checkAuth();
    // Check auth status periodically in case it changes
    const interval = setInterval(checkAuth, 500);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('worshipJamAdmin');
    setIsAuthenticated(false);
    // Use window.location for a full page refresh to clear all auth state
    window.location.href = '/';
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        {isAuthenticated ? (
          <button onClick={handleLogout} className="footer-logout-button">
            Logout
          </button>
        ) : (
          <Link to="/admin" className="footer-admin-link">Admin</Link>
        )}
      </div>
    </footer>
  );
}

export default Footer;

