import React from 'react';
import html2pdf from 'html2pdf.js';
import type { GroupedTask } from '../types';

interface ExportMenuProps {
  searchTerm: string;
  filteredTasks: GroupedTask[];
}

const ExportMenu: React.FC<ExportMenuProps> = ({ searchTerm, filteredTasks }) => {
  // Handle PDF export
  const handlePDFExport = () => {
    const element = document.querySelector('.content-section');
    if (!element) return;

    const opt = {
      margin: 1,
      filename: `kirmes-dienstplan-${searchTerm || 'alle'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  // Handle WhatsApp sharing
  const handleWhatsAppShare = () => {
    const tasksText = filteredTasks.map(task => 
      `📅 ${task.date} um ${task.time}\n🔧 ${task.task}\n👥 ${task.persons.join(', ') || 'Nicht zugewiesen'}\n`
    ).join('\n');

    const message = `Kirmes Dienstplan ${searchTerm ? `für ${searchTerm}` : ''}\n\n${tasksText}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!searchTerm) {
    return null;
  }

  return (
    <div className="export-menu">
      <div className="export-buttons">
        <span>{filteredTasks.length} Dienste gefunden {searchTerm && `für "${searchTerm}"`}</span>
        
        {/* WhatsApp sharing button */}
        <button 
          onClick={handleWhatsAppShare}
          className="nav-btn"
          title="An WhatsApp senden"
        >
          📱 Per WhatsApp teilen
        </button>
        
        {/* PDF Export button */}
        <button 
          onClick={handlePDFExport}
          className="nav-btn"
          title="Als PDF speichern"
        >
          📄 Als PDF speichern
        </button>
        
        {/* Print button */}
        <button 
          onClick={() => window.print()}
          className="nav-btn"
          title="Dienste drucken"
        >
          🖨️ Drucken
        </button>
      </div>
    </div>
  );
};

export default ExportMenu;
