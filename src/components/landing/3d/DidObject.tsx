'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Icosahedron, Torus, MeshTransmissionMaterial } from '@react-three/drei';
import type { Mesh } from 'three';

export function DidObject() {
  const mainRef = useRef<Mesh>(null);
  const ring1Ref = useRef<Mesh>(null);
  const ring2Ref = useRef<Mesh>(null);

  useFrame((state) => {
    if (!mainRef.current || !ring1Ref.current || !ring2Ref.current) return;

    const t = state.clock.getElapsedTime();

    // Slow core rotation
    mainRef.current.rotation.y = t * 0.2;
    mainRef.current.rotation.z = t * 0.1;

    // Rings rotation (opposing axes)
    ring1Ref.current.rotation.x = t * 0.3;
    ring1Ref.current.rotation.y = t * 0.1;

    ring2Ref.current.rotation.x = t * 0.2 + Math.PI / 2;
    ring2Ref.current.rotation.y = t * -0.2;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      {/* Core */}
      <Icosahedron ref={mainRef} args={[1, 0]} position={[0, 0, 0]}>
        <MeshTransmissionMaterial
          backside
          backsideThickness={5} // Thickness of the backside
          thickness={2} // Thickness of the glass
          roughness={0.1} // Frostiness of the glass
          chromaticAberration={0.1} // Color splitting
          anisotropy={0.1}
          color="#3b82f6" // Blue-500
          resolution={512}
        />
      </Icosahedron>

      {/* Inner Ring */}
      <Torus ref={ring1Ref} args={[1.6, 0.05, 16, 100]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
      </Torus>

      {/* Outer Ring */}
      <Torus ref={ring2Ref} args={[2.2, 0.02, 16, 100]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </Torus>

      {/* Particles/Nodes */}
      <mesh position={[1.8, 1, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={2} />
      </mesh>
      <mesh position={[-1.5, -1.2, 0.5]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={2} />
      </mesh>
    </Float>
  );
}
