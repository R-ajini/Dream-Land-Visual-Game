import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CharacterSelectPage.css';

const CHARACTER_TYPES = [
  { id: 'girl', emoji: '👧', label: 'Girl' },
  { id: 'boy', emoji: '👦', label: 'Boy' },
];

const HAIRSTYLES = [
  { id: 'short', label: 'Short' },
  { id: 'long', label: 'Long' },
  { id: 'curly', label: 'Curly' },
  { id: 'ponytail', label: 'Ponytail' },
  { id: 'spiky', label: 'Spiky' },
];

const HAIR_COLORS = [
  { id: 'brown', color: '#8B4513' },
  { id: 'black', color: '#1a1a2e' },
  { id: 'blonde', color: '#F4D03F' },
  { id: 'red', color: '#E74C3C' },
  { id: 'pink', color: '#FF8F87' },
  { id: 'blue', color: '#55C6C2' },
  { id: 'purple', color: '#9B59B6' },
  { id: 'white', color: '#ECF0F1' },
];

const OUTFITS = [
  { id: 'explorer', label: 'Explorer' },
  { id: 'pirate', label: 'Pirate' },
  { id: 'islander', label: 'Islander' },
  { id: 'adventurer', label: 'Adventurer' },
];

const OUTFIT_COLORS = [
  { id: 'turquoise', color: '#55C6C2' },
  { id: 'coral', color: '#FF8F87' },
  { id: 'green', color: '#8BCB88' },
  { id: 'gold', color: '#FFD93D' },
  { id: 'sky', color: '#A8D8F0' },
  { id: 'purple', color: '#9B59B6' },
  { id: 'navy', color: '#34495E' },
  { id: 'orange', color: '#FFB347' },
];

export default function CharacterSelectPage() {
  const navigate = useNavigate();
  const [charName, setCharName] = useState('');
  const [charType, setCharType] = useState('girl');
  const [hairStyle, setHairStyle] = useState('short');
  const [hairColor, setHairColor] = useState('brown');
  const [outfit, setOutfit] = useState('explorer');
  const [outfitColor, setOutfitColor] = useState('turquoise');

  const currentType = CHARACTER_TYPES.find(t => t.id === charType);

  const handleConfirm = () => {
    const character = {
      name: charName || 'Explorer',
      type: charType,
      hairStyle,
      hairColor,
      outfit,
      outfitColor,
    };
    // In Phase 4, this will save to the backend.
    // For now, store in localStorage so Phase 2 can use it.
    localStorage.setItem('dreamIslandCharacter', JSON.stringify(character));
    navigate('/game');
  };

  return (
    <div className="char-select-page">
      <Link to="/" className="char-back">← Back to Home</Link>

      <div className="hero-bg-particles">
        <span className="hero-particle">🌴</span>
        <span className="hero-particle">✨</span>
        <span className="hero-particle">🐚</span>
        <span className="hero-particle">⭐</span>
      </div>

      <div className="char-select-header">
        <h1>Create Your Character</h1>
        <p>Customize your adventurer before entering Dream Island</p>
      </div>

      <div className="char-select-container">
        {/* ── Preview Panel ── */}
        <div className="char-preview-panel">
          <div className="char-preview-stage">
            <span className="char-preview-avatar">{currentType?.emoji}</span>
          </div>
          <div className="char-preview-name">
            {charName || 'Your Explorer'}
          </div>
          <div className="char-preview-type">
            {currentType?.label} · {OUTFITS.find(o => o.id === outfit)?.label}
          </div>
        </div>

        {/* ── Options Panel ── */}
        <div className="char-options-panel">
          {/* Character Name */}
          <div className="char-option-group">
            <label>Character Name</label>
            <input
              type="text"
              placeholder="Enter a name..."
              value={charName}
              onChange={(e) => setCharName(e.target.value)}
              maxLength={20}
            />
          </div>

          {/* Character Type */}
          <div className="char-option-group">
            <label>Character Type</label>
            <div className="char-type-options">
              {CHARACTER_TYPES.map(t => (
                <button
                  key={t.id}
                  className={`char-type-btn${charType === t.id ? ' active' : ''}`}
                  onClick={() => setCharType(t.id)}
                >
                  <span className="emoji">{t.emoji}</span>
                  <span className="label">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hairstyle */}
          <div className="char-option-group">
            <label>Hairstyle</label>
            <div className="char-style-options">
              {HAIRSTYLES.map(h => (
                <button
                  key={h.id}
                  className={`char-style-btn${hairStyle === h.id ? ' active' : ''}`}
                  onClick={() => setHairStyle(h.id)}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hair Colour */}
          <div className="char-option-group">
            <label>Hair Colour</label>
            <div className="char-color-options">
              {HAIR_COLORS.map(c => (
                <button
                  key={c.id}
                  className={`char-color-swatch${hairColor === c.id ? ' active' : ''}`}
                  style={{ background: c.color }}
                  onClick={() => setHairColor(c.id)}
                  title={c.id}
                />
              ))}
            </div>
          </div>

          {/* Outfit */}
          <div className="char-option-group">
            <label>Outfit</label>
            <div className="char-style-options">
              {OUTFITS.map(o => (
                <button
                  key={o.id}
                  className={`char-style-btn${outfit === o.id ? ' active' : ''}`}
                  onClick={() => setOutfit(o.id)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Outfit Colour */}
          <div className="char-option-group">
            <label>Outfit Colour</label>
            <div className="char-color-options">
              {OUTFIT_COLORS.map(c => (
                <button
                  key={c.id}
                  className={`char-color-swatch${outfitColor === c.id ? ' active' : ''}`}
                  style={{ background: c.color }}
                  onClick={() => setOutfitColor(c.id)}
                  title={c.id}
                />
              ))}
            </div>
          </div>

          {/* Confirm */}
          <button className="char-confirm-btn" onClick={handleConfirm}>
            ✨ Start Adventure
          </button>
        </div>
      </div>
    </div>
  );
}
