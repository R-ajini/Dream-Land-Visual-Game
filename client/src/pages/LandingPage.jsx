import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import './LandingPage.css';

const steps = [
  { emoji: '🎮', title: 'Create Your Character', desc: 'Choose your adventurer and customize their unique appearance.' },
  { emoji: '🏝️', title: 'Explore the Island', desc: 'Discover beaches, forests, caves, and hidden locations.' },
  { emoji: '💎', title: 'Collect Treasures', desc: 'Find coins, gems, seashells, and treasure chests.' },
  { emoji: '🏆', title: 'Complete Missions', desc: 'Take on challenges and climb the leaderboard.' },
];

const features = [
  { emoji: '🗺️', title: 'Beautiful 3D World', desc: 'Explore a stunning low-poly tropical island rendered entirely in your browser.' },
  { emoji: '👤', title: 'Character Customization', desc: 'Create your unique adventurer — choose hairstyle, outfit, and colours.' },
  { emoji: '💎', title: 'Treasure Collection', desc: 'Discover hidden coins, gems, shells, and treasure chests across the island.' },
  { emoji: '📋', title: 'Mission System', desc: 'Complete exciting exploration challenges and earn big rewards.' },
  { emoji: '🏆', title: 'Achievements', desc: 'Unlock badges, track your progress, and showcase your accomplishments.' },
  { emoji: '📊', title: 'Online Leaderboard', desc: 'Compete with players worldwide and prove you\'re the ultimate explorer.' },
];

const locations = [
  { emoji: '🏖️', name: 'Sunny Beach', desc: 'Warm sands and rolling waves' },
  { emoji: '🌺', name: 'Flower Garden', desc: 'A colourful paradise of blossoms' },
  { emoji: '💎', name: 'Crystal Cave', desc: 'Sparkling gems in the deep' },
  { emoji: '💧', name: 'Hidden Waterfall', desc: 'A secret cascade in the jungle' },
  { emoji: '⛰️', name: 'Mountain Viewpoint', desc: 'See the whole island from above' },
  { emoji: '🌲', name: 'Treasure Forest', desc: 'Ancient woods full of secrets' },
];

const leaderboard = [
  { rank: '🥇', name: 'IslandMaster', score: '2,450', bg: 'linear-gradient(135deg,#55C6C2,#8BCB88)' },
  { rank: '🥈', name: 'TreasureHunter', score: '2,100', bg: 'linear-gradient(135deg,#A8D8F0,#7BC0E0)' },
  { rank: '🥉', name: 'BeachExplorer', score: '1,800', bg: 'linear-gradient(135deg,#FFB347,#FFD93D)' },
  { rank: '4', name: 'CoralDiver', score: '1,500', bg: 'linear-gradient(135deg,#FF8F87,#FFB3AD)' },
  { rank: '5', name: 'ShellSeeker', score: '1,200', bg: 'linear-gradient(135deg,#8BCB88,#A8DCA6)' },
];

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Navbar />

      {/* ── Hero ── */}
      <section className="hero" id="home">
        <div className="hero-bg-particles">
          <span className="hero-particle">🌴</span>
          <span className="hero-particle">✨</span>
          <span className="hero-particle">🐚</span>
          <span className="hero-particle">⭐</span>
          <span className="hero-particle">🌊</span>
          <span className="hero-particle">🌺</span>
          <span className="hero-particle">💎</span>
          <span className="hero-particle">🦀</span>
          <span className="hero-particle">🌙</span>
          <span className="hero-particle">🐠</span>
        </div>

        <div className="hero-content">
          <span className="hero-badge">🌟 A New Adventure Awaits</span>
          <h1>
            Welcome to<br />
            <span className="highlight">Dream Island</span>
          </h1>
          <p className="hero-subtitle">
            Discover a magical island, explore hidden places, collect treasures,
            and create your own adventure.
          </p>
          <div className="hero-actions">
            <Link to="/character-select" className="hero-btn-play">
              ✨ Play Now
            </Link>
            <a href="#how-to-play" className="hero-btn-learn">
              Learn More
            </a>
          </div>
        </div>

        <div className="hero-wave">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0,50 C320,80 640,20 960,50 C1120,65 1320,35 1440,45 L1440,80 L0,80 Z" fill="var(--color-cream)" />
          </svg>
        </div>
      </section>

      {/* ── How to Play ── */}
      <section className="landing-section how-to-play" id="how-to-play">
        <div className="container">
          <div className="landing-section-title">
            <h2>How to Play</h2>
            <div className="underline-bar" />
            <p>Your adventure in four simple steps</p>
          </div>
          <div className="steps-grid">
            {steps.map((s, i) => (
              <div className="step-card" key={i}>
                <span className="step-number">{i + 1}</span>
                <div className="step-icon">{s.emoji}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="landing-section features-section" id="features">
        <div className="container">
          <div className="landing-section-title">
            <h2>Game Features</h2>
            <div className="underline-bar" />
            <p>Everything that makes Dream Island special</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div className="feature-card" key={i}>
                <span className="feature-emoji">{f.emoji}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Island Preview ── */}
      <section className="landing-section island-preview" id="island-preview">
        <div className="container">
          <div className="landing-section-title">
            <h2>Discover the Island</h2>
            <div className="underline-bar" />
            <p>Six magical locations await your exploration</p>
          </div>
          <div className="locations-grid">
            {locations.map((loc, i) => (
              <div className="location-card" key={i}>
                <div className="location-card-content">
                  <span className="emoji">{loc.emoji}</span>
                  <h3>{loc.name}</h3>
                  <p>{loc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Leaderboard Preview ── */}
      <section className="landing-section leaderboard-preview" id="leaderboard">
        <div className="container">
          <div className="landing-section-title">
            <h2>Top Explorers</h2>
            <div className="underline-bar" />
            <p>See who's leading the adventure</p>
          </div>

          <div className="leaderboard-card">
            {leaderboard.map((p, i) => (
              <div className="leaderboard-row" key={i}>
                <span className="leaderboard-rank">{p.rank}</span>
                <div className="leaderboard-avatar" style={{ background: p.bg }}>
                  {p.name.charAt(0)}
                </div>
                <span className="leaderboard-name">{p.name}</span>
                <span className="leaderboard-score">{p.score} pts</span>
              </div>
            ))}

            <div className="leaderboard-footer">
              <p>Join the adventure and climb the ranks!</p>
              <Link to="/register" className="btn btn-primary">
                Sign Up Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <h2>Ready to Start Your Adventure?</h2>
        <p>Create your character, explore Dream Island, and become the ultimate explorer.</p>
        <Link to="/character-select" className="hero-btn-play">
          ✨ Play Now
        </Link>
      </section>

      <Footer />
    </div>
  );
}
