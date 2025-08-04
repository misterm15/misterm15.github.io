export interface Task {
  date: string;
  time: string;
  location: string;
  task: string;
  name: string;
}

export interface GroupedTask {
  date: string;
  time: string;
  location: string;
  task: string;
  persons: string[];
}

export interface StorageKeys {
  TASKS: string;
  LOGIN_STATUS: string;
  ADMIN_STATUS: string;
}

export interface LoginPageProps {
  onLogin: () => void;
  onWrongPassword: () => void;
  error: string;
}

export interface TaskViewerProps {
  tasks: Task[];
}
