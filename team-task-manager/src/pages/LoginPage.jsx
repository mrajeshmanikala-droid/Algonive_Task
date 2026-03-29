import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TbSubtask } from 'react-icons/tb';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    const result = login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__brand">
          <div className="auth-card__logo">
            <TbSubtask />
          </div>
          <span className="auth-card__app-name">TeamFlow</span>
        </div>
        <p className="auth-card__subtitle">Sign in to manage your team's tasks</p>

        {error && <div className="auth-card__error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-group__label" htmlFor="login-email">Email</label>
            <input
              id="login-email"
              className="form-group__input"
              type="email"
              placeholder="you@team.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-group__label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              className="form-group__input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn--primary btn--block btn--lg">
            Sign In
          </button>
        </form>

        <p className="auth-card__footer">
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </p>

        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
          Demo: alice@team.com / pass123
        </p>
      </div>
    </div>
  );
}
