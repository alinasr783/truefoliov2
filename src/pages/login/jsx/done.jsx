import React from 'react';
import '../css/done.css';

const SimpleConfirmation = () => {
  return (
    <div className="simple-confirmation">
      <div className="confirmation-card">
        <div className="brand-header">
          <div className="logo">TrueFolio</div>
        </div>

        <div className="confirmation-content">
          <div className="status-indicator"></div>
          <h1>Account Confirmed</h1>
          <p className="confirmation-message">
            Your email has been successfully verified and your account is now active.
          </p>
        </div>

        <div className="confirmation-footer">
          <p>Welcome to TrueFolio</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleConfirmation;