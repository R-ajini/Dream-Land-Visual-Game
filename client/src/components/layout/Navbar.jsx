import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo">
            <span className="navbar-logo-icon">🏝️</span>
            <span className="navbar-logo-text">Dream Island</span>
          </Link>

          <div className="navbar-links">
            <button className="navbar-link" onClick={() => scrollTo('home')}>Home</button>
            <button className="navbar-link" onClick={() => scrollTo('how-to-play')}>How to Play</button>
            <button className="navbar-link" onClick={() => scrollTo('features')}>Features</button>
            <button className="navbar-link" onClick={() => scrollTo('leaderboard')}>Leaderboard</button>
          </div>

          <div className="navbar-actions">
            <Link to="/login" className="navbar-btn-login">Log In</Link>
            <Link to="/register" className="navbar-btn-register">Register</Link>
            <Link to="/character-select" className="navbar-btn-play">✨ Play Now</Link>
          </div>

          <button
            className={`navbar-hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`navbar-mobile-menu${menuOpen ? ' open' : ''}`}>
        <button className="navbar-link" onClick={() => scrollTo('home')}>Home</button>
        <button className="navbar-link" onClick={() => scrollTo('how-to-play')}>How to Play</button>
        <button className="navbar-link" onClick={() => scrollTo('features')}>Features</button>
        <button className="navbar-link" onClick={() => scrollTo('leaderboard')}>Leaderboard</button>
        <div className="navbar-actions">
          <Link to="/login" className="navbar-btn-login" onClick={() => setMenuOpen(false)}>Log In</Link>
          <Link to="/register" className="navbar-btn-register" onClick={() => setMenuOpen(false)}>Register</Link>
          <Link to="/character-select" className="navbar-btn-play" onClick={() => setMenuOpen(false)}>✨ Play Now</Link>
        </div>
      </div>
    </>
  );
}
