import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';

const TaskContext = createContext();
const STORAGE_KEY = 'teamflow_tasks';

const generateId = () => `task_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

const defaultTasks = [
  {
    id: 'team_task_default_1',
    title: 'Design landing page wireframes',
    description: 'Create high-fidelity wireframes for the new product landing page including hero section, features grid, and pricing table.',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'high',
    status: 'in-progress',
    assigneeId: 'user_3',
    createdBy: 'user_1',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'team_task_default_2',
    title: 'Fix authentication token refresh',
    description: 'Users are getting logged out after 15 minutes. Debug and fix the token refresh mechanism in the auth middleware.',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'high',
    status: 'pending',
    assigneeId: 'user_2',
    createdBy: 'user_1',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'team_task_default_3',
    title: 'Write API documentation',
    description: 'Document all REST API endpoints with request/response examples using Swagger. Include authentication and error handling sections.',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'medium',
    status: 'pending',
    assigneeId: 'user_2',
    createdBy: 'user_1',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'team_task_default_4',
    title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment to staging environment on every PR merge.',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'medium',
    status: 'in-progress',
    assigneeId: 'user_1',
    createdBy: 'user_1',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'team_task_default_5',
    title: 'Create onboarding illustrations',
    description: 'Design 4 custom illustrations for the user onboarding flow: welcome, create team, add tasks, and invite members.',
    dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'low',
    status: 'pending',
    assigneeId: 'user_3',
    createdBy: 'user_1',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'team_task_default_6',
    title: 'Database schema optimization',
    description: 'Review and optimize database queries for the task listing page. Add indexes and reduce N+1 query issues.',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'high',
    status: 'pending',
    assigneeId: 'user_2',
    createdBy: 'user_1',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'team_task_default_7',
    title: 'User feedback survey',
    description: 'Create and distribute a feedback survey to beta users. Collect responses on UI, performance, and feature requests.',
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'low',
    status: 'completed',
    assigneeId: 'user_1',
    createdBy: 'user_1',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'team_task_default_8',
    title: 'Mobile responsive fixes',
    description: 'Fix layout issues on tablet and mobile breakpoints for the dashboard, task list, and team management pages.',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'medium',
    status: 'completed',
    assigneeId: 'user_3',
    createdBy: 'user_1',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

function loadTasks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    return defaultTasks;
  } catch {
    return defaultTasks;
  }
}

export function TaskProvider({ children }) {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState(loadTasks);
  const [statusFilter, setStatusFilter] = useState('all'); 
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback(
    (taskData) => {
      const newTask = {
        id: generateId(),
        title: taskData.title,
        description: taskData.description || '',
        dueDate: taskData.dueDate || null,
        priority: taskData.priority || 'medium',
        status: taskData.status || 'pending',
        assigneeId: taskData.assigneeId || null,
        createdBy: currentUser?.id || null,
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
    },
    [currentUser]
  );

  const updateTask = useCallback((id, updates) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const markAllComplete = useCallback(() => {
    setTasks((prev) => prev.map((task) => ({ ...task, status: 'completed' })));
  }, []);

  const resetTasks = useCallback(() => {
    setTasks(defaultTasks);
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (statusFilter !== 'all' && task.status !== statusFilter) return false;
      if (assigneeFilter !== 'all' && task.assigneeId !== assigneeFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(q) ||
          task.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [tasks, statusFilter, assigneeFilter, searchQuery]);

  const stats = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    overdue: tasks.filter((t) => {
      if (t.status === 'completed' || !t.dueDate) return false;
      return new Date(t.dueDate) < new Date(new Date().toDateString());
    }).length,
  }), [tasks]);

  const upcomingDeadlines = useMemo(() => {
    return tasks.filter((t) => {
      if (t.status === 'completed' || !t.dueDate) return false;
      const due = new Date(t.dueDate);
      const now = new Date();
      const diffDays = (due - now) / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays <= 3;
    });
  }, [tasks]);

  const overdueTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (t.status === 'completed' || !t.dueDate) return false;
      return new Date(t.dueDate) < new Date(new Date().toDateString());
    });
  }, [tasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks: filteredTasks,
        allTasks: tasks,
        stats,
        upcomingDeadlines,
        overdueTasks,
        statusFilter,
        assigneeFilter,
        searchQuery,
        setStatusFilter,
        setAssigneeFilter,
        setSearchQuery,
        addTask,
        updateTask,
        deleteTask,
        markAllComplete,
        resetTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
}
