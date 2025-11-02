import React from 'react';
import './OutOfServicePage.css';

function OutOfServicePage() {
  return (
    <div className="out-of-service">
      <div className="out-of-service-container">
        <h1 className="out-of-service-title">Out of Service</h1>
        <p className="out-of-service-message">
          The Song Library is temporarily unavailable.
        </p>
        <p className="out-of-service-submessage">
          We'll be back for the next event!
        </p>
      </div>
    </div>
  );
}

export default OutOfServicePage;

