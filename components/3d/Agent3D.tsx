'use client';

import { useRef, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Html, Billboard } from '@react-three/drei';
import { useStore } from '@/store/useStore';
import type { Agent } from '@/types';
import * as THREE from 'three';

interface Agent3DProps {
  agent: Agent;
  isSelected: boolean;
}

const statusColors: Record<string, string> = {
  idle: '#10B981',
  working: '#00D4FF',
  deploying: '#8B5CF6',
  returning: '#F59E0B',
  resting: '#6B7280',
  error: '#EF4444',
  offline: '#374151',
};

const classColors: Record<string, string> = {
  scout: '#10B981',
  builder: '#8B5CF6',
  guardian: '#EF4444',
  courier: '#F59E0B',
  analyst: '#00D4FF',
  commander: '#FFD700',
};

export function Agent3D({ agent, isSelected }: Agent3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const selectAgent = useStore((state) => state.selectAgent);
  const setHoveredAgent = useStore((state) => state.setHoveredAgent);

  const statusColor = statusColors[agent.status] || '#6B7280';
  const classColor = classColors[agent.class] || '#8B5CF6';

  useFrame((state) => {
    if (!meshRef.current) return;

    // Floating animation
    meshRef.current.position.y = agent.position.y + Math.sin(state.clock.elapsedTime * 2 + agent.position.x) * 0.15;

    // Gentle rotation when idle
    if (agent.status === 'idle') {
      meshRef.current.rotation.y += 0.005;
    }

    // Pulse glow for selected agents
    if (glowRef.current && isSelected) {
      const scale = 1.2 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      glowRef.current.scale.setScalar(scale);
    }

    // Working animation - faster rotation
    if (agent.status === 'working') {
      meshRef.current.rotation.y += 0.02;
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    selectAgent(agent.id, e.nativeEvent.shiftKey);
  };

  const handlePointerOver = () => {
    setHovered(true);
    setHoveredAgent(agent.id);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    setHoveredAgent(null);
    document.body.style.cursor = 'default';
  };

  return (
    <group position={[agent.position.x, agent.position.y, agent.position.z]}>
      {/* Selection Ring */}
      {isSelected && (
        <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
          <ringGeometry args={[1.5, 2, 32]} />
          <meshBasicMaterial color={classColor} transparent opacity={0.6} />
        </mesh>
      )}

      {/* Main Body */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        castShadow
      >
        {/* Octahedron body */}
        <octahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial
          color={classColor}
          emissive={classColor}
          emissiveIntensity={hovered || isSelected ? 0.5 : 0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Status Indicator */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color={statusColor} />
      </mesh>

      {/* Hover Info */}
      {(hovered || isSelected) && (
        <Billboard position={[0, 2.5, 0]}>
          <Html center>
            <div className="glass px-3 py-2 rounded-lg text-center whitespace-nowrap pointer-events-none">
              <div className="text-sm font-semibold">{agent.name}</div>
              <div className="text-xs text-muted-foreground capitalize">
                {agent.class} - {agent.status}
              </div>
              {agent.currentMissionId && (
                <div className="text-xs text-neon-blue mt-1">On Mission</div>
              )}
            </div>
          </Html>
        </Billboard>
      )}

      {/* Ground Shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <circleGeometry args={[1, 32]} />
        <meshBasicMaterial color={classColor} transparent opacity={0.2} />
      </mesh>
    </group>
  );
}
