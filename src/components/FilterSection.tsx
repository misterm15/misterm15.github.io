import React from 'react';
import { TypeAheadDropdown } from './TypeAheadDropdown';

interface FilterSectionProps {
  searchTerm: string;
  selectedDay: string;
  selectedTask: string;
  taskSearchTerm: string;
  selectedNameOption: { id: string; label: string } | null;
  selectedTaskOption: { id: string; label: string } | null;
  uniqueNames: { id: string; label: string }[];
  taskOptions: { id: string; label: string }[];
  sortedDays: string[];
  onNameSelection: (selectedOption: { id: string; label: string } | null) => void;
  onNameSearch: (query: string) => void;
  onDayChange: (day: string) => void;
  onTaskSelection: (selectedOption: { id: string; label: string } | null) => void;
  onTaskSearch: (query: string) => void;
  onClearFilters: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  searchTerm,
  selectedDay,
  selectedTask,
  taskSearchTerm,
  selectedNameOption,
  selectedTaskOption,
  uniqueNames,
  taskOptions,
  sortedDays,
  onNameSelection,
  onNameSearch,
  onDayChange,
  onTaskSelection,
  onTaskSearch,
  onClearFilters
}) => {
  return (
    <div 
      style={{
        top: '80px',
        left: 0,
        width: '100%',
        background: 'var(--secondary-black)',
      }}>
      <div className="filter-container">
        
        {/* Primary Name Search */}
        <div className="primary-search" style={{ position: 'relative', marginBottom: '15px' }}>
          <TypeAheadDropdown
            options={uniqueNames}
            value={selectedNameOption}
            placeholder="Nach Namen suchen..."
            onChange={onNameSelection}
            onSearch={onNameSearch}
          />
        </div>
        
        {/* Secondary Filters */}
        <div className="secondary-filters" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {/* Day Filter */}
          <select 
            className="filter-select"
            value={selectedDay}
            onChange={(e) => onDayChange(e.target.value)}
          >
            <option value="">Alle Tage</option>
            {sortedDays.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
          
          {/* Task Search with TypeAheadDropdown */}
          <div style={{ flex: 2, minWidth: '200px' }}>
            <TypeAheadDropdown
              options={taskOptions}
              value={selectedTaskOption}
              placeholder="Dienste suchen..."
              onChange={onTaskSelection}
              onSearch={onTaskSearch}
            />
          </div>
          
          {/* Clear Filters */}
          <button 
            onClick={onClearFilters}
            className="nav-btn"
            disabled={!(searchTerm || selectedDay || selectedTask || taskSearchTerm)}
          >
            {searchTerm ? '👥 Alle anzeigen' : '🔄 Reset'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
