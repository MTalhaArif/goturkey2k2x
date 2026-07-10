import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { destinations } from '@/lib/destinations';

const NAVY = '#1a2a5c';
const GOLD = '#FFD700';
const ACCENT_RIM = '#3a5aa8';

const CORE_RADIUS = 1.5;
const RIM_RADIUS = 1.6;
const MARKER_RADIUS = 1.85; // well clear of the rim shell so it never z-fights

function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return [
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

function Markers() {
  const positions = useMemo(
    () => destinations.map((d) => ({ name: d.name, position: latLngToVector3(d.lat, d.lng, MARKER_RADIUS) })),
    []
  );

  return (
    <>
      {positions.map((d) => (
        <mesh key={d.name} position={d.position}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={2.5} toneMapped={false} />
        </mesh>
      ))}
    </>
  );
}

function RotatingGlobe() {
  const groupRef = useRef();

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.15;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[CORE_RADIUS, 40, 40]} />
        <meshStandardMaterial color={NAVY} emissive={NAVY} emissiveIntensity={0.35} roughness={0.5} metalness={0.1} />
      </mesh>
      <mesh>
        <sphereGeometry args={[RIM_RADIUS, 40, 40]} />
        <meshBasicMaterial color={ACCENT_RIM} transparent opacity={0.25} side={THREE.BackSide} />
      </mesh>
      <Markers />
    </group>
  );
}

export default function TurkeyGlobe() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ alpha: true }} style={{ width: '100%', height: '100%' }}>
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 3, 5]} intensity={1.8} />
      <directionalLight position={[-4, -2, 3]} intensity={0.6} />
      <RotatingGlobe />
    </Canvas>
  );
}
