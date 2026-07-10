import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { destinations } from '@/lib/destinations';

const NAVY = '#0F1A3C';
const GOLD = '#FFD700';
const RED = '#E31C25';

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
    () => destinations.map((d) => ({ name: d.name, position: latLngToVector3(d.lat, d.lng, 1.55) })),
    []
  );

  return (
    <>
      {positions.map((d) => (
        <mesh key={d.name} position={d.position}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={1.5} toneMapped={false} />
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
        <sphereGeometry args={[1.5, 40, 40]} />
        <meshStandardMaterial color={NAVY} roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.58, 40, 40]} />
        <meshBasicMaterial color={RED} transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>
      <Markers />
    </group>
  );
}

export default function TurkeyGlobe() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ alpha: true }} style={{ width: '100%', height: '100%' }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 5]} intensity={1.2} />
      <RotatingGlobe />
    </Canvas>
  );
}
