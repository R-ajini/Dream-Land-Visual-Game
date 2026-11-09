import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, OrbitControls, Text } from '@react-three/drei';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import './GamePage.css';

/* ────────────────────────────────────────────
   3D Scene Components (starter island preview)
   ──────────────────────────────────────────── */

/** Simple ocean plane */
function Ocean() {
  const ref = useRef();

  useEffect(() => {
    // Gentle wave animation via vertex displacement
    const geo = ref.current.geometry;
    const pos = geo.attributes.position;
    const orig = Float32Array.from(pos.array);

    let frame;
    const animate = (t) => {
      for (let i = 0; i < pos.count; i++) {
        const x = orig[i * 3];
        const z = orig[i * 3 + 2];
        pos.array[i * 3 + 1] =
          Math.sin(x * 0.3 + t * 0.001) * 0.25 +
          Math.cos(z * 0.3 + t * 0.0012) * 0.2;
      }
      pos.needsUpdate = true;
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]}>
      <planeGeometry args={[200, 200, 80, 80]} />
      <meshStandardMaterial
        color="#3dc1c7"
        transparent
        opacity={0.85}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/** Island base — stacked cylinders for low-poly look */
function Island() {
  return (
    <group>
      {/* Sandy base */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[22, 25, 1, 32]} />
        <meshStandardMaterial color="#f5deb3" />
      </mesh>
      {/* Green top */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[18, 22, 0.5, 32]} />
        <meshStandardMaterial color="#7ec87a" />
      </mesh>
      {/* Mountain */}
      <mesh position={[-5, 2.5, -6]}>
        <coneGeometry args={[6, 7, 8]} />
        <meshStandardMaterial color="#8a9a5b" />
      </mesh>
      <mesh position={[-5, 5.8, -6]}>
        <coneGeometry args={[2.5, 3, 8]} />
        <meshStandardMaterial color="#b0b8a8" />
      </mesh>
      {/* Small hill */}
      <mesh position={[8, 1.2, -3]}>
        <coneGeometry args={[4, 3, 7]} />
        <meshStandardMaterial color="#6ab567" />
      </mesh>
    </group>
  );
}

/** Simple low-poly palm tree */
function PalmTree({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.15, 0.25, 4, 6]} />
        <meshStandardMaterial color="#8B6914" />
      </mesh>
      {/* Leaves */}
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.sin((angle * Math.PI) / 180) * 1,
            3.8,
            Math.cos((angle * Math.PI) / 180) * 1,
          ]}
          rotation={[0.5, (angle * Math.PI) / 180, 0.3]}
        >
          <coneGeometry args={[0.8, 2.5, 4]} />
          <meshStandardMaterial color="#3e8b37" />
        </mesh>
      ))}
    </group>
  );
}

/** Small rock */
function Rock({ position, scale = 1, color = '#888' }) {
  return (
    <mesh position={position} scale={scale}>
      <dodecahedronGeometry args={[0.6, 0]} />
      <meshStandardMaterial color={color} flatShading />
    </mesh>
  );
}

/** Collectible coin (spinning) */
function Coin({ position }) {
  const ref = useRef();
  useEffect(() => {
    let frame;
    const spin = () => {
      if (ref.current) ref.current.rotation.y += 0.03;
      frame = requestAnimationFrame(spin);
    };
    frame = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <mesh ref={ref} position={position}>
      <cylinderGeometry args={[0.35, 0.35, 0.08, 16]} />
      <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.2} />
    </mesh>
  );
}

/** Simple character placeholder */
function Character({ charType }) {
  const ref = useRef();
  useEffect(() => {
    let frame;
    const bob = (t) => {
      if (ref.current) {
        ref.current.position.y = 0.6 + Math.sin(t * 0.002) * 0.15;
      }
      frame = requestAnimationFrame(bob);
    };
    frame = requestAnimationFrame(bob);
    return () => cancelAnimationFrame(frame);
  }, []);

  const bodyColor = charType === 'boy' ? '#55C6C2' : '#FF8F87';
  return (
    <group ref={ref} position={[0, 0.6, 8]}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.35, 0.6, 8, 16]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.85, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#FDDCB5" />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.12, 0.9, 0.3]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#34495E" />
      </mesh>
      <mesh position={[0.12, 0.9, 0.3]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#34495E" />
      </mesh>
    </group>
  );
}

/* ────────────────────────────────────────────
   Main Game Page
   ──────────────────────────────────────────── */

export default function GamePage() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [character, setCharacter] = useState({ name: 'Explorer', type: 'girl' });

  // Load character from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dreamIslandCharacter');
      if (saved) setCharacter(JSON.parse(saved));
    } catch { /* use default */ }
  }, []);

  // Simulate loading
  useEffect(() => {
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 18 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(iv);
        setTimeout(() => setLoading(false), 500);
      }
      setProgress(Math.min(p, 100));
    }, 200);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="game-page">
      {/* Loading Screen */}
      {loading && (
        <div className={`game-loading${progress >= 100 ? ' fade-out' : ''}`}>
          <span className="game-loading-icon">🏝️</span>
          <h2>Entering Dream Island</h2>
          <p>Preparing your adventure...</p>
          <div className="game-loading-bar-track">
            <div
              className="game-loading-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <div className="game-canvas-container">
        <Canvas
          shadows
          camera={{ position: [0, 12, 25], fov: 50 }}
          gl={{ antialias: true }}
        >
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[15, 20, 10]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <hemisphereLight
            skyColor="#A8D8F0"
            groundColor="#8BCB88"
            intensity={0.4}
          />

          {/* Sky */}
          <Sky
            sunPosition={[100, 40, 100]}
            turbidity={8}
            rayleigh={2}
            mieCoefficient={0.005}
            mieDirectionalG={0.8}
          />

          {/* Environment */}
          <Ocean />
          <Island />

          {/* Trees */}
          <PalmTree position={[6, 0.4, 5]} scale={0.9} />
          <PalmTree position={[10, 0.4, 1]} scale={1.1} />
          <PalmTree position={[3, 0.4, 10]} />
          <PalmTree position={[-8, 0.4, 7]} scale={0.8} />
          <PalmTree position={[-12, 0.4, 2]} scale={1.05} />
          <PalmTree position={[14, 0.4, -5]} scale={0.75} />
          <PalmTree position={[-3, 0.4, -10]} scale={0.95} />

          {/* Rocks */}
          <Rock position={[12, 0.3, 8]} scale={1.2} color="#9e9e9e" />
          <Rock position={[-10, 0.3, 10]} scale={0.8} color="#aaa" />
          <Rock position={[15, 0.3, -2]} scale={1.5} color="#888" />
          <Rock position={[-6, 0.3, -12]} scale={1} color="#999" />

          {/* Coins */}
          <Coin position={[4, 1, 7]} />
          <Coin position={[8, 1, 4]} />
          <Coin position={[-5, 1, 5]} />

          {/* Character */}
          <Character charType={character.type} />

          {/* Controls */}
          <OrbitControls
            enablePan={false}
            minDistance={8}
            maxDistance={40}
            maxPolarAngle={Math.PI / 2.2}
            target={[0, 1, 0]}
          />
        </Canvas>
      </div>

      {/* HUD */}
      {!loading && (
        <div className="game-hud">
          {/* Top bar */}
          <div className="hud-top">
            <div className="hud-player-info">
              <div className="hud-player-avatar">
                {character.type === 'girl' ? '👧' : '👦'}
              </div>
              <span className="hud-player-name">{character.name || 'Explorer'}</span>
              <span className="hud-score">⭐ 0</span>
            </div>
            <div className="hud-actions">
              <Link to="/" className="hud-btn" title="Back to Home">🏠</Link>
              <button className="hud-btn" title="Inventory">🎒</button>
              <button className="hud-btn" title="Settings">⚙️</button>
            </div>
          </div>

          {/* Mission tracker */}
          <div className="hud-mission">
            <div className="hud-mission-label">📋 Active Mission</div>
            <div className="hud-mission-title">Beach Explorer</div>
            <p style={{ fontSize: '0.7rem', opacity: 0.7, marginBottom: 6 }}>
              Find 5 seashells along the shore
            </p>
            <div className="hud-mission-progress">
              <div className="hud-mission-bar-track">
                <div className="hud-mission-bar-fill" style={{ width: '0%' }} />
              </div>
              <span className="hud-mission-count">0 / 5</span>
            </div>
          </div>

          {/* Controls hint */}
          <div className="hud-bottom">
            <div className="hud-control">
              <span className="hud-key">W</span>
              <span className="hud-key">A</span>
              <span className="hud-key">S</span>
              <span className="hud-key">D</span>
              Move
            </div>
            <div className="hud-control">
              <span className="hud-key">SPACE</span> Jump
            </div>
            <div className="hud-control">
              <span className="hud-key">SHIFT</span> Run
            </div>
            <div className="hud-control">
              <span className="hud-key">E</span> Interact
            </div>
            <div className="hud-control">
              🖱️ Camera
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
