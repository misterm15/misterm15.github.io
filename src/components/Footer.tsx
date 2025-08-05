import React from 'react';

const Footer: React.FC = () => {
  return (
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
  );
};

export default Footer;
