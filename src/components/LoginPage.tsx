import React, { useState } from 'react';
import type { LoginPageProps } from '../types';

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onWrongPassword, error }) => {
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'kirmes2025') {  // Main login password
      onLogin();
    } else {
      onWrongPassword();
      setPassword(''); // Clear password field
    }
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav className="kirmes-nav">
        <div className="nav-content">
          <img src="/Kirmes_in_Kettig_Logo.png" alt="Kirmes Logo" className="kirmes-logo" />
          <h2 className="nav-title">Kirmesgesellschaft Kettig '87 e.V</h2>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">Kirmes Dienstplan</h1>
        <div className="hero-date">2025</div>
        <p className="hero-subtitle">Bartholomäus-Kirmes Kettig</p>
      </div>

      {/* Login Section */}
      <div className="container">
        <div className="login-container">
          <h2 style={{ color: 'var(--secondary-black)', textAlign: 'center', marginBottom: '2rem', fontSize: '1.5rem' }}>
            Zugang zum Dienstplan
          </h2>
          
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Passwort eingeben..."
              className="login-input"
              autoFocus
            />
            
            <button type="submit" className="login-btn">
              Dienstplan anzeigen
            </button>
          </form>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="info-text">
            Bitte gib das Passwort ein, um auf den Dienstplan zuzugreifen.
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h5>Adresse</h5>
            <p>Neugasse 1<br />56220 Kettig</p>
          </div>
          <div className="footer-section">
            <h5>E-mail</h5>
            <p>info@kirmesinkettig.de</p>
          </div>
          <div className="footer-section">
            <h5>Impressum</h5>
            <a href="#impressum">Impressum</a>
          </div>
          <div className="footer-section">
            <h5>Datenschutz</h5>
            <a href="#datenschutz">Datenschutz</a>
          </div>
        </div>
        <div style={{ marginTop: '20px', fontSize: '14px' }}>
          © 2025 Kirmesgesellschaft Kettig '87 e.V
        </div>
      </footer>
    </>
  );
};

export default LoginPage;
