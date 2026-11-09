import { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
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

/* ═══════════════════════════════════════════
   3D Components
   ═══════════════════════════════════════════ */

/** Animated ocean plane */
function Ocean() {
  const ref = useRef();
  const posArray = useRef(null);

  useEffect(() => {
    const geo = ref.current.geometry;
    posArray.current = Float32Array.from(geo.attributes.position.array);
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const geo = ref.current.geometry;
    const pos = geo.attributes.position;
    const orig = posArray.current;
    if (!orig) return;
    for (let i = 0; i < pos.count; i++) {
      const x = orig[i * 3];
      const z = orig[i * 3 + 2];
      pos.array[i * 3 + 1] =
        Math.sin(x * 0.3 + t) * 0.25 +
        Math.cos(z * 0.3 + t * 1.2) * 0.2;
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

/** Island terrain */
function Island() {
  return (
    <group>
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[22, 25, 1, 32]} />
        <meshStandardMaterial color="#f5deb3" />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[18, 22, 0.5, 32]} />
        <meshStandardMaterial color="#7ec87a" />
      </mesh>
      <mesh position={[-5, 2.5, -6]}>
        <coneGeometry args={[6, 7, 8]} />
        <meshStandardMaterial color="#8a9a5b" />
      </mesh>
      <mesh position={[-5, 5.8, -6]}>
        <coneGeometry args={[2.5, 3, 8]} />
        <meshStandardMaterial color="#b0b8a8" />
      </mesh>
      <mesh position={[8, 1.2, -3]}>
        <coneGeometry args={[4, 3, 7]} />
        <meshStandardMaterial color="#6ab567" />
      </mesh>
    </group>
  );
}

/** Palm tree */
function PalmTree({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.15, 0.25, 4, 6]} />
        <meshStandardMaterial color="#8B6914" />
      </mesh>
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

/** Rock */
function Rock({ position, scale = 1, color = '#888' }) {
  return (
    <mesh position={position} scale={scale}>
      <dodecahedronGeometry args={[0.6, 0]} />
      <meshStandardMaterial color={color} flatShading />
    </mesh>
  );
}

/** Spinning coin */
function Coin({ position }) {
  const ref = useRef();
  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 2;
  });
  return (
    <mesh ref={ref} position={position}>
      <cylinderGeometry args={[0.35, 0.35, 0.08, 16]} />
      <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.2} />
    </mesh>
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

  // Vectors reused every frame
  const moveDir = useMemo(() => new THREE.Vector3(), []);
  const frontVec = useMemo(() => new THREE.Vector3(), []);
  const sideVec = useMemo(() => new THREE.Vector3(), []);
  const camDir = useMemo(() => new THREE.Vector3(), []);

  const bodyColor = charType === 'boy' ? '#55C6C2' : '#FF8F87';

  // Limb refs for walk animation
  const leftArm = useRef();
  const rightArm = useRef();
  const leftLeg = useRef();
  const rightLeg = useRef();

  useFrame((state, delta) => {
    if (!group.current) return;

    const k = keys.current;
    const isRunning = k.has('shift');
    const speed = isRunning ? RUN_SPEED : WALK_SPEED;

    // Get camera's forward direction projected onto the XZ plane
    camera.getWorldDirection(camDir);
    camDir.y = 0;
    camDir.normalize();

    // Build movement vector relative to camera direction
    const forward = (k.has('w') ? 1 : 0) - (k.has('s') ? 1 : 0);
    const right = (k.has('d') ? 1 : 0) - (k.has('a') ? 1 : 0);

    frontVec.copy(camDir).multiplyScalar(forward);
    sideVec.crossVectors(camDir, new THREE.Vector3(0, 1, 0)).multiplyScalar(right);
    moveDir.addVectors(frontVec, sideVec).normalize();

    const isMoving = forward !== 0 || right !== 0;

    // Horizontal movement
    if (isMoving) {
      velocity.current.x = moveDir.x * speed;
      velocity.current.z = moveDir.z * speed;

      // Rotate character to face movement direction
      const targetAngle = Math.atan2(moveDir.x, moveDir.z);
      const currentY = group.current.rotation.y;
      let diff = targetAngle - currentY;
      // Shortest path
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      group.current.rotation.y += diff * 10 * delta;
    } else {
      velocity.current.x = 0;
      velocity.current.z = 0;
    }

    // Jump
    if (k.has(' ') && isGrounded.current) {
      velocity.current.y = JUMP_FORCE;
      isGrounded.current = false;
    }

    // Gravity
    velocity.current.y += GRAVITY * delta;

    // Update position
    const pos = group.current.position;
    pos.x += velocity.current.x * delta;
    pos.y += velocity.current.y * delta;
    pos.z += velocity.current.z * delta;

    // Ground collision
    if (pos.y <= GROUND_Y) {
      pos.y = GROUND_Y;
      velocity.current.y = 0;
      isGrounded.current = true;
    }

    // Island boundary — keep player within the island circle
    const distFromCenter = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
    if (distFromCenter > ISLAND_RADIUS) {
      const angle = Math.atan2(pos.z, pos.x);
      pos.x = Math.cos(angle) * ISLAND_RADIUS;
      pos.z = Math.sin(angle) * ISLAND_RADIUS;
      velocity.current.x = 0;
      velocity.current.z = 0;
    }

    // Simple walk animation on limbs
    const limbSpeed = isRunning ? 12 : 7;
    const limbAmplitude = isRunning ? 0.6 : 0.35;
    const t = state.clock.getElapsedTime();
    if (isMoving) {
      const swing = Math.sin(t * limbSpeed) * limbAmplitude;
      if (leftArm.current) leftArm.current.rotation.x = swing;
      if (rightArm.current) rightArm.current.rotation.x = -swing;
      if (leftLeg.current) leftLeg.current.rotation.x = -swing;
      if (rightLeg.current) rightLeg.current.rotation.x = swing;
    } else {
      // Return limbs to rest
      if (leftArm.current) leftArm.current.rotation.x *= 0.85;
      if (rightArm.current) rightArm.current.rotation.x *= 0.85;
      if (leftLeg.current) leftLeg.current.rotation.x *= 0.85;
      if (rightLeg.current) rightLeg.current.rotation.x *= 0.85;
    }

    // Report position to parent for HUD / camera
    if (onPositionUpdate) {
      onPositionUpdate(pos.x, pos.y, pos.z);
    }
  });

  return (
    <group ref={group} position={[0, GROUND_Y, 8]}>
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
      {/* Left Arm */}
      <group ref={leftArm} position={[-0.5, 0.2, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.1, 0.3, 4, 8]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>
      </group>
      {/* Right Arm */}
      <group ref={rightArm} position={[0.5, 0.2, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.1, 0.3, 4, 8]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>
      </group>
      {/* Left Leg */}
      <group ref={leftLeg} position={[-0.18, -0.55, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.12, 0.3, 4, 8]} />
          <meshStandardMaterial color="#5b4a3f" />
        </mesh>
      </group>
      {/* Right Leg */}
      <group ref={rightLeg} position={[0.18, -0.55, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.12, 0.3, 4, 8]} />
          <meshStandardMaterial color="#5b4a3f" />
        </mesh>
      </group>
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
  const isRightDown = useRef(false);

  useEffect(() => {
    const onMouseDown = (e) => { if (e.button === 0 || e.button === 2) isRightDown.current = true; };
    const onMouseUp = (e) => { if (e.button === 0 || e.button === 2) isRightDown.current = false; };
    const onMouseMove = (e) => {
      if (isRightDown.current) {
        angle.current -= e.movementX * 0.005;
      }
    };
    const onContext = (e) => e.preventDefault();

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('contextmenu', onContext);
    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('contextmenu', onContext);
    };
  }, []);

  useFrame((_, delta) => {
    const px = playerPos.current[0];
    const py = playerPos.current[1];
    const pz = playerPos.current[2];

    // Camera orbits around the player based on mouse drag angle
    const radius = 12;
    const height = 6;
    const targetOffset = new THREE.Vector3(
      Math.sin(angle.current) * radius,
      height,
      Math.cos(angle.current) * radius
    );

    // Smoothly interpolate camera position
    const lerpFactor = 1 - Math.pow(0.01, delta);
    currentOffset.current.lerp(targetOffset, lerpFactor);

    camera.position.set(
      px + currentOffset.current.x,
      py + currentOffset.current.y,
      pz + currentOffset.current.z
    );

    // Look at player
    const targetLookAt = new THREE.Vector3(px, py + 1, pz);
    currentLookAt.current.lerp(targetLookAt, lerpFactor);
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
  const playerPos = useRef([0, GROUND_Y, 8]);

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

  const handlePositionUpdate = (x, y, z) => {
    playerPos.current = [x, y, z];
  };

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
        <Canvas
          shadows
          camera={{ position: [0, 12, 25], fov: 50 }}
          gl={{ antialias: true }}
          tabIndex={0}
          style={{ outline: 'none' }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[15, 20, 10]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
          <hemisphereLight skyColor="#A8D8F0" groundColor="#8BCB88" intensity={0.4} />

          <Sky sunPosition={[100, 40, 100]} turbidity={8} rayleigh={2} mieCoefficient={0.005} mieDirectionalG={0.8} />

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

          {/* Player */}
          <Player charType={character.type} onPositionUpdate={handlePositionUpdate} />

          {/* Camera follows player */}
          <ThirdPersonCamera playerPos={playerPos} />
        </Canvas>
      </div>

      {/* HUD */}
      {!loading && (
        <div className="game-hud">
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

          <div className="hud-mission">
            <div className="hud-mission-label">📋 ACTIVE MISSION</div>
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

          <div className="hud-bottom">
            <div className="hud-control"><span className="hud-key">W</span><span className="hud-key">A</span><span className="hud-key">S</span><span className="hud-key">D</span> Move</div>
            <div className="hud-control"><span className="hud-key">SPACE</span> Jump</div>
            <div className="hud-control"><span className="hud-key">SHIFT</span> Run</div>
            <div className="hud-control"><span className="hud-key">E</span> Interact</div>
            <div className="hud-control">🖱️ Camera</div>
          </div>
        </div>
      )}
    </div>
  );
}
