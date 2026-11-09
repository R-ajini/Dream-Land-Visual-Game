import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-wave">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path
            d="M0,20 C360,60 720,0 1080,40 C1260,55 1380,25 1440,30 L1440,0 L0,0 Z"
            fill="#0d1f33"
            opacity="0.3"
          />
          <path
            d="M0,30 C240,5 480,50 720,25 C960,0 1200,45 1440,20 L1440,0 L0,0 Z"
            fill="var(--color-cream)"
          />
        </svg>
      </div>

      <div className="footer-content">
        <div className="footer-brand">
          <h3>🏝️ Dream Island</h3>
          <p className="tagline">Explore. Discover. Collect. Dream.</p>
          <p>
            A magical tropical island adventure where you can discover hidden places,
            collect treasures, and create your own story. Begin your journey today.
          </p>
        </div>

        <div className="footer-column">
          <h4>Game</h4>
          <ul>
            <li><Link to="/character-select">▸ Play Now</Link></li>
            <li><a href="#features">▸ Features</a></li>
            <li><a href="#leaderboard">▸ Leaderboard</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Account</h4>
          <ul>
            <li><Link to="/login">▸ Log In</Link></li>
            <li><Link to="/register">▸ Register</Link></li>
            <li><Link to="/profile">▸ Profile</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>About</h4>
          <ul>
            <li><a href="#home">▸ Story</a></li>
            <li><a href="#how-to-play">▸ How to Play</a></li>
            <li><a href="#features">▸ Credits</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Dream Island. Made with ❤️ for adventurers.</p>
        <div className="footer-socials">
          <span className="footer-social-icon" title="GitHub">🔗</span>
          <span className="footer-social-icon" title="Twitter">🐦</span>
          <span className="footer-social-icon" title="Discord">💬</span>
        </div>
      </div>
    </footer>
  );
}
