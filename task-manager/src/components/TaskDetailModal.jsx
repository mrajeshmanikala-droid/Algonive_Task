import { FiX, FiCheck } from 'react-icons/fi';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi2';
import { BsCalendarEvent, BsExclamationTriangle, BsClock } from 'react-icons/bs';
import { format, isPast, isToday, isTomorrow, differenceInDays } from 'date-fns';
import { useTasks } from '../context/TaskContext';

function getStatusInfo(task) {
  if (task.completed) return { label: 'Completed', className: 'detail-status--completed' };
  if (task.dueDate) {
    const date = new Date(task.dueDate);
    const now = new Date();
    if (isPast(date) && date.toDateString() !== now.toDateString()) {
      return { label: 'Overdue', className: 'detail-status--overdue' };
    }
    const diff = differenceInDays(date, now);
    if (diff <= 3) return { label: 'Due Soon', className: 'detail-status--soon' };
  }
  return { label: 'Active', className: 'detail-status--active' };
}

function formatDueDate(dateStr) {
  if (!dateStr) return 'No due date';
  const date = new Date(dateStr);
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';

  const now = new Date();
  if (isPast(date) && date.toDateString() !== now.toDateString()) {
    return `Overdue — was due ${format(date, 'MMM d, yyyy')}`;
  }

  const diff = differenceInDays(date, now);
  if (diff <= 3) return `${format(date, 'MMM d, yyyy')} (${diff} days left)`;

  return format(date, 'EEEE, MMM d, yyyy');
}

export default function TaskDetailModal({ task, isOpen, onClose, onEdit }) {
  const { toggleComplete, deleteTask } = useTasks();

  if (!isOpen || !task) return null;

  const status = getStatusInfo(task);
  const createdDate = task.createdAt ? format(new Date(task.createdAt), 'MMM d, yyyy — h:mm a') : 'Unknown';

  const handleDelete = () => {
    deleteTask(task.id);
    onClose();
  };

  const handleToggle = () => {
    toggleComplete(task.id);
  };

  const handleEdit = () => {
    onClose();
    onEdit(task);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
            <h2 className="modal__title" style={{ flex: 1, minWidth: 0 }}>Task Details</h2>
            <span className={`detail-status ${status.className}`}>{status.label}</span>
          </div>
          <button className="modal__close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="modal__body detail-body">
          <h3 className={`detail-title ${task.completed ? 'detail-title--completed' : ''}`}>
            {task.title}
          </h3>

          {task.description && (
            <div className="detail-section">
              <span className="detail-label">Description</span>
              <p className="detail-description">{task.description}</p>
            </div>
          )}

          <div className="detail-info-grid">
            <div className="detail-info-item">
              <span className="detail-label">
                {task.dueDate && isPast(new Date(task.dueDate)) && !task.completed
                  ? <BsExclamationTriangle style={{ marginRight: '6px' }} />
                  : <BsCalendarEvent style={{ marginRight: '6px' }} />}
                Due Date
              </span>
              <span className={`detail-value ${
                task.dueDate && isPast(new Date(task.dueDate)) && !task.completed && new Date(task.dueDate).toDateString() !== new Date().toDateString()
                  ? 'detail-value--overdue' : ''
              }`}>
                {formatDueDate(task.dueDate)}
              </span>
            </div>

            <div className="detail-info-item">
              <span className="detail-label">Priority</span>
              <span className={`task-card__priority task-card__priority--${task.priority}`}>
                {task.priority}
              </span>
            </div>

            <div className="detail-info-item">
              <span className="detail-label"><BsClock style={{ marginRight: '6px' }} />Created</span>
              <span className="detail-value">{createdDate}</span>
            </div>
          </div>
        </div>

        <div className="modal__footer detail-footer">
          <button
            className={`btn ${task.completed ? 'btn--secondary' : 'btn--primary'}`}
            onClick={handleToggle}
            style={{ gap: '6px' }}
          >
            <FiCheck />
            {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
          </button>
          <button className="btn btn--secondary" onClick={handleEdit} style={{ gap: '6px' }}>
            <HiOutlinePencil /> Edit
          </button>
          <button className="btn btn--danger" onClick={handleDelete} style={{ gap: '6px' }}>
            <HiOutlineTrash /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
