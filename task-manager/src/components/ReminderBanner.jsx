import { BsExclamationTriangle, BsClock } from 'react-icons/bs';
import { format } from 'date-fns';
import { useTasks } from '../context/TaskContext';

export default function ReminderBanner() {
  const { upcomingDeadlines, overdueTasks } = useTasks();

  if (overdueTasks.length === 0 && upcomingDeadlines.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
      {overdueTasks.length > 0 && (
        <div className="reminder-banner" style={{ borderColor: 'rgba(248, 113, 113, 0.3)', background: 'linear-gradient(135deg, rgba(248, 113, 113, 0.08), rgba(248, 113, 113, 0.03))' }}>
          <BsExclamationTriangle className="reminder-banner__icon" style={{ color: 'var(--danger-400)' }} />
          <div className="reminder-banner__content">
            <div className="reminder-banner__title" style={{ color: 'var(--danger-400)' }}>
              {overdueTasks.length} Overdue {overdueTasks.length === 1 ? 'Task' : 'Tasks'}
            </div>
            <div className="reminder-banner__text">
              {overdueTasks.slice(0, 3).map((t, i) => (
                <span key={t.id}>
                  {i > 0 && ', '}
                  <strong>{t.title}</strong>
                  {t.dueDate && ` (was due ${format(new Date(t.dueDate), 'MMM d')})`}
                </span>
              ))}
              {overdueTasks.length > 3 && ` and ${overdueTasks.length - 3} more`}
            </div>
          </div>
        </div>
      )}

      {upcomingDeadlines.length > 0 && (
        <div className="reminder-banner">
          <BsClock className="reminder-banner__icon" />
          <div className="reminder-banner__content">
            <div className="reminder-banner__title">
              {upcomingDeadlines.length} Upcoming {upcomingDeadlines.length === 1 ? 'Deadline' : 'Deadlines'}
            </div>
            <div className="reminder-banner__text">
              {upcomingDeadlines.slice(0, 3).map((t, i) => (
                <span key={t.id}>
                  {i > 0 && ', '}
                  <strong>{t.title}</strong>
                  {t.dueDate && ` (due ${format(new Date(t.dueDate), 'MMM d')})`}
                </span>
              ))}
              {upcomingDeadlines.length > 3 && ` and ${upcomingDeadlines.length - 3} more`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
