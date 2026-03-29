import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext();

const USERS_KEY = 'teamflow_users';
const SESSION_KEY = 'teamflow_session';

const DEFAULT_USERS = [
  { id: 'user_1', name: 'Alice Johnson', email: 'alice@team.com', password: 'pass123', role: 'Admin', avatar: 'AJ' },
  { id: 'user_2', name: 'Bob Smith', email: 'bob@team.com', password: 'pass123', role: 'Developer', avatar: 'BS' },
  { id: 'user_3', name: 'Carol Lee', email: 'carol@team.com', password: 'pass123', role: 'Designer', avatar: 'CL' },
  { id: 'user_4', name: 'David Kumar', email: 'david@team.com', password: 'pass123', role: 'Developer', avatar: 'DK' },
  { id: 'user_5', name: 'Emma Wilson', email: 'emma@team.com', password: 'pass123', role: 'Member', avatar: 'EW' },
];

function loadUsers() {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
}

function loadSession() {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function getInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(loadUsers);
  const [currentUser, setCurrentUser] = useState(loadSession);

  const persistUsers = (updated) => {
    setUsers(updated);
    localStorage.setItem(USERS_KEY, JSON.stringify(updated));
  };

  const login = useCallback(
    (email, password) => {
      const user = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (!user) return { success: false, error: 'Invalid email or password' };
      setCurrentUser(user);
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return { success: true };
    },
    [users]
  );

  const signup = useCallback(
    (name, email, password, role = 'Member') => {
      if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, error: 'Email already registered' };
      }
      const newUser = {
        id: `user_${Date.now()}`,
        name,
        email,
        password,
        role,
        avatar: getInitials(name),
      };
      const updated = [...users, newUser];
      persistUsers(updated);
      setCurrentUser(newUser);
      localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
      return { success: true };
    },
    [users]
  );

  const isAdmin = currentUser?.role === 'Admin';

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  const addMember = useCallback(
    (name, email, role = 'Member') => {
      if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, error: 'Email already exists' };
      }
      const newUser = {
        id: `user_${Date.now()}`,
        name,
        email,
        password: 'pass123',
        role,
        avatar: getInitials(name),
      };
      persistUsers([...users, newUser]);
      return { success: true };
    },
    [users]
  );

  const removeMember = useCallback(
    (id) => {
      if (id === currentUser?.id) return;
      persistUsers(users.filter((u) => u.id !== id));
    },
    [users, currentUser]
  );

  return (
    <AuthContext.Provider
      value={{ currentUser, users, login, signup, logout, addMember, removeMember, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
