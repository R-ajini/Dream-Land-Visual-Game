import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sky, Html } from '@react-three/drei';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { useKeyboard } from '../hooks/useKeyboard';
import './GamePage.css';

/* ═══════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════ */
const WALK_SPEED = 5;
const RUN_SPEED = 10;
const JUMP_FORCE = 8;
const GRAVITY = -20;
const ISLAND_RADIUS = 21;
const GROUND_Y = 0.6;
const COLLECT_DISTANCE = 2.0;

/* ═══════════════════════════════════════════
   Collectible Data
   ═══════════════════════════════════════════ */
const INITIAL_COLLECTIBLES = [
  // Coins (5 pts)
  { id: 'coin1', type: 'coin', name: 'Gold Coin', points: 5, pos: [4, 1, 7], color: '#FFD700' },
  { id: 'coin2', type: 'coin', name: 'Gold Coin', points: 5, pos: [8, 1, 4], color: '#FFD700' },
  { id: 'coin3', type: 'coin', name: 'Gold Coin', points: 5, pos: [-5, 1, 5], color: '#FFD700' },
  { id: 'coin4', type: 'coin', name: 'Gold Coin', points: 5, pos: [13, 1, -1], color: '#FFD700' },
  { id: 'coin5', type: 'coin', name: 'Gold Coin', points: 5, pos: [-10, 1, -3], color: '#FFD700' },
  { id: 'coin6', type: 'coin', name: 'Silver Coin', points: 5, pos: [0, 1, 12], color: '#C0C0C0' },
  // Seashells (10 pts)
  { id: 'shell1', type: 'seashell', name: 'Pink Seashell', points: 10, pos: [16, 0.7, 6], color: '#FF8F87' },
  { id: 'shell2', type: 'seashell', name: 'Conch Shell', points: 10, pos: [18, 0.7, -2], color: '#FFB3AD' },
  { id: 'shell3', type: 'seashell', name: 'Starfish Shell', points: 10, pos: [14, 0.7, 10], color: '#FF6B81' },
  { id: 'shell4', type: 'seashell', name: 'Pink Seashell', points: 10, pos: [-14, 0.7, 5], color: '#FF8F87' },
  { id: 'shell5', type: 'seashell', name: 'Conch Shell', points: 10, pos: [-8, 0.7, 12], color: '#FFB3AD' },
  // Gems (20 pts)
  { id: 'gem1', type: 'gem', name: 'Emerald', points: 20, pos: [-3, 1.2, -8], color: '#2ECC71' },
  { id: 'gem2', type: 'gem', name: 'Ruby', points: 20, pos: [5, 1.2, -6], color: '#E74C3C' },
  { id: 'gem3', type: 'gem', name: 'Sapphire', points: 20, pos: [-12, 1.2, -6], color: '#3498DB' },
  // Treasure Chest (50 pts)
  { id: 'chest1', type: 'chest', name: 'Treasure Chest', points: 50, pos: [-7, 0.8, -14], color: '#8B4513' },
];

/* ═══════════════════════════════════════════
   3D Components
   ═══════════════════════════════════════════ */

function Ocean() {
  const ref = useRef();
  const posArray = useRef(null);

  useEffect(() => {
    posArray.current = Float32Array.from(ref.current.geometry.attributes.position.array);
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pos = ref.current.geometry.attributes.position;
    const orig = posArray.current;
    if (!orig) return;
    for (let i = 0; i < pos.count; i++) {
      const x = orig[i * 3];
      const z = orig[i * 3 + 2];
      pos.array[i * 3 + 1] = Math.sin(x * 0.3 + t) * 0.25 + Math.cos(z * 0.3 + t * 1.2) * 0.2;
    }
    pos.needsUpdate = true;
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]}>
      <planeGeometry args={[200, 200, 80, 80]} />
      <meshStandardMaterial color="#3dc1c7" transparent opacity={0.85} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Island() {
  return (
    <group>
      <mesh position={[0, -0.2, 0]}><cylinderGeometry args={[22, 25, 1, 32]} /><meshStandardMaterial color="#f5deb3" /></mesh>
      <mesh position={[0, 0.35, 0]}><cylinderGeometry args={[18, 22, 0.5, 32]} /><meshStandardMaterial color="#7ec87a" /></mesh>
      <mesh position={[-5, 2.5, -6]}><coneGeometry args={[6, 7, 8]} /><meshStandardMaterial color="#8a9a5b" /></mesh>
      <mesh position={[-5, 5.8, -6]}><coneGeometry args={[2.5, 3, 8]} /><meshStandardMaterial color="#b0b8a8" /></mesh>
      <mesh position={[8, 1.2, -3]}><coneGeometry args={[4, 3, 7]} /><meshStandardMaterial color="#6ab567" /></mesh>
    </group>
  );
}

function PalmTree({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 2, 0]}><cylinderGeometry args={[0.15, 0.25, 4, 6]} /><meshStandardMaterial color="#8B6914" /></mesh>
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <mesh key={i} position={[Math.sin((angle * Math.PI) / 180) * 1, 3.8, Math.cos((angle * Math.PI) / 180) * 1]} rotation={[0.5, (angle * Math.PI) / 180, 0.3]}>
          <coneGeometry args={[0.8, 2.5, 4]} /><meshStandardMaterial color="#3e8b37" />
        </mesh>
      ))}
    </group>
  );
}

function Rock({ position, scale = 1, color = '#888' }) {
  return <mesh position={position} scale={scale}><dodecahedronGeometry args={[0.6, 0]} /><meshStandardMaterial color={color} flatShading /></mesh>;
}

/* ═══════════════════════════════════════════
   Collectible Item Component
   ═══════════════════════════════════════════ */

function CollectibleItem({ item, playerPos, onCollect }) {
  const ref = useRef();
  const glowRef = useRef();
  const [nearby, setNearby] = useState(false);
  const [collecting, setCollecting] = useState(false);

  useFrame(({ clock }, delta) => {
    if (!ref.current || collecting) return;
    const t = clock.getElapsedTime();

    // Spin
    ref.current.rotation.y += delta * 2;

    // Float up and down
    ref.current.position.y = item.pos[1] + Math.sin(t * 2 + item.pos[0]) * 0.15;

    // Check distance to player
    const dx = playerPos.current[0] - item.pos[0];
    const dz = playerPos.current[2] - item.pos[2];
    const dist = Math.sqrt(dx * dx + dz * dz);
    setNearby(dist < COLLECT_DISTANCE);

    // Glow pulse when nearby
    if (glowRef.current) {
      const scale = nearby ? 1.3 + Math.sin(t * 4) * 0.2 : 1;
      glowRef.current.scale.setScalar(scale);
    }
  });

  // Listen for E key press when nearby
  useEffect(() => {
    if (!nearby) return;
    const onKey = (e) => {
      if (e.key.toLowerCase() === 'e' && nearby && !collecting) {
        setCollecting(true);
        onCollect(item);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [nearby, collecting, item, onCollect]);

  if (collecting) return null;

  // Render different shapes based on type
  return (
    <group ref={ref} position={[item.pos[0], item.pos[1], item.pos[2]]}>
      {/* Glow ring underneath */}
      <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]}>
        <ringGeometry args={[0.3, 0.6, 16]} />
        <meshBasicMaterial color={item.color} transparent opacity={nearby ? 0.5 : 0.15} />
      </mesh>

      {item.type === 'coin' && (
        <mesh><cylinderGeometry args={[0.35, 0.35, 0.08, 16]} /><meshStandardMaterial color={item.color} metalness={0.7} roughness={0.2} /></mesh>
      )}

      {item.type === 'seashell' && (
        <mesh><sphereGeometry args={[0.3, 8, 6]} /><meshStandardMaterial color={item.color} flatShading /></mesh>
      )}

      {item.type === 'gem' && (
        <mesh><octahedronGeometry args={[0.3, 0]} /><meshStandardMaterial color={item.color} metalness={0.5} roughness={0.1} /></mesh>
      )}

      {item.type === 'chest' && (
        <group>
          <mesh><boxGeometry args={[0.7, 0.5, 0.5]} /><meshStandardMaterial color={item.color} /></mesh>
          <mesh position={[0, 0.25, 0]}><boxGeometry args={[0.72, 0.1, 0.52]} /><meshStandardMaterial color="#A0522D" /></mesh>
          <mesh position={[0, 0.05, 0.26]}><boxGeometry args={[0.15, 0.15, 0.05]} /><meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} /></mesh>
        </group>
      )}

      {/* Interaction prompt */}
      {nearby && (
        <Html position={[0, 1.2, 0]} center>
          <div className="collect-prompt">
            <span className="collect-key">E</span> Collect
          </div>
        </Html>
      )}
    </group>
  );
}

/* ═══════════════════════════════════════════
   Player Character with WASD Movement
   ═══════════════════════════════════════════ */

function Player({ charType, onPositionUpdate }) {
  const group = useRef();
  const keys = useKeyboard();
  const velocity = useRef(new THREE.Vector3());
  const isGrounded = useRef(true);
  const { camera } = useThree();
  const moveDir = useMemo(() => new THREE.Vector3(), []);
  const frontVec = useMemo(() => new THREE.Vector3(), []);
  const sideVec = useMemo(() => new THREE.Vector3(), []);
  const camDir = useMemo(() => new THREE.Vector3(), []);
  const upVec = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  const bodyColor = charType === 'boy' ? '#55C6C2' : '#FF8F87';
  const leftArm = useRef(), rightArm = useRef(), leftLeg = useRef(), rightLeg = useRef();

  useFrame((state, delta) => {
    if (!group.current) return;
    const k = keys.current;
    const isRunning = k.has('shift');
    const speed = isRunning ? RUN_SPEED : WALK_SPEED;

    camera.getWorldDirection(camDir);
    camDir.y = 0;
    camDir.normalize();

    const forward = (k.has('w') ? 1 : 0) - (k.has('s') ? 1 : 0);
    const right = (k.has('d') ? 1 : 0) - (k.has('a') ? 1 : 0);

    frontVec.copy(camDir).multiplyScalar(forward);
    sideVec.crossVectors(camDir, upVec).multiplyScalar(right);
    moveDir.addVectors(frontVec, sideVec);
    const isMoving = moveDir.lengthSq() > 0.001;
    if (isMoving) moveDir.normalize();

    if (isMoving) {
      velocity.current.x = moveDir.x * speed;
      velocity.current.z = moveDir.z * speed;
      const targetAngle = Math.atan2(moveDir.x, moveDir.z);
      let diff = targetAngle - group.current.rotation.y;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      group.current.rotation.y += diff * 10 * delta;
    } else {
      velocity.current.x = 0;
      velocity.current.z = 0;
    }

    if (k.has(' ') && isGrounded.current) {
      velocity.current.y = JUMP_FORCE;
      isGrounded.current = false;
    }

    velocity.current.y += GRAVITY * delta;
    const pos = group.current.position;
    pos.x += velocity.current.x * delta;
    pos.y += velocity.current.y * delta;
    pos.z += velocity.current.z * delta;

    if (pos.y <= GROUND_Y) { pos.y = GROUND_Y; velocity.current.y = 0; isGrounded.current = true; }

    const distFromCenter = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
    if (distFromCenter > ISLAND_RADIUS) {
      const a = Math.atan2(pos.z, pos.x);
      pos.x = Math.cos(a) * ISLAND_RADIUS;
      pos.z = Math.sin(a) * ISLAND_RADIUS;
      velocity.current.x = 0;
      velocity.current.z = 0;
    }

    const limbSpeed = isRunning ? 12 : 7;
    const limbAmp = isRunning ? 0.6 : 0.35;
    const t = state.clock.getElapsedTime();
    if (isMoving) {
      const s = Math.sin(t * limbSpeed) * limbAmp;
      if (leftArm.current) leftArm.current.rotation.x = s;
      if (rightArm.current) rightArm.current.rotation.x = -s;
      if (leftLeg.current) leftLeg.current.rotation.x = -s;
      if (rightLeg.current) rightLeg.current.rotation.x = s;
    } else {
      [leftArm, rightArm, leftLeg, rightLeg].forEach(r => { if (r.current) r.current.rotation.x *= 0.85; });
    }

    if (onPositionUpdate) onPositionUpdate(pos.x, pos.y, pos.z);
  });

  return (
    <group ref={group} position={[0, GROUND_Y, 8]}>
      <mesh><capsuleGeometry args={[0.35, 0.6, 8, 16]} /><meshStandardMaterial color={bodyColor} /></mesh>
      <mesh position={[0, 0.85, 0]}><sphereGeometry args={[0.35, 16, 16]} /><meshStandardMaterial color="#FDDCB5" /></mesh>
      <mesh position={[-0.12, 0.9, 0.3]}><sphereGeometry args={[0.05, 8, 8]} /><meshStandardMaterial color="#34495E" /></mesh>
      <mesh position={[0.12, 0.9, 0.3]}><sphereGeometry args={[0.05, 8, 8]} /><meshStandardMaterial color="#34495E" /></mesh>
      <group ref={leftArm} position={[-0.5, 0.2, 0]}><mesh position={[0, -0.25, 0]}><capsuleGeometry args={[0.1, 0.3, 4, 8]} /><meshStandardMaterial color={bodyColor} /></mesh></group>
      <group ref={rightArm} position={[0.5, 0.2, 0]}><mesh position={[0, -0.25, 0]}><capsuleGeometry args={[0.1, 0.3, 4, 8]} /><meshStandardMaterial color={bodyColor} /></mesh></group>
      <group ref={leftLeg} position={[-0.18, -0.55, 0]}><mesh position={[0, -0.25, 0]}><capsuleGeometry args={[0.12, 0.3, 4, 8]} /><meshStandardMaterial color="#5b4a3f" /></mesh></group>
      <group ref={rightLeg} position={[0.18, -0.55, 0]}><mesh position={[0, -0.25, 0]}><capsuleGeometry args={[0.12, 0.3, 4, 8]} /><meshStandardMaterial color="#5b4a3f" /></mesh></group>
    </group>
  );
}

/* ═══════════════════════════════════════════
   Third-Person Camera
   ═══════════════════════════════════════════ */

function ThirdPersonCamera({ playerPos }) {
  const { camera } = useThree();
  const currentOffset = useRef(new THREE.Vector3(0, 6, 12));
  const currentLookAt = useRef(new THREE.Vector3());
  const angle = useRef(0);
  const isMouseDown = useRef(false);

  useEffect(() => {
    const onDown = (e) => { if (e.button === 0 || e.button === 2) isMouseDown.current = true; };
    const onUp = () => { isMouseDown.current = false; };
    const onMove = (e) => { if (isMouseDown.current) angle.current -= e.movementX * 0.005; };
    const onCtx = (e) => e.preventDefault();
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('contextmenu', onCtx);
    return () => { window.removeEventListener('mousedown', onDown); window.removeEventListener('mouseup', onUp); window.removeEventListener('mousemove', onMove); window.removeEventListener('contextmenu', onCtx); };
  }, []);

  useFrame((_, delta) => {
    const [px, py, pz] = playerPos.current;
    const targetOffset = new THREE.Vector3(Math.sin(angle.current) * 12, 6, Math.cos(angle.current) * 12);
    const lerpFactor = 1 - Math.pow(0.01, delta);
    currentOffset.current.lerp(targetOffset, lerpFactor);
    camera.position.set(px + currentOffset.current.x, py + currentOffset.current.y, pz + currentOffset.current.z);
    const tgt = new THREE.Vector3(px, py + 1, pz);
    currentLookAt.current.lerp(tgt, lerpFactor);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}

/* ═══════════════════════════════════════════
   Main Game Page
   ═══════════════════════════════════════════ */

export default function GamePage() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [character, setCharacter] = useState({ name: 'Explorer', type: 'girl' });
  const [score, setScore] = useState(0);
  const [collectibles, setCollectibles] = useState(INITIAL_COLLECTIBLES);
  const [notifications, setNotifications] = useState([]);
  const [inventory, setInventory] = useState({ coin: 0, seashell: 0, gem: 0, chest: 0 });
  const [shellsCollected, setShellsCollected] = useState(0);
  const playerPos = useRef([0, GROUND_Y, 8]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dreamIslandCharacter');
      if (saved) setCharacter(JSON.parse(saved));
    } catch { /* default */ }
  }, []);

  useEffect(() => {
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 18 + 5;
      if (p >= 100) { p = 100; clearInterval(iv); setTimeout(() => setLoading(false), 500); }
      setProgress(Math.min(p, 100));
    }, 200);
    return () => clearInterval(iv);
  }, []);

  const handleCollect = useCallback((item) => {
    // Remove from scene
    setCollectibles(prev => prev.filter(c => c.id !== item.id));
    // Add points
    setScore(prev => prev + item.points);
    // Update inventory
    setInventory(prev => ({ ...prev, [item.type]: (prev[item.type] || 0) + 1 }));
    // Track shells for mission
    if (item.type === 'seashell') setShellsCollected(prev => prev + 1);
    // Show notification
    const notifId = Date.now();
    setNotifications(prev => [...prev, { id: notifId, text: `+${item.points} ${item.name}`, type: item.type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== notifId)), 2000);
  }, []);

  const handlePositionUpdate = useCallback((x, y, z) => {
    playerPos.current = [x, y, z];
  }, []);

  const totalCollected = Object.values(inventory).reduce((a, b) => a + b, 0);

  return (
    <div className="game-page">
      {/* Loading Screen */}
      {loading && (
        <div className={`game-loading${progress >= 100 ? ' fade-out' : ''}`}>
          <span className="game-loading-icon">🏝️</span>
          <h2>Entering Dream Island</h2>
          <p>Preparing your adventure...</p>
          <div className="game-loading-bar-track">
            <div className="game-loading-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <div className="game-canvas-container">
        <Canvas shadows camera={{ position: [0, 12, 25], fov: 50 }} gl={{ antialias: true }} style={{ outline: 'none' }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[15, 20, 10]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
          <hemisphereLight skyColor="#A8D8F0" groundColor="#8BCB88" intensity={0.4} />
          <Sky sunPosition={[100, 40, 100]} turbidity={8} rayleigh={2} mieCoefficient={0.005} mieDirectionalG={0.8} />

          <Ocean />
          <Island />

          <PalmTree position={[6, 0.4, 5]} scale={0.9} />
          <PalmTree position={[10, 0.4, 1]} scale={1.1} />
          <PalmTree position={[3, 0.4, 10]} />
          <PalmTree position={[-8, 0.4, 7]} scale={0.8} />
          <PalmTree position={[-12, 0.4, 2]} scale={1.05} />
          <PalmTree position={[14, 0.4, -5]} scale={0.75} />
          <PalmTree position={[-3, 0.4, -10]} scale={0.95} />

          <Rock position={[12, 0.3, 8]} scale={1.2} color="#9e9e9e" />
          <Rock position={[-10, 0.3, 10]} scale={0.8} color="#aaa" />
          <Rock position={[15, 0.3, -2]} scale={1.5} color="#888" />
          <Rock position={[-6, 0.3, -12]} scale={1} color="#999" />

          {/* Collectibles */}
          {collectibles.map(item => (
            <CollectibleItem key={item.id} item={item} playerPos={playerPos} onCollect={handleCollect} />
          ))}

          <Player charType={character.type} onPositionUpdate={handlePositionUpdate} />
          <ThirdPersonCamera playerPos={playerPos} />
        </Canvas>
      </div>

      {/* Notifications */}
      <div className="game-notifications">
        {notifications.map(n => (
          <div key={n.id} className={`game-notif game-notif-${n.type}`}>
            {n.type === 'coin' && '🪙'}{n.type === 'seashell' && '🐚'}{n.type === 'gem' && '💎'}{n.type === 'chest' && '📦'} {n.text}
          </div>
        ))}
      </div>

      {/* HUD */}
      {!loading && (
        <div className="game-hud">
          <div className="hud-top">
            <div className="hud-player-info">
              <div className="hud-player-avatar">{character.type === 'girl' ? '👧' : '👦'}</div>
              <span className="hud-player-name">{character.name || 'Explorer'}</span>
              <span className="hud-score">⭐ {score}</span>
            </div>
            <div className="hud-actions">
              <Link to="/" className="hud-btn" title="Back to Home">🏠</Link>
              <button className="hud-btn" title="Inventory">🎒</button>
              <button className="hud-btn" title="Settings">⚙️</button>
            </div>
          </div>

          {/* Inventory mini */}
          <div className="hud-inventory-mini">
            <span title="Coins">🪙 {inventory.coin}</span>
            <span title="Seashells">🐚 {inventory.seashell}</span>
            <span title="Gems">💎 {inventory.gem}</span>
            <span title="Chests">📦 {inventory.chest}</span>
          </div>

          <div className="hud-mission">
            <div className="hud-mission-label">📋 ACTIVE MISSION</div>
            <div className="hud-mission-title">Beach Explorer</div>
            <p style={{ fontSize: '0.7rem', opacity: 0.7, marginBottom: 6 }}>Find 5 seashells along the shore</p>
            <div className="hud-mission-progress">
              <div className="hud-mission-bar-track">
                <div className="hud-mission-bar-fill" style={{ width: `${Math.min(shellsCollected / 5, 1) * 100}%` }} />
              </div>
              <span className="hud-mission-count">{Math.min(shellsCollected, 5)} / 5</span>
            </div>
            {shellsCollected >= 5 && <div className="hud-mission-complete">✅ Mission Complete! +50 pts</div>}
          </div>

          <div className="hud-bottom">
            <div className="hud-control"><span className="hud-key">W</span><span className="hud-key">A</span><span className="hud-key">S</span><span className="hud-key">D</span> Move</div>
            <div className="hud-control"><span className="hud-key">SPACE</span> Jump</div>
            <div className="hud-control"><span className="hud-key">SHIFT</span> Run</div>
            <div className="hud-control"><span className="hud-key">E</span> Collect</div>
            <div className="hud-control">🖱️ Camera</div>
          </div>
        </div>
      )}
    </div>
  );
}
