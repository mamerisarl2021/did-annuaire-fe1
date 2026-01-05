'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { DidObject } from './DidObject';
import { Suspense } from 'react';

export default function LandingScene() {
  return (
    <div className="relative h-[400px] w-full md:h-[600px]">
      <Canvas 
        camera={{ position: [0, 0, 6], fov: 45 }}
        aria-label="3D visualization of a decentralized digital identity concept"
        role="img"
      >
        <Suspense fallback={null}>
          <Environment preset="city" />

          <group position={[0, 0, 0]}>
            <DidObject />
          </group>

          <ContactShadows
            position={[0, -2.5, 0]}
            opacity={0.4}
            scale={10}
            blur={2.5}
            far={4}
            color="#0f172a"
          />

          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
        </Suspense>
      </Canvas>
    </div>
  );
}
