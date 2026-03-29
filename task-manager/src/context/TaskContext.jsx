/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const TaskContext = createContext();

const STORAGE_KEY = 'taskmanager_tasks';

const generateId = () => `task_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

const defaultTasks = [
  {
    id: 'task_default_1',
    title: 'Finish onboarding tasks',
    description: 'Complete the first week internship assignment in the repo',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'high',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task_default_2',
    title: 'Set up local development',
    description: 'Install dependencies and run npm run dev for both apps',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'medium',
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task_default_3',
    title: 'Build task manager UI',
    description: 'Add sample tasks to TaskContext so UI has initial content',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'low',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task_default_4',
    title: 'Design database schema',
    description: 'Create ER diagrams and define table relationships for the user management module',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'high',
    completed: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task_default_5',
    title: 'Write unit tests for API',
    description: 'Add Jest tests for all REST endpoints including edge cases and error handling',
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'medium',
    completed: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task_default_6',
    title: 'Review pull requests',
    description: 'Go through open PRs on the team repo and leave constructive feedback',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'high',
    completed: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task_default_7',
    title: 'Update project documentation',
    description: 'Refresh the README with setup instructions, screenshots, and contribution guidelines',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'low',
    completed: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task_default_8',
    title: 'Fix responsive layout bugs',
    description: 'Resolve CSS issues on mobile viewports — sidebar overlap and card truncation',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'high',
    completed: false,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task_default_9',
    title: 'Prepare sprint demo presentation',
    description: 'Create slides showcasing features completed this sprint for the stakeholder review',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'medium',
    completed: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task_default_10',
    title: 'Implement dark mode toggle',
    description: 'Add a theme switcher component with smooth transitions and localStorage persistence',
    dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'low',
    completed: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const loadTasks = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    return defaultTasks;
  } catch {
    return defaultTasks;
  }
};

const saveTasks = (tasks) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(loadTasks);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = useCallback((taskData) => {
    const newTask = {
      id: generateId(),
      title: taskData.title,
      description: taskData.description || '',
      dueDate: taskData.dueDate || null,
      priority: taskData.priority || 'medium',
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  }, []);

  const updateTask = useCallback((id, updates) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const toggleComplete = useCallback((id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const markAllComplete = useCallback(() => {
    setTasks((prev) => prev.map((task) => ({ ...task, completed: true })));
  }, []);

  const resetTasks = useCallback(() => {
    setTasks(defaultTasks);
  }, []);

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active' && task.completed) return false;
    if (filter === 'completed' && !task.completed) return false;
    if (filter === 'overdue') {
      if (task.completed || !task.dueDate) return false;
      if (!(new Date(task.dueDate) < new Date(new Date().toDateString()))) return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(q) ||
        task.description.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const stats = {
    total: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
    overdue: tasks.filter((t) => {
      if (t.completed || !t.dueDate) return false;
      return new Date(t.dueDate) < new Date(new Date().toDateString());
    }).length,
  };

  const upcomingDeadlines = tasks.filter((t) => {
    if (t.completed || !t.dueDate) return false;
    const due = new Date(t.dueDate);
    const now = new Date();
    const diffMs = due - now;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 3;
  });

  const overdueTasks = tasks.filter((t) => {
    if (t.completed || !t.dueDate) return false;
    return new Date(t.dueDate) < new Date(new Date().toDateString());
  });

  return (
    <TaskContext.Provider
      value={{
        tasks: filteredTasks,
        allTasks: tasks,
        stats,
        upcomingDeadlines,
        overdueTasks,
        filter,
        searchQuery,
        setFilter,
        setSearchQuery,
        addTask,
        updateTask,
        deleteTask,
        toggleComplete,
        markAllComplete,
        resetTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
