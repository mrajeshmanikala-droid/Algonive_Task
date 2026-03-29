import { FiCheck } from 'react-icons/fi';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi2';
import { BsCalendarEvent, BsExclamationTriangle } from 'react-icons/bs';
import { format, isPast, isToday, isTomorrow, differenceInDays } from 'date-fns';
import { useTasks } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';

function getDateLabel(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  
  const now = new Date();
  if (isPast(date) && date.toDateString() !== now.toDateString()) return 'Overdue';
  
  const diff = differenceInDays(date, now);
  if (diff <= 3) return `${diff} days left`;
  
  return format(date, 'MMM d, yyyy');
}

function getDateClass(dateStr, completed) {
  if (!dateStr || completed) return '';
  const date = new Date(dateStr);
  const now = new Date();
  if (isPast(date) && date.toDateString() !== now.toDateString()) return 'task-card__date--overdue';
  const diff = differenceInDays(date, now);
  if (diff <= 3) return 'task-card__date--soon';
  return '';
}

export default function TaskCard({ task, onEdit }) {
  const { toggleComplete, deleteTask } = useTasks();
  const navigate = useNavigate();

  return (
    <div
      className={`task-card ${task.completed ? 'task-card--completed' : ''} ${
        !task.completed && task.dueDate && isPast(new Date(task.dueDate)) && new Date(task.dueDate).toDateString() !== new Date().toDateString()
          ? 'task-card--overdue'
          : ''
      }`}
    >
      <button
        className={`task-card__checkbox ${task.completed ? 'task-card__checkbox--checked' : ''}`}
        onClick={() => toggleComplete(task.id)}
        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {task.completed && <FiCheck className="task-card__check-icon" />}
      </button>

      <div className="task-card__body" onClick={() => navigate(`/task/${task.id}`)} style={{ cursor: 'pointer' }}>
        <h3 className={`task-card__title ${task.completed ? 'task-card__title--completed' : ''}`}>
          {task.title}
        </h3>
        {task.description && (
          <p className="task-card__description">{task.description}</p>
        )}
        <div className="task-card__meta">
          {task.dueDate && (
            <span className={`task-card__date ${getDateClass(task.dueDate, task.completed)}`}>
              {isPast(new Date(task.dueDate)) && !task.completed && new Date(task.dueDate).toDateString() !== new Date().toDateString() ? (
                <BsExclamationTriangle />
              ) : (
                <BsCalendarEvent />
              )}
              {getDateLabel(task.dueDate)}
            </span>
          )}
          <span className={`task-card__priority task-card__priority--${task.priority}`}>
            {task.priority}
          </span>
        </div>
      </div>

      <div className="task-card__actions">
        <button
          className="task-card__action-btn"
          onClick={() => onEdit(task)}
          aria-label="Edit task"
        >
          <HiOutlinePencil />
        </button>
        <button
          className="task-card__action-btn task-card__action-btn--delete"
          onClick={() => deleteTask(task.id)}
          aria-label="Delete task"
        >
          <HiOutlineTrash />
        </button>
      </div>
    </div>
  );
}
