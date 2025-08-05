import React, { useState, useMemo } from 'react';
import html2pdf from 'html2pdf.js';
import type { TaskViewerProps } from '../types';
import { groupTasksByOriginal, sortDaysByKirmesOrder, filterTasks } from '../utils/taskUtils';
import TypeaheadDropdown, { type TypeaheadOption } from './TypeaheadDropdown';

const TaskViewer: React.FC<TaskViewerProps> = ({ tasks }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [nameInputValue, setNameInputValue] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [taskSearchTerm, setTaskSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // Get unique days and tasks for filters
  const uniqueDays = [...new Set(tasks.map(task => task.date))].filter(Boolean);
  const uniqueTasks = [...new Set(tasks.map(task => task.task))].filter(Boolean).sort();

  // Get unique names for typeahead
  const uniqueNames = useMemo(() => {
    const allNames = new Set<string>();
    tasks.forEach(task => {
      if (task.name && task.name.trim()) {
        allNames.add(task.name.trim());
      }
    });
    return Array.from(allNames).sort().map(name => ({
      value: name,
      label: name
    }));
  }, [tasks]);

  // Get unique tasks for typeahead
  const taskOptions = useMemo(() => {
    return uniqueTasks.map(task => ({
      value: task,
      label: task
    }));
  }, [uniqueTasks]);

  // Sort days in Kirmes order
  const sortedDays = sortDaysByKirmesOrder(uniqueDays);

  // Group tasks by their original order (chronological)
  const groupedTasks = groupTasksByOriginal(tasks);

  // Filter tasks based on all criteria
  const filteredTasks = filterTasks(groupedTasks, searchTerm, selectedDay, selectedTask, taskSearchTerm);

  // Handle task selection from typeahead
  const handleTaskSelection = (selectedOption: TypeaheadOption | null) => {
    if (selectedOption) {
      setTaskSearchTerm(selectedOption.value);
      setSelectedTask(selectedOption.value);
    } else {
      setTaskSearchTerm('');
      setSelectedTask('');
    }
  };

  // Handle task input change from typeahead
  const handleTaskInputChange = (inputValue: string) => {
    setTaskSearchTerm(inputValue);
    // Only clear the selected task if input is completely empty
    if (inputValue.trim() === '') {
      setSelectedTask('');
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setNameInputValue('');
    setSelectedDay('');
    setTaskSearchTerm('');
    setSelectedTask('');
  };

  // Handle name selection from typeahead
  const handleNameSelection = (selectedOption: TypeaheadOption | null) => {
    if (selectedOption) {
      setSearchTerm(selectedOption.value);
      setNameInputValue(selectedOption.value);
    } else {
      setSearchTerm('');
      setNameInputValue('');
    }
  };

  // Handle name input change from typeahead (only update input, don't filter)
  const handleNameInputChange = (inputValue: string) => {
    setNameInputValue(inputValue);
    // Only clear the search term if input is completely empty
    if (inputValue.trim() === '') {
      setSearchTerm('');
    }
  };

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

  return (
    <div className="main-layout">
      {/* Navigation Bar */}
      <nav className="kirmes-nav">
        <div className="nav-content">
          <img src="/Kirmes_in_Kettig_Logo.png" alt="Kirmes Logo" className="kirmes-logo" />
          <h2 className="nav-title">Kirmesgesellschaft Kettig '87 e.V - Dienstplan 2025</h2>
        </div>
      </nav>

      {/* Smart Header with Filters */}
      <div 
        style={{
          top: '80px',
          left: 0,
          width: '100%',
          background: 'var(--secondary-black)',
        }}>
        <div className="filter-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h1 style={{ color: 'var(--secondary-black)', margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>
              Bartholomäus-Kirmes Dienstplan
            </h1>
            
            {/* Toggle Button for Instructions */}
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="nav-btn"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={isExpanded ? "Anleitung ausblenden" : "Anleitung einblenden"}
            >
              {isExpanded ? '−' : '+'}
            </button>
          </div>
          
          {/* Collapsible Instructions Box */}
          {isExpanded && (
            <div style={{ 
              background: 'var(--primary-yellow)',
              border: '2px solid var(--secondary-black)',
              padding: '15px',
              borderRadius: '10px',
              marginBottom: '15px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: 'var(--secondary-black)', fontWeight: 'bold' }}>
                <p>🔍 <strong>Suche:</strong> Gib einen Namen ein, um alle Dienste einer Person zu finden</p>
                <p>📅 <strong>Filter:</strong> Wähle einen Tag oder eine Dienste aus den Dropdown-Menüs</p>
                <p>📄 <strong>Export:</strong> Teile Ergebnisse per WhatsApp oder speichere als PDF</p>
              </div>
            </div>
          )}
          
          {/* Primary Name Search */}
          <div className="primary-search" style={{ position: 'relative', marginBottom: '15px' }}>
            <TypeaheadDropdown
              options={uniqueNames}
              value={nameInputValue}
              placeholder="Nach Namen suchen..."
              onChange={handleNameSelection}
              onInputChange={handleNameInputChange}
              allowCustomValue={true}
              clearable={true}
              className=""
            />
          </div>
          
          {/* Secondary Filters */}
          <div className="secondary-filters" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {/* Day Filter */}
            <select 
              className="filter-select"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
            >
              <option value="">Alle Tage</option>
              {sortedDays.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            
            {/* Task Search with TypeaheadDropdown */}
            <div style={{ flex: 2, minWidth: '200px' }}>
              <TypeaheadDropdown
                options={taskOptions}
                value={taskSearchTerm}
                placeholder="Dienste suchen..."
                onChange={handleTaskSelection}
                onInputChange={handleTaskInputChange}
                allowCustomValue={true}
                clearable={true}
                className=""
              />
            </div>
            
            {/* Clear Filters */}
            <button 
              onClick={clearAllFilters}
              className="nav-btn"
              disabled={!(searchTerm || nameInputValue || selectedDay || selectedTask || taskSearchTerm)}
            >
              {searchTerm ? '👥 Alle anzeigen' : '🔄 Reset'}
            </button>
          </div>
        </div>
        
        {/* Results Info - Only show when searching for a person */}
        {searchTerm && (
          <div className="export-menu">
            <div className="export-buttons">
              <span>{filteredTasks.length} Aufgaben gefunden {searchTerm && `für "${searchTerm}"`}</span>
              
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
                title="Aufgaben drucken"
              >
                🖨️ Drucken
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Scrollable Content */}
      <div className="content-section" style={{ paddingTop: '200px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {filteredTasks.map((task, index) => (
            <div key={index} className="task-card">
              <div style={{
                borderBottom: '2px solid var(--secondary-black)',
                paddingBottom: '10px',
                marginBottom: '10px'
              }}>
                <div className="task-header" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '15px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      color: 'var(--secondary-black)', 
                      fontSize: '1.3rem',
                      margin: '0 0 8px 0',
                      fontWeight: 'bold'
                    }}>
                      {task.task}
                    </h3>
                    <p style={{ 
                      color: 'var(--text-color)', 
                      fontSize: '1rem',
                      margin: 0,
                      fontWeight: '500'
                    }}>
                    </p>
                  </div>
                  
                  <div className="task-date-time">
                    <div style={{ 
                      color: 'var(--secondary-black)', 
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      marginBottom: '4px'
                    }}>
                      {task.date}
                    </div>
                    <div style={{ 
                      color: 'var(--text-color)', 
                      fontSize: '1rem',
                      fontWeight: '500'
                    }}>
                      🕐 {task.time}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 style={{ 
                  color: 'var(--secondary-black)', 
                  fontSize: '1.1rem',
                  marginBottom: '12px',
                  fontWeight: 'bold'
                }}>
                  👥 Zugewiesene Personen ({task.persons.length}):
                </h4>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  {task.persons.length > 0 ? (
                    task.persons.map((person, personIndex) => (
                      <span
                        key={personIndex}
                        style={{
                          background: 'var(--secondary-black)',
                          color: 'var(--primary-yellow)',
                          border: '2px solid var(--secondary-black)',
                          borderRadius: '20px',
                          padding: '6px 15px',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}
                      >
                        {person}
                      </span>
                    ))
                  ) : (
                    <span style={{
                      background: 'var(--red)',
                      color: 'var(--white)',
                      border: '2px solid var(--red)',
                      borderRadius: '20px',
                      padding: '6px 15px',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      ⚠️ Nicht zugewiesen
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Show message when no tasks match the filters */}
          {filteredTasks.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '40px 30px',
              background: 'var(--primary-yellow)',
              borderRadius: '15px',
              border: '3px solid var(--secondary-black)',
              position: 'relative'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>🔍</div>
              <h3 style={{ color: 'var(--secondary-black)', marginBottom: '15px', fontSize: '1.5rem', fontWeight: 'bold' }}>Keine passenden Dienste gefunden</h3>
              <p style={{ color: 'var(--text-color)', marginBottom: '20px', fontWeight: '500' }}>Bitte versuche es mit anderen Suchkriterien.</p>
              <button 
                onClick={clearAllFilters}
                className="nav-btn"
                style={{
                  padding: '12px 20px',
                  fontSize: '16px'
                }}
              >
                Filter zurücksetzen
              </button>
            </div>
          )}
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
      </div>
    </div>
  );
};

export default TaskViewer;
