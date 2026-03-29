import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { FiPlus } from 'react-icons/fi';
import { HiOutlineTrash, HiOutlineXMark } from 'react-icons/hi2';

export default function TeamPage() {
  const { users, currentUser, addMember, removeMember, isAdmin } = useAuth();
  const { allTasks } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Member');
  const [error, setError] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required');
      return;
    }
    const result = addMember(name, email, role);
    if (result.success) {
      setName('');
      setEmail('');
      setRole('Member');
      setShowForm(false);
    } else {
      setError(result.error);
    }
  };

  return (
    <>
      <div className="section-header">
        <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Team</h1>
        {isAdmin && (
          <button className="btn btn--primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? <HiOutlineXMark /> : <FiPlus />}
            {showForm ? 'Cancel' : 'Add Member'}
          </button>
        )}
      </div>

      {showForm && (
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            marginBottom: '24px',
            animation: 'fadeInUp 0.3s ease',
          }}
        >
          {error && (
            <div className="auth-card__error" style={{ marginBottom: '16px' }}>{error}</div>
          )}
          <form onSubmit={handleAdd}>
            <div className="form-row--three" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-group__label" htmlFor="member-name">Name</label>
                <input
                  id="member-name"
                  className="form-group__input"
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-group__label" htmlFor="member-email">Email</label>
                <input
                  id="member-email"
                  className="form-group__input"
                  type="email"
                  placeholder="email@team.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-group__label" htmlFor="member-role">Role</label>
                <select
                  id="member-role"
                  className="form-group__select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="Member">Member</option>
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn--primary">Add to Team</button>
            </div>
          </form>
        </div>
      )}

      <div className="team-grid">
        {users.map((u) => {
          const taskCount = allTasks.filter((t) => t.assigneeId === u.id).length;
          const isSelf = u.id === currentUser?.id;
          return (
            <div className="team-card" key={u.id}>
              {isAdmin && !isSelf && (
                <button
                  className="team-card__remove"
                  onClick={() => removeMember(u.id)}
                  aria-label={`Remove ${u.name}`}
                >
                  <HiOutlineTrash />
                </button>
              )}
              <div className="team-card__avatar">{u.avatar}</div>
              <div className="team-card__name">
                {u.name} {isSelf && <span style={{ fontSize: '12px', color: 'var(--primary-400)' }}>(You)</span>}
              </div>
              <div className="team-card__role">{u.role}</div>
              <div className="team-card__email">{u.email}</div>
              <div className="team-card__task-count">
                {taskCount} {taskCount === 1 ? 'task' : 'tasks'} assigned
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
