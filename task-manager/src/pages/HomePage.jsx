import { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import FilterBar from '../components/FilterBar';
import ReminderBanner from '../components/ReminderBanner';
import { HiOutlineClipboardDocumentList, HiOutlineClock, HiOutlineCheckCircle, HiOutlineExclamationTriangle } from 'react-icons/hi2';
import { FiPlus, FiInbox } from 'react-icons/fi';

export default function HomePage() {
  const { tasks, stats, markAllComplete, resetTasks, setFilter } = useTasks();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const handleEdit = (task) => {
    setEditTask(task);
    setModalOpen(true);
  };

  const handleNewTask = () => {
    setEditTask(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditTask(null);
  };

  return (
    <>
      
      <div className="summary-grid">
        <div className="summary-card summary-card--clickable" onClick={() => setFilter('all')}>
          <div className="summary-card__icon summary-card__icon--total">
            <HiOutlineClipboardDocumentList />
          </div>
          <span className="summary-card__value">{stats.total}</span>
          <span className="summary-card__label">Total Tasks</span>
        </div>
        <div className="summary-card summary-card--clickable" onClick={() => setFilter('active')}>
          <div className="summary-card__icon summary-card__icon--pending">
            <HiOutlineClock />
          </div>
          <span className="summary-card__value">{stats.active}</span>
          <span className="summary-card__label">Active</span>
        </div>
        <div className="summary-card summary-card--clickable" onClick={() => setFilter('completed')}>
          <div className="summary-card__icon summary-card__icon--completed">
            <HiOutlineCheckCircle />
          </div>
          <span className="summary-card__value">{stats.completed}</span>
          <span className="summary-card__label">Completed</span>
        </div>
        <div className="summary-card summary-card--clickable" onClick={() => setFilter('overdue')}>
          <div className="summary-card__icon summary-card__icon--overdue">
            <HiOutlineExclamationTriangle />
          </div>
          <span className="summary-card__value">{stats.overdue}</span>
          <span className="summary-card__label">Overdue</span>
        </div>
      </div>

      
      <ReminderBanner />

      
      <FilterBar />

      
      <div className="task-list-header">
        <span className="task-list-header__title">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn--secondary" onClick={markAllComplete}>
            Mark All Complete
          </button>
          <button className="btn btn--secondary" onClick={resetTasks}>
            Reset Sample Tasks
          </button>
          <button className="btn btn--primary" onClick={handleNewTask}>
            <FiPlus /> Add Task
          </button>
        </div>
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
            Create your first task to get started!
          </p>
        </div>
      )}

      <TaskModal
        key={`${modalOpen}-${editTask?.id ?? 'new'}`}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        editTask={editTask}
      />
    </>
  );
}
