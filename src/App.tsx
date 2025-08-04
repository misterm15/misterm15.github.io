import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import TaskViewer from './components/TaskViewer';
import { processCSV } from './utils/csvProcessor';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from './utils/storage';
import type { Task } from './types';
import './App.css';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState('');

  // Check localStorage for existing login on component mount
  useEffect(() => {
    // Check if user is already logged in
    const loginStatus = loadFromStorage(STORAGE_KEYS.LOGIN_STATUS, false);
    if (loginStatus) {
      setIsLoggedIn(true);
    }

    // Clear any existing cache first
    if ('caches' in window) {
      caches.keys().then(function(names) {
        for (const name of names) caches.delete(name);
      });
    }

    // Load CSV data
    loadCSVFromFile();
  }, []);

  const loadCSVFromFile = async () => {
    try {
      // Force cache clear with multiple cache-busting techniques
      const timestamp = Date.now() + Math.random();
      const response = await fetch(`/real-data.csv?t=${timestamp}&cb=${Math.random()}`, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      if (response.ok) {
        const csvText = await response.text();
        const processedTasks = await processCSV(csvText);
        setTasks(processedTasks);
        return;
      }
    } catch (error) {
      console.log('CSV load error:', error);
      // Silently handle error
    }

    // No fallback data - if CSV fails to load, show empty state
    setTasks([]);
  };

  const handleLogin = () => {
    // Save login status to localStorage
    saveToStorage(STORAGE_KEYS.LOGIN_STATUS, true);

    // Clear any cached fetch requests
    if ('caches' in window) {
      caches.keys().then(function(names) {
        for (const name of names) caches.delete(name);
      });
    }

    setIsLoggedIn(true);
    setError('');

    // Force reload fresh CSV data with delay to ensure cache is cleared
    setTimeout(() => {
      loadCSVFromFile();
    }, 100);
  };

  const handleWrongPassword = () => {
    setError('Falsches Passwort. Bitte versuchen Sie es erneut.');
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} onWrongPassword={handleWrongPassword} error={error} />;
  }

  return <TaskViewer tasks={tasks} />;
};

export default App;
