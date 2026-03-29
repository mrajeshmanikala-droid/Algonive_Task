import { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { FiPlus, FiSearch, FiInbox } from 'react-icons/fi';

const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
];

export default function TasksPage() {
  const {
    tasks,
    statusFilter,
    setStatusFilter,
    assigneeFilter,
    setAssigneeFilter,
    searchQuery,
    setSearchQuery,
    markAllComplete,
    resetTasks,
  } = useTasks();
  const { users } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const handleEdit = (task) => {
    setEditTask(task);
    setModalOpen(true);
  };

  const handleNew = () => {
    setEditTask(null);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditTask(null);
  };

  return (
    <>
      <div className="section-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Tasks</h1>
        <button className="btn btn--secondary" onClick={markAllComplete}>
          Mark All Complete
        </button>
        <button className="btn btn--secondary" onClick={resetTasks}>
          Reset Sample Tasks
        </button>
        <button className="btn btn--primary" onClick={handleNew}>
          <FiPlus /> New Task
        </button>
      </div>

      <div className="filter-bar">
        <div className="filter-bar__search">
          <FiSearch className="filter-bar__search-icon" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-bar__tabs">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              className={`filter-tab ${statusFilter === tab.key ? 'filter-tab--active' : ''}`}
              onClick={() => setStatusFilter(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <select
          className="filter-bar__select"
          value={assigneeFilter}
          onChange={(e) => setAssigneeFilter(e.target.value)}
        >
          <option value="all">All Members</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
      </div>

      <div className="task-list-header">
        <span className="task-list-header__title">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      {tasks.length > 0 ? (
        <div className="task-list">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={handleEdit} />
          ))}
        </div>
      ) : (
        <div className="task-list--empty">
          <FiInbox className="task-list--empty__icon" />
          <h3 className="task-list--empty__title">No tasks found</h3>
          <p className="task-list--empty__text">
            Create a new task or adjust your filters.
          </p>
        </div>
      )}

      <TaskModal
        key={`${modalOpen}-${editTask?.id ?? 'new'}`}
        isOpen={modalOpen}
        onClose={handleClose}
        editTask={editTask}
      />
    </>
  );
}
