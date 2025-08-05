import React from 'react';

interface NoResultsMessageProps {
  onClearFilters: () => void;
}

const NoResultsMessage: React.FC<NoResultsMessageProps> = ({ onClearFilters }) => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '40px 30px',
      background: 'var(--primary-yellow)',
      borderRadius: '15px',
      border: '3px solid var(--secondary-black)',
      position: 'relative'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '15px' }}>🔍</div>
      <h3 style={{ color: 'var(--secondary-black)', marginBottom: '15px', fontSize: '1.5rem', fontWeight: 'bold' }}>
        Keine passenden Dienste gefunden
      </h3>
      <p style={{ color: 'var(--text-color)', marginBottom: '20px', fontWeight: '500' }}>
        Bitte versuche es mit anderen Suchkriterien.
      </p>
      <button 
        onClick={onClearFilters}
        className="nav-btn"
        style={{
          padding: '12px 20px',
          fontSize: '16px'
        }}
      >
        Filter zurücksetzen
      </button>
    </div>
  );
};

export default NoResultsMessage;
