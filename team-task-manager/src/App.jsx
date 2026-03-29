import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import NotificationBell from './components/NotificationBell';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import TeamPage from './pages/TeamPage';

function AppLayout() {
  const { currentUser } = useAuth();
  const pageTitle = {
    '/': 'Dashboard',
    '/tasks': 'Tasks',
    '/team': 'Team',
  };
  const path = window.location.pathname;

  return (
    <TaskProvider>
      <div className="app-layout">
        <Sidebar />
        <div className="app-layout__content">
          <header className="app-topbar">
            <h2 className="app-topbar__title">{pageTitle[path] || 'TeamFlow'}</h2>
            <div className="app-topbar__right">
              <NotificationBell />
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'linear-gradient(135deg, var(--primary-600), var(--accent-500))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: 'white',
                }}
              >
                {currentUser?.avatar}
              </div>
            </div>
          </header>
          <main className="app-page">
            <Outlet />
          </main>
        </div>
      </div>
    </TaskProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<DashboardPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/team" element={<TeamPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
