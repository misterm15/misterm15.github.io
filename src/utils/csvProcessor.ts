import Papa from 'papaparse';
import type { Task } from '../types';

export const processCSV = (csvText: string): Promise<Task[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      delimiter: ';', // German CSV uses semicolon
      complete: function(results) {
        const validTasks: Task[] = [];
        
        if (results.data && Array.isArray(results.data)) {
          results.data.forEach((rowData: unknown) => {
            const row = rowData as Record<string, unknown>;
            // Process each row and validate required fields
            if (row && typeof row === 'object') {
              const task: Partial<Task> = {};
              
              // Map CSV columns to task properties
              Object.keys(row).forEach(key => {
                const value = row[key]?.toString().trim() || '';
                switch(key.toLowerCase()) {
                  case 'datum':
                  case 'date':
                  case 'tag':
                    task.date = value;
                    break;
                  case 'zeit':
                  case 'time':
                  case 'uhrzeit':
                    task.time = value;
                    break;
                  case 'ort':
                  case 'location':
                  case 'standort':
                    task.location = value;
                    break;
                  case 'aufgabe':
                  case 'task':
                  case 'tätigkeit':
                    task.task = value;
                    break;
                  case 'name':
                  case 'person':
                  case 'mitarbeiter':
                  case 'zugewiesene_personen':
                    task.name = value;
                    break;
                }
              });
              
              // Only add tasks that have at least some required fields
              if (task.date || task.time || task.location || task.task) {
                // Handle multiple persons in one field (separated by semicolons)
                if (task.name && task.name.includes(';')) {
                  const persons = task.name.split(';').map(p => p.trim()).filter(p => p.length > 0);
                  persons.forEach(person => {
                    validTasks.push({
                      date: task.date || '',
                      time: task.time || '',
                      location: task.location || '',
                      task: task.task || '',
                      name: person
                    });
                  });
                } else {
                  validTasks.push({
                    date: task.date || '',
                    time: task.time || '',
                    location: task.location || '',
                    task: task.task || '',
                    name: task.name || ''
                  });
                }
              }
            }
          });
        }
        
        resolve(validTasks);
      },
      error: function(error: Error) {
        reject(error);
      }
    });
  });
};
