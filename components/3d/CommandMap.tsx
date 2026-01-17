'use client';

import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, PerspectiveCamera } from '@react-three/drei';
import { useStore } from '@/store/useStore';
import * as THREE from 'three';
import { Agent3D } from './Agent3D';
import { Zone3D } from './Zone3D';
import { SelectionBox } from './SelectionBox';

function CameraController() {
  const { camera } = useThree();
  const cameraState = useStore((state) => state.camera);
  const setCameraPosition = useStore((state) => state.setCameraPosition);

  useFrame(() => {
    // Smooth camera movement
    camera.position.lerp(
      new THREE.Vector3(cameraState.position.x, cameraState.position.y, cameraState.position.z),
      0.05
    );
  });

  return null;
}

function Scene() {
  const agents = useStore((state) => state.agents);
  const zones = useStore((state) => state.zones);
  const selectedAgentIds = useStore((state) => state.selection.selectedAgentIds);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[50, 100, 50]}
        intensity={0.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[-30, 20, 0]} intensity={0.5} color="#00D4FF" />
      <pointLight position={[30, 20, 0]} intensity={0.5} color="#8B5CF6" />

      {/* Ground Grid */}
      <Grid
        position={[0, -0.1, 0]}
        args={[200, 200]}
        cellSize={5}
        cellThickness={0.5}
        cellColor="#1a1a24"
        sectionSize={20}
        sectionThickness={1}
        sectionColor="#2a2a3a"
        fadeDistance={150}
        fadeStrength={1}
        followCamera={false}
      />

      {/* Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#0a0a0f" transparent opacity={0.8} />
      </mesh>

      {/* Zones */}
      {zones.map((zone) => (
        <Zone3D key={zone.id} zone={zone} />
      ))}

      {/* Agents */}
      {agents.map((agent) => (
        <Agent3D
          key={agent.id}
          agent={agent}
          isSelected={selectedAgentIds.includes(agent.id)}
        />
      ))}

      {/* Camera Controller */}
      <CameraController />
    </>
  );
}

export default function CommandMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const selection = useStore((state) => state.selection);
  const startSelection = useStore((state) => state.startSelection);
  const updateSelection = useStore((state) => state.updateSelection);
  const endSelection = useStore((state) => state.endSelection);
  const clearSelection = useStore((state) => state.clearSelection);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && !e.shiftKey) {
      // Left click without shift - start box selection
      startSelection(e.clientX, e.clientY);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (selection.isSelecting) {
      updateSelection(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => {
    if (selection.isSelecting) {
      endSelection();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      clearSelection();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Canvas
        shadows
        gl={{ antialias: true, alpha: false }}
        className="three-canvas"
      >
        <PerspectiveCamera makeDefault position={[0, 50, 50]} fov={60} />
        <OrbitControls
          makeDefault
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={20}
          maxDistance={150}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 6}
        />
        <color attach="background" args={['#0a0a0f']} />
        <fog attach="fog" args={['#0a0a0f', 80, 180]} />

        <Suspense fallback={null}>
          <Scene />
          <Environment preset="night" />
        </Suspense>
      </Canvas>

      {/* Selection Box Overlay */}
      <SelectionBox />
    </div>
  );
}
