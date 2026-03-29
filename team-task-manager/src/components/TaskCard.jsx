import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi2';
import { BsCalendarEvent, BsExclamationTriangle } from 'react-icons/bs';
import { format, isPast, isToday, isTomorrow, differenceInDays } from 'date-fns';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';

function getDateLabel(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  const now = new Date();
  if (isPast(date) && date.toDateString() !== now.toDateString()) return 'Overdue';
  const diff = differenceInDays(date, now);
  if (diff <= 3) return `${diff}d left`;
  return format(date, 'MMM d, yyyy');
}

function getDateClass(dateStr, status) {
  if (!dateStr || status === 'completed') return '';
  const date = new Date(dateStr);
  const now = new Date();
  if (isPast(date) && date.toDateString() !== now.toDateString()) return 'task-card__date--overdue';
  if (differenceInDays(date, now) <= 3) return 'task-card__date--soon';
  return '';
}

export default function TaskCard({ task, onEdit }) {
  const { deleteTask } = useTasks();
  const { users } = useAuth();
  const assignee = users.find((u) => u.id === task.assigneeId);

  const isOverdue =
    task.status !== 'completed' &&
    task.dueDate &&
    isPast(new Date(task.dueDate)) &&
    new Date(task.dueDate).toDateString() !== new Date().toDateString();

  return (
    <div className={`task-card ${task.status === 'completed' ? 'task-card--completed' : ''} ${isOverdue ? 'task-card--overdue' : ''}`}>
      <div className="task-card__body">
        <h3 className={`task-card__title ${task.status === 'completed' ? 'task-card__title--completed' : ''}`}>
          {task.title}
        </h3>
        {task.description && <p className="task-card__description">{task.description}</p>}
        <div className="task-card__meta">
          <span className={`task-card__status task-card__status--${task.status}`}>
            {task.status === 'in-progress' ? 'In Progress' : task.status}
          </span>
          {task.dueDate && (
            <span className={`task-card__date ${getDateClass(task.dueDate, task.status)}`}>
              {isOverdue ? <BsExclamationTriangle /> : <BsCalendarEvent />}
              {getDateLabel(task.dueDate)}
            </span>
          )}
          <span className={`task-card__priority task-card__priority--${task.priority}`}>
            {task.priority}
          </span>
          {assignee && (
            <span className="task-card__assignee">
              <span className="task-card__assignee-avatar">{assignee.avatar}</span>
              {assignee.name.split(' ')[0]}
            </span>
          )}
        </div>
      </div>

      <div className="task-card__actions">
        <button className="task-card__action-btn" onClick={() => onEdit(task)} aria-label="Edit task">
          <HiOutlinePencil />
        </button>
        <button className="task-card__action-btn task-card__action-btn--delete" onClick={() => deleteTask(task.id)} aria-label="Delete task">
          <HiOutlineTrash />
        </button>
      </div>
    </div>
  );
}
