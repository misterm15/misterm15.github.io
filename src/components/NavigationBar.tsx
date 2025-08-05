import React from 'react';

const NavigationBar: React.FC = () => {
  return (
    <nav className="kirmes-nav">
      <div className="nav-content">
        <img src="/Kirmes_in_Kettig_Logo.png" alt="Kirmes Logo" className="kirmes-logo" />
        <h2 className="nav-title">Kirmesgesellschaft Kettig '87 e.V - Dienstplan 2025</h2>
      </div>
    </nav>
  );
};

export default NavigationBar;
