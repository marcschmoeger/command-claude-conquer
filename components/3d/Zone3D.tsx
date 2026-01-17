'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, RoundedBox } from '@react-three/drei';
import { useStore } from '@/store/useStore';
import type { MapZone } from '@/types';
import * as THREE from 'three';

interface Zone3DProps {
  zone: MapZone;
}

const zoneIcons: Record<string, string> = {
  barracks: '🏠',
  mission: '🎯',
  workshop: '🔧',
  archive: '📚',
  powercore: '⚡',
};

export function Zone3D({ zone }: Zone3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const selectedAgentIds = useStore((state) => state.selection.selectedAgentIds);
  const missions = useStore((state) => state.missions);

  // Find linked mission if this is a mission zone
  const linkedMission = zone.missionId
    ? missions.find((m) => m.id === zone.missionId)
    : null;

  useFrame((state) => {
    if (!meshRef.current) return;

    // Subtle breathing animation for active zones
    if (zone.type === 'mission' && linkedMission?.status === 'in_progress') {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
      meshRef.current.scale.set(scale, 1, scale);
    }
  });

  const handleClick = (e: THREE.Event) => {
    e.stopPropagation();

    // If agents are selected, this would be where we deploy them
    if (selectedAgentIds.length > 0) {
      // TODO: Deploy selected agents to this zone
      console.log('Deploy agents to zone:', zone.id);
    }
  };

  const handlePointerOver = () => {
    setHovered(true);
    if (selectedAgentIds.length > 0) {
      document.body.style.cursor = 'crosshair';
    }
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'default';
  };

  return (
    <group position={[zone.position.x, zone.position.y, zone.position.z]}>
      {/* Zone Platform */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        receiveShadow
      >
        <RoundedBox
          args={[zone.size.width, 0.5, zone.size.depth]}
          radius={0.5}
          smoothness={4}
        >
          <meshStandardMaterial
            color={zone.color}
            transparent
            opacity={hovered ? 0.4 : 0.2}
            emissive={zone.color}
            emissiveIntensity={hovered ? 0.3 : 0.1}
          />
        </RoundedBox>
      </mesh>

      {/* Zone Border */}
      <lineSegments position={[0, 0.3, 0]}>
        <edgesGeometry
          args={[new THREE.BoxGeometry(zone.size.width, 0.1, zone.size.depth)]}
        />
        <lineBasicMaterial color={zone.color} transparent opacity={0.6} />
      </lineSegments>

      {/* Corner Markers */}
      {[
        [-zone.size.width / 2, 0, -zone.size.depth / 2],
        [zone.size.width / 2, 0, -zone.size.depth / 2],
        [-zone.size.width / 2, 0, zone.size.depth / 2],
        [zone.size.width / 2, 0, zone.size.depth / 2],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.3, 0.3, 2, 8]} />
          <meshStandardMaterial
            color={zone.color}
            emissive={zone.color}
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Zone Label */}
      <Html position={[0, 3, 0]} center>
        <div className="glass px-4 py-2 rounded-lg text-center whitespace-nowrap pointer-events-none">
          <div className="flex items-center gap-2 justify-center">
            <span className="text-lg">{zoneIcons[zone.type]}</span>
            <span className="font-semibold">{zone.name}</span>
          </div>
          {zone.type === 'mission' && linkedMission && (
            <div className="mt-1">
              <div className="text-xs text-muted-foreground">{linkedMission.title}</div>
              <div className="mt-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-neon-blue to-neon-purple transition-all duration-300"
                  style={{ width: `${linkedMission.progress}%` }}
                />
              </div>
            </div>
          )}
          {zone.type === 'barracks' && (
            <div className="text-xs text-muted-foreground mt-1">
              {zone.currentAgents.length} / {zone.maxCapacity} agents
            </div>
          )}
        </div>
      </Html>

      {/* Deploy indicator when agents selected */}
      {selectedAgentIds.length > 0 && hovered && zone.type === 'mission' && (
        <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[zone.size.width / 2 - 1, zone.size.width / 2, 32]} />
          <meshBasicMaterial color="#10B981" transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
}
