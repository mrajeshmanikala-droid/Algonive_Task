import { useParams, useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { FiArrowLeft, FiCheck, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { BsCalendarEvent, BsExclamationTriangle, BsClock } from 'react-icons/bs';
import { format, isPast, isToday, isTomorrow, differenceInDays } from 'date-fns';
import { useState } from 'react';
import TaskModal from '../components/TaskModal';

function getStatusInfo(task) {
  if (task.completed) return { label: 'Completed', className: 'status-badge--completed' };
  if (task.dueDate) {
    const date = new Date(task.dueDate);
    const now = new Date();
    if (isPast(date) && date.toDateString() !== now.toDateString()) {
      return { label: 'Overdue', className: 'status-badge--overdue' };
    }
    const diff = differenceInDays(date, now);
    if (diff <= 3) return { label: 'Due Soon', className: 'status-badge--soon' };
  }
  return { label: 'Active', className: 'status-badge--active' };
}

function formatDueDate(dateStr) {
  if (!dateStr) return 'No due date set';
  const date = new Date(dateStr);
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  const now = new Date();
  if (isPast(date) && date.toDateString() !== now.toDateString()) {
    return `Overdue — was due ${format(date, 'MMM d, yyyy')}`;
  }
  const diff = differenceInDays(date, now);
  if (diff <= 3) return `${format(date, 'EEEE, MMM d, yyyy')} (${diff} days left)`;
  return format(date, 'EEEE, MMM d, yyyy');
}

export default function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allTasks, toggleComplete, deleteTask } = useTasks();
  const [modalOpen, setModalOpen] = useState(false);

  const task = allTasks.find((t) => t.id === id);

  if (!task) {
    return (
      <div className="detail-page">
        <button className="detail-page__back" onClick={() => navigate('/')}>
          <FiArrowLeft /> Back to Tasks
        </button>
        <div className="detail-page__not-found">
          <h2>Task not found</h2>
          <p>This task may have been deleted.</p>
        </div>
      </div>
    );
  }

  const status = getStatusInfo(task);
  const createdDate = task.createdAt ? format(new Date(task.createdAt), 'EEEE, MMM d, yyyy — h:mm a') : 'Unknown';

  const handleDelete = () => {
    deleteTask(task.id);
    navigate('/');
  };

  const handleToggle = () => {
    toggleComplete(task.id);
  };

  return (
    <div className="detail-page">
      <button className="detail-page__back" onClick={() => navigate('/')}>
        <FiArrowLeft /> Back to Tasks
      </button>

      <div className="detail-page__card">
        <div className="detail-page__header">
          <span className={`status-badge ${status.className}`}>{status.label}</span>
          <span className={`task-card__priority task-card__priority--${task.priority}`}>
            {task.priority}
          </span>
        </div>

        <h1 className={`detail-page__title ${task.completed ? 'detail-page__title--completed' : ''}`}>
          {task.title}
        </h1>

        {task.description && (
          <div className="detail-page__section">
            <h3 className="detail-page__label">Description</h3>
            <p className="detail-page__description">{task.description}</p>
          </div>
        )}

        <div className="detail-page__info-grid">
          <div className="detail-page__info-item">
            <div className="detail-page__info-icon">
              {task.dueDate && isPast(new Date(task.dueDate)) && !task.completed && new Date(task.dueDate).toDateString() !== new Date().toDateString()
                ? <BsExclamationTriangle />
                : <BsCalendarEvent />}
            </div>
            <div>
              <span className="detail-page__info-label">Due Date</span>
              <span className={`detail-page__info-value ${
                task.dueDate && isPast(new Date(task.dueDate)) && !task.completed && new Date(task.dueDate).toDateString() !== new Date().toDateString()
                  ? 'detail-page__info-value--overdue' : ''
              }`}>
                {formatDueDate(task.dueDate)}
              </span>
            </div>
          </div>

          <div className="detail-page__info-item">
            <div className="detail-page__info-icon">
              <BsClock />
            </div>
            <div>
              <span className="detail-page__info-label">Created</span>
              <span className="detail-page__info-value">{createdDate}</span>
            </div>
          </div>
        </div>

        <div className="detail-page__actions">
          <button
            className={`btn ${task.completed ? 'btn--secondary' : 'btn--primary'}`}
            onClick={handleToggle}
          >
            <FiCheck />
            {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
          </button>
          <button className="btn btn--secondary" onClick={() => setModalOpen(true)}>
            <FiEdit2 /> Edit
          </button>
          <button className="btn btn--danger" onClick={handleDelete}>
            <FiTrash2 /> Delete
          </button>
        </div>
      </div>

      <TaskModal
        key={`${modalOpen}-${task.id}`}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editTask={task}
      />
    </div>
  );
}
