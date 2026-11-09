import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AuthPages.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = 'Username is required';
    else if (form.username.length < 3) e.username = 'Username must be at least 3 characters';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
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
      await new Promise(r => setTimeout(r, 800));
      navigate('/character-select');
    } catch {
      setServerError('Registration failed. Please try again.');
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
          <h2>Join Dream Island</h2>
          <p>Create your account and start exploring</p>
        </div>

        {serverError && <div className="auth-error-banner">{serverError}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Username</label>
            <div className="input-wrapper">
              <span className="field-icon">👤</span>
              <input
                type="text"
                placeholder="Choose a username"
                value={form.username}
                onChange={onChange('username')}
                autoComplete="username"
              />
            </div>
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

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
                placeholder="At least 6 characters"
                value={form.password}
                onChange={onChange('password')}
                autoComplete="new-password"
              />
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="auth-field">
            <label>Confirm Password</label>
            <div className="input-wrapper">
              <span className="field-icon">🔒</span>
              <input
                type="password"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={onChange('confirmPassword')}
                autoComplete="new-password"
              />
            </div>
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? '⏳ Creating account...' : '🚀 Create Account'}
          </button>
        </form>

        <div className="auth-divider">or</div>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
}
