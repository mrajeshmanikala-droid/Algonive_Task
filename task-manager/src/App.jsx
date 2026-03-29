import { Routes, Route } from 'react-router-dom';
import { TaskProvider, useTasks } from './context/TaskContext';
import HomePage from './pages/HomePage';
import TaskDetailPage from './pages/TaskDetailPage';
import { HiOutlineCheckBadge } from 'react-icons/hi2';
import { Link } from 'react-router-dom';

function AppContent() {
  const { stats } = useTasks();

  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="app-header__brand" style={{ textDecoration: 'none' }}>
          <div className="app-header__logo">
            <HiOutlineCheckBadge />
          </div>
          <h1 className="app-header__title">TaskFlow</h1>
        </Link>
        <div className="app-header__actions">
          <div className="header-task-count">
            <span className="header-task-count__badge">{stats.total}</span>
            <span className="header-task-count__label">Total</span>
          </div>
          <div className="header-task-count">
            <span className="header-task-count__badge header-task-count__badge--active">{stats.active}</span>
            <span className="header-task-count__label">Active</span>
          </div>
          <div className="header-task-count">
            <span className="header-task-count__badge header-task-count__badge--done">{stats.completed}</span>
            <span className="header-task-count__label">Done</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/task/:id" element={<TaskDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
}

export default App;
