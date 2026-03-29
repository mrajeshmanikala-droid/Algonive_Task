import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineClipboardDocumentList,
  HiOutlineClock,
  HiOutlineArrowPath,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
} from 'react-icons/hi2';
import { BsExclamationTriangle, BsClock } from 'react-icons/bs';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { stats, upcomingDeadlines, overdueTasks, allTasks } = useTasks();
  const { currentUser, users } = useAuth();

  const recentTasks = allTasks.slice(0, 5);

  return (
    <>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>
          Welcome back, {currentUser?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Here&apos;s an overview of your team&apos;s progress
        </p>
      </div>

      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-card__icon summary-card__icon--total">
            <HiOutlineClipboardDocumentList />
          </div>
          <span className="summary-card__value">{stats.total}</span>
          <span className="summary-card__label">Total Tasks</span>
        </div>
        <div className="summary-card">
          <div className="summary-card__icon summary-card__icon--pending">
            <HiOutlineClock />
          </div>
          <span className="summary-card__value">{stats.pending}</span>
          <span className="summary-card__label">Pending</span>
        </div>
        <div className="summary-card">
          <div className="summary-card__icon summary-card__icon--progress">
            <HiOutlineArrowPath />
          </div>
          <span className="summary-card__value">{stats.inProgress}</span>
          <span className="summary-card__label">In Progress</span>
        </div>
        <div className="summary-card">
          <div className="summary-card__icon summary-card__icon--completed">
            <HiOutlineCheckCircle />
          </div>
          <span className="summary-card__value">{stats.completed}</span>
          <span className="summary-card__label">Completed</span>
        </div>
        <div className="summary-card">
          <div className="summary-card__icon summary-card__icon--overdue">
            <HiOutlineExclamationTriangle />
          </div>
          <span className="summary-card__value">{stats.overdue}</span>
          <span className="summary-card__label">Overdue</span>
        </div>
      </div>

      {(overdueTasks.length > 0 || upcomingDeadlines.length > 0) && (
        <div style={{ marginBottom: '32px' }}>
          <div className="section-header">
            <h2 className="section-header__title">⚠️ Attention Needed</h2>
          </div>
          <div className="deadline-list">
            {overdueTasks.map((t) => (
              <div className="deadline-item" key={t.id}>
                <BsExclamationTriangle className="deadline-item__icon deadline-item__icon--overdue" />
                <div className="deadline-item__info">
                  <div className="deadline-item__title">{t.title}</div>
                  <div className="deadline-item__date">
                    Overdue — was due {t.dueDate && format(new Date(t.dueDate), 'MMM d, yyyy')}
                  </div>
                </div>
              </div>
            ))}
            {upcomingDeadlines.map((t) => (
              <div className="deadline-item" key={t.id}>
                <BsClock className="deadline-item__icon deadline-item__icon--upcoming" />
                <div className="deadline-item__info">
                  <div className="deadline-item__title">{t.title}</div>
                  <div className="deadline-item__date">
                    Due {t.dueDate && format(new Date(t.dueDate), 'MMM d, yyyy')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginBottom: '32px' }}>
        <div className="section-header">
          <h2 className="section-header__title">Recent Tasks</h2>
          <span className="section-header__subtitle">{allTasks.length} total</span>
        </div>
        {recentTasks.length > 0 ? (
          <div className="deadline-list">
            {recentTasks.map((t) => {
              const assignee = users.find((u) => u.id === t.assigneeId);
              return (
                <div className="deadline-item" key={t.id}>
                  <span className={`task-card__status task-card__status--${t.status}`} style={{ minWidth: '80px', textAlign: 'center' }}>
                    {t.status === 'in-progress' ? 'In Progress' : t.status}
                  </span>
                  <div className="deadline-item__info">
                    <div className="deadline-item__title">{t.title}</div>
                    <div className="deadline-item__date">
                      {assignee ? assignee.name : 'Unassigned'}
                      {t.dueDate && ` · Due ${format(new Date(t.dueDate), 'MMM d')}`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', padding: '20px 0' }}>
            No tasks yet. Head over to the Tasks page to create some!
          </p>
        )}
      </div>

      <div>
        <div className="section-header">
          <h2 className="section-header__title">Team Members</h2>
          <span className="section-header__subtitle">{users.length} members</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {users.map((u) => {
            const taskCount = allTasks.filter((t) => t.assigneeId === u.id).length;
            return (
              <div
                key={u.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 16px',
                }}
              >
                <div className="task-card__assignee-avatar" style={{ width: '32px', height: '32px', fontSize: '11px' }}>
                  {u.avatar}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{u.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
