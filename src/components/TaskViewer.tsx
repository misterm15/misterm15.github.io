import React, { useState, useMemo } from 'react';
import type { TaskViewerProps } from '../types';
import { groupTasksByOriginal, sortDaysByKirmesOrder, filterTasks } from '../utils/taskUtils';
import NavigationBar from './NavigationBar';
import FilterSection from './FilterSection';
import ExportMenu from './ExportMenu';
import TaskCard from './TaskCard';
import NoResultsMessage from './NoResultsMessage';
import Footer from './Footer';

const TaskViewer: React.FC<TaskViewerProps> = ({ tasks }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [taskSearchTerm, setTaskSearchTerm] = useState('');
  const [selectedNameOption, setSelectedNameOption] = useState<{ id: string; label: string } | null>(null);
  const [selectedTaskOption, setSelectedTaskOption] = useState<{ id: string; label: string } | null>(null);
  const [selectedDayOption, setSelectedDayOption] = useState<{ id: string; label: string } | null>(null);

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
      id: name,
      label: name
    }));
  }, [tasks]);

  // Get unique tasks for typeahead
  const taskOptions = useMemo(() => {
    return uniqueTasks.map(task => ({
      id: task,
      label: task
    }));
  }, [uniqueTasks]);

  // Sort days in Kirmes order and create day options for typeahead
  const sortedDays = sortDaysByKirmesOrder(uniqueDays);
  const dayOptions = useMemo(() => {
    return sortedDays.map(day => ({
      id: day,
      label: day
    }));
  }, [sortedDays]);

  // Group tasks by their original order (chronological)
  const groupedTasks = groupTasksByOriginal(tasks);

  // Filter tasks based on all criteria
  const filteredTasks = filterTasks(groupedTasks, searchTerm, selectedDay, selectedTask, taskSearchTerm);

  // Handle task selection from typeahead
  const handleTaskSelection = (selectedOption: { id: string; label: string } | null) => {
    setSelectedTaskOption(selectedOption);
    if (selectedOption) {
      setTaskSearchTerm(selectedOption.label);
      setSelectedTask(selectedOption.label);
    } else {
      setTaskSearchTerm('');
      setSelectedTask('');
    }
  };

  // Handle task search input
  const handleTaskSearch = (query: string) => {
    // Don't update taskSearchTerm while typing, only when selection is made
    if (query.trim() === '') {
      setTaskSearchTerm('');
      setSelectedTask('');
      setSelectedTaskOption(null);
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedDay('');
    setTaskSearchTerm('');
    setSelectedTask('');
    setSelectedNameOption(null);
    setSelectedTaskOption(null);
    setSelectedDayOption(null);
  };

  // Handle name selection from typeahead
  const handleNameSelection = (selectedOption: { id: string; label: string } | null) => {
    setSelectedNameOption(selectedOption);
    if (selectedOption) {
      setSearchTerm(selectedOption.label);
    } else {
      setSearchTerm('');
    }
  };

  // Handle name search input
  const handleNameSearch = (query: string) => {
    // Don't update searchTerm while typing, only when selection is made
    if (query.trim() === '') {
      setSearchTerm('');
      setSelectedNameOption(null);
    }
  };

  // Handle day selection from typeahead
  const handleDaySelection = (selectedOption: { id: string; label: string } | null) => {
    setSelectedDayOption(selectedOption);
    if (selectedOption) {
      setSelectedDay(selectedOption.label);
    } else {
      setSelectedDay('');
    }
  };

  // Handle day search input
  const handleDaySearch = (query: string) => {
    // Don't update selectedDay while typing, only when selection is made
    if (query.trim() === '') {
      setSelectedDay('');
      setSelectedDayOption(null);
    }
  };

  return (
    <div className="main-layout">
      <NavigationBar />

      <FilterSection
        searchTerm={searchTerm}
        selectedDay={selectedDay}
        selectedTask={selectedTask}
        taskSearchTerm={taskSearchTerm}
        selectedNameOption={selectedNameOption}
        selectedTaskOption={selectedTaskOption}
        selectedDayOption={selectedDayOption}
        uniqueNames={uniqueNames}
        taskOptions={taskOptions}
        dayOptions={dayOptions}
        onNameSelection={handleNameSelection}
        onNameSearch={handleNameSearch}
        onDaySelection={handleDaySelection}
        onDaySearch={handleDaySearch}
        onTaskSelection={handleTaskSelection}
        onTaskSearch={handleTaskSearch}
        onClearFilters={clearAllFilters}
      />
      
      <ExportMenu 
        searchTerm={searchTerm}
        filteredTasks={filteredTasks}
      />
      
      {/* Scrollable Content */}
      <div className="content-section" style={{ paddingTop: '30px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {filteredTasks.map((task, index) => (
            <TaskCard key={index} task={task} />
          ))}
          
          {/* Show message when no tasks match the filters */}
          {filteredTasks.length === 0 && (
            <NoResultsMessage onClearFilters={clearAllFilters} />
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default TaskViewer;
