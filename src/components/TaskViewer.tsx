import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import type { TaskViewerProps } from '../types';
import { groupTasksByOriginal, sortDaysByKirmesOrder, filterTasks } from '../utils/taskUtils';

const TaskViewer: React.FC<TaskViewerProps> = ({ tasks }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [taskSearchTerm, setTaskSearchTerm] = useState('');
  const [showTaskDropdown, setShowTaskDropdown] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [manuallyHidden] = useState(false);

  // Get unique days and tasks for filters
  const uniqueDays = [...new Set(tasks.map(task => task.date))].filter(Boolean);
  const uniqueTasks = [...new Set(tasks.map(task => task.task))].filter(Boolean).sort();

  // Sort days in Kirmes order
  const sortedDays = sortDaysByKirmesOrder(uniqueDays);

  // Filter tasks for dropdown based on search term
  const filteredDropdownTasks = uniqueTasks.filter(task => 
    task.toLowerCase().includes(taskSearchTerm.toLowerCase())
  );

  // Group tasks by their original order (chronological)
  const groupedTasks = groupTasksByOriginal(tasks);

  // Filter tasks based on all criteria
  const filteredTasks = filterTasks(groupedTasks, searchTerm, selectedDay, selectedTask, taskSearchTerm);

  // Handle task input changes
  const handleTaskInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTaskSearchTerm(value);
    setSelectedTask(''); // Clear selection when typing
    setShowTaskDropdown(value.length > 0); // Show dropdown when typing
  };

  const handleTaskSelect = (task: string) => {
    setTaskSearchTerm(task);
    setSelectedTask(task);
    setShowTaskDropdown(false);
  };

  const clearTaskSearch = () => {
    setTaskSearchTerm('');
    setSelectedTask('');
    setShowTaskDropdown(false);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedDay('');
    clearTaskSearch();
  };

  // Smart header scroll handling
  useEffect(() => {
    let touchStartY = 0;
    let touchMoveTimer: NodeJS.Timeout | null = null;
    let scrollTimer: number | null = null;
    let lastScrollPos = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchMoveTimer) clearTimeout(touchMoveTimer);
      
      const touchY = e.touches[0].clientY;
      const diff = touchStartY - touchY;
      
      touchMoveTimer = setTimeout(() => {
        if (diff < -15) {
          // Going up - show header
          if (manuallyHidden) return;
          setHeaderVisible(true);
        } else if (diff > 10) {
          // Going down - hide header
          if (!manuallyHidden) {
            setHeaderVisible(false);
          }
        }
        
        touchStartY = touchY;
      }, 10);
    };

    const handleScroll = () => {
      if (scrollTimer) return;
      
      const currentPos = window.scrollY;
      const isScrollingDown = currentPos > lastScrollPos;
      lastScrollPos = currentPos;

      if (isScrollingDown && currentPos > 30 && !manuallyHidden) {
        const header = document.querySelector('.header-section') as HTMLElement;
        if (header) {
          header.style.transform = 'translateY(-100%)';
          header.style.opacity = '0';
        }
      }

      scrollTimer = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const scrollDelta = Math.abs(currentScrollY - lastScrollY);
        
        if (currentScrollY <= 20) {
          if (!manuallyHidden) {
            setHeaderVisible(true);
          }
        } else if (currentScrollY < lastScrollY && scrollDelta > 20) {
          // Do nothing - keep header hidden when scrolling up
        } else if (currentScrollY > lastScrollY) {
          if (!manuallyHidden) {
            setHeaderVisible(false);
          }
        }
        
        setLastScrollY(currentScrollY);
        scrollTimer = null;
      });
    };

    const updateScrollButtonVisibility = () => {
      const scrollButton = document.getElementById('scrollTopButton') as HTMLElement;
      if (scrollButton) {
        if (window.scrollY > 200) {
          scrollButton.style.opacity = '1';
          scrollButton.style.pointerEvents = 'auto';
          scrollButton.style.transform = 'scale(1)';
        } else {
          scrollButton.style.opacity = '0';
          scrollButton.style.pointerEvents = 'none';
          scrollButton.style.transform = 'scale(0.95)';
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('scroll', updateScrollButtonVisibility, { passive: true });

    setTimeout(updateScrollButtonVisibility, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('scroll', updateScrollButtonVisibility);
      
      if (touchMoveTimer) clearTimeout(touchMoveTimer);
      if (scrollTimer) cancelAnimationFrame(scrollTimer);
    };
  }, [lastScrollY, isExpanded, manuallyHidden]);

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
      `📅 ${task.date} um ${task.time}\n📍 ${task.location}\n🔧 ${task.task}\n👥 ${task.persons.join(', ') || 'Nicht zugewiesen'}\n`
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
        className={`header-section ${headerVisible && !manuallyHidden ? 'sticky-visible' : 'header-hidden'}`} 
        style={{
          transform: (headerVisible && !manuallyHidden) ? 'translateY(0)' : 'translateY(-100%)',
          opacity: (headerVisible && !manuallyHidden) ? 1 : 0,
          pointerEvents: (headerVisible && !manuallyHidden) ? 'auto' : 'none',
          transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
          position: 'fixed',
          top: '80px',
          left: 0,
          width: '100%',
          zIndex: 2000,
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
              transition: 'all 0.4s ease',
              background: 'var(--primary-yellow)',
              border: '2px solid var(--secondary-black)',
              padding: '15px',
              borderRadius: '10px',
              marginBottom: '15px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: 'var(--secondary-black)', fontWeight: 'bold' }}>
                <p>📱 <strong>Mobil:</strong> Wische nach unten zum Scrollen, nach oben um die Suche wieder anzuzeigen</p>
                <p>🔍 <strong>Suche:</strong> Gib einen Namen ein, um alle Aufgaben einer Person zu finden</p>
                <p>📅 <strong>Filter:</strong> Wähle einen Tag oder eine Aufgabe aus den Dropdown-Menüs</p>
                <p>📄 <strong>Export:</strong> Teile Ergebnisse per WhatsApp oder speichere als PDF</p>
              </div>
            </div>
          )}
          
          {/* Primary Name Search */}
          <div className="primary-search" style={{ position: 'relative', marginBottom: '15px' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nach Namen suchen..."
              style={{
                width: '100%',
                padding: '12px 40px 12px 12px',
                borderRadius: '8px',
                border: '2px solid var(--secondary-black)',
                backgroundColor: 'var(--primary-yellow)',
                color: 'var(--secondary-black)',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            />
            {/* Clear search button */}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--secondary-black)',
                  cursor: 'pointer',
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}
                title="Suche löschen"
              >
                ✕
              </button>
            )}
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
            
            {/* Task Search Combo */}
            <div className="task-search-combo" style={{ flex: 2, position: 'relative', minWidth: '200px' }}>
              <input
                type="text"
                value={taskSearchTerm}
                onChange={handleTaskInputChange}
                onFocus={() => setShowTaskDropdown(true)}
                placeholder="Aufgabe suchen..."
                className="task-search-combo input"
              />
              
              {/* Dropdown arrow */}
              <button
                onClick={() => setShowTaskDropdown(!showTaskDropdown)}
                style={{
                  position: 'absolute',
                  right: '40px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--secondary-black)',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
                title="Aufgaben anzeigen"
              >
                ▼
              </button>
              
              {/* Clear button */}
              {taskSearchTerm && (
                <button
                  onClick={clearTaskSearch}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--secondary-black)',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  ✕
                </button>
              )}
              
              {/* Dropdown list */}
              {showTaskDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'var(--primary-yellow)',
                  border: '2px solid var(--secondary-black)',
                  borderRadius: '6px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  zIndex: 1000
                }}>
                  {filteredDropdownTasks.map(task => (
                    <div
                      key={task}
                      onClick={() => handleTaskSelect(task)}
                      style={{
                        padding: '10px',
                        cursor: 'pointer',
                        borderBottom: '1px solid var(--secondary-black)',
                        color: 'var(--secondary-black)',
                        fontWeight: 'bold'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary-black)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {task}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Clear Filters */}
            <button 
              onClick={clearAllFilters}
              className="nav-btn"
              disabled={!(searchTerm || selectedDay || selectedTask || taskSearchTerm)}
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
                      📍 {task.location}
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
              <h3 style={{ color: 'var(--secondary-black)', marginBottom: '15px', fontSize: '1.5rem', fontWeight: 'bold' }}>Keine passenden Aufgaben gefunden</h3>
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
      
      {/* Scroll to top button */}
      <button 
        id="scrollTopButton"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setHeaderVisible(true);
          setIsExpanded(true);
        }}
        title="Nach oben"
      >
        ↑
      </button>
    </div>
  );
};

export default TaskViewer;
