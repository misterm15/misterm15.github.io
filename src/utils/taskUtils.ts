import type { Task, GroupedTask } from '../types';

// Group tasks by their original order (chronological)
export const groupTasksByOriginal = (tasks: Task[]): GroupedTask[] => {
  const taskGroups: Record<string, GroupedTask> = {};
  
  tasks.forEach(task => {
    const key = `${task.date}-${task.time}-${task.location}-${task.task}`;
    if (!taskGroups[key]) {
      taskGroups[key] = {
        date: task.date,
        time: task.time,
        location: task.location,
        task: task.task,
        persons: []
      };
    }
    // Only add person if they exist (not empty for unassigned tasks)
    if (task.name && task.name.length > 0) {
      taskGroups[key].persons.push(task.name);
    }
  });
  
  return Object.values(taskGroups);
};

// Sort days in Kirmes order: Freitag, Samstag, Sonntag, Montag, Dienstag, Mittwoch
export const sortDaysByKirmesOrder = (days: string[]): string[] => {
  const dayOrder = ['Freitag', 'Samstag', 'Sonntag', 'Montag', 'Dienstag', 'Mittwoch'];
  return days.sort((a, b) => {
    const indexA = dayOrder.indexOf(a);
    const indexB = dayOrder.indexOf(b);
    // If day not found in order, put it at the end
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
};

// Filter tasks based on search criteria
export const filterTasks = (
  tasks: GroupedTask[],
  searchTerm: string,
  selectedDay: string,
  selectedTask: string,
  taskSearchTerm: string
): GroupedTask[] => {
  return tasks.filter(task => {
    // For name search: if no search term, show all tasks
    // If search term exists, show only tasks with matching persons
    const matchesName = searchTerm.trim() === '' || 
      task.persons.some(person => 
        person.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesDay = selectedDay === '' || task.date === selectedDay;
    
    // Task filter: check both dropdown selection and search term
    const matchesTask = (selectedTask === '' || task.task === selectedTask) &&
      (taskSearchTerm.trim() === '' || task.task.toLowerCase().includes(taskSearchTerm.toLowerCase()));
    
    return matchesName && matchesDay && matchesTask;
  });
};
