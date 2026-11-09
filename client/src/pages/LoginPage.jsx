import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AuthPages.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setLoading(true);
    setServerError('');
    try {
      // API call will be added in Phase 4
      // For now, simulate a brief delay and redirect
      await new Promise(r => setTimeout(r, 800));
      navigate('/character-select');
    } catch {
      setServerError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const onChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  return (
    <div className="auth-page">
      <Link to="/" className="auth-back">← Back to Home</Link>

      <div className="hero-bg-particles">
        <span className="hero-particle">🌴</span>
        <span className="hero-particle">✨</span>
        <span className="hero-particle">🐚</span>
        <span className="hero-particle">⭐</span>
        <span className="hero-particle">🌊</span>
        <span className="hero-particle">💎</span>
      </div>

      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-icon">🏝️</span>
          <h2>Welcome Back</h2>
          <p>Log in to continue your adventure</p>
        </div>

        {serverError && <div className="auth-error-banner">{serverError}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Email</label>
            <div className="input-wrapper">
              <span className="field-icon">📧</span>
              <input
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={onChange('email')}
                autoComplete="email"
              />
            </div>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="auth-field">
            <label>Password</label>
            <div className="input-wrapper">
              <span className="field-icon">🔒</span>
              <input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={onChange('password')}
                autoComplete="current-password"
              />
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? '⏳ Logging in...' : '🎮 Log In'}
          </button>
        </form>

        <div className="auth-divider">or</div>

        <div className="auth-footer">
          Don&apos;t have an account?{' '}
          <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
}
