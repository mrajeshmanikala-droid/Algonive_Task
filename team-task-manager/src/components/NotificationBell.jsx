import { useState, useRef, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { HiOutlineBell } from 'react-icons/hi2';
import { BsExclamationTriangle, BsClock } from 'react-icons/bs';
import { format } from 'date-fns';

export default function NotificationBell() {
  const { upcomingDeadlines, overdueTasks } = useTasks();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const total = overdueTasks.length + upcomingDeadlines.length;

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="notification-bell" ref={ref}>
      <button
        className="notification-bell__btn"
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
      >
        <HiOutlineBell />
        {total > 0 && <span className="notification-bell__badge">{total}</span>}
      </button>

      {open && (
        <div className="notification-bell__dropdown">
          <div className="notification-bell__header">
            Notifications {total > 0 && `(${total})`}
          </div>

          {total === 0 && (
            <div className="notification-bell__empty">🎉 All caught up! No pending alerts.</div>
          )}

          {overdueTasks.map((t) => (
            <div className="notification-bell__item" key={t.id}>
              <BsExclamationTriangle className="notification-bell__item-icon notification-bell__item-icon--overdue" />
              <div className="notification-bell__item-content">
                <div className="notification-bell__item-title">{t.title}</div>
                <div className="notification-bell__item-subtitle">
                  Overdue — was due {t.dueDate && format(new Date(t.dueDate), 'MMM d')}
                </div>
              </div>
            </div>
          ))}

          {upcomingDeadlines.map((t) => (
            <div className="notification-bell__item" key={t.id}>
              <BsClock className="notification-bell__item-icon notification-bell__item-icon--upcoming" />
              <div className="notification-bell__item-content">
                <div className="notification-bell__item-title">{t.title}</div>
                <div className="notification-bell__item-subtitle">
                  Due {t.dueDate && format(new Date(t.dueDate), 'MMM d')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
