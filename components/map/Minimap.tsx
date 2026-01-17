'use client';

import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';

export function Minimap() {
  const agents = useStore((state) => state.agents);
  const zones = useStore((state) => state.zones);
  const setCameraTarget = useStore((state) => state.setCameraTarget);

  // Map world coords to minimap coords (assuming world is -100 to 100)
  const worldToMinimap = (x: number, z: number) => {
    const size = 150; // minimap size
    const worldSize = 100; // half of world size
    return {
      x: ((x + worldSize) / (worldSize * 2)) * size,
      y: ((z + worldSize) / (worldSize * 2)) * size,
    };
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 200 - 100;
    const z = ((e.clientY - rect.top) / rect.height) * 200 - 100;
    setCameraTarget({ x, y: 0, z });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-4 right-4 w-[150px] h-[150px] glass rounded-lg overflow-hidden z-30 cursor-crosshair"
      onClick={handleClick}
    >
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="minimap-grid"
              width="15"
              height="15"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 15 0 L 0 0 0 15"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#minimap-grid)" />
        </svg>
      </div>

      {/* Zones */}
      {zones.map((zone) => {
        const pos = worldToMinimap(zone.position.x, zone.position.z);
        const width = (zone.size.width / 200) * 150;
        const height = (zone.size.depth / 200) * 150;

        return (
          <div
            key={zone.id}
            className="absolute rounded-sm"
            style={{
              left: pos.x - width / 2,
              top: pos.y - height / 2,
              width,
              height,
              backgroundColor: `${zone.color}40`,
              border: `1px solid ${zone.color}`,
            }}
          />
        );
      })}

      {/* Agents */}
      {agents.map((agent) => {
        const pos = worldToMinimap(agent.position.x, agent.position.z);
        const colors: Record<string, string> = {
          idle: '#10B981',
          working: '#00D4FF',
          deploying: '#8B5CF6',
          returning: '#F59E0B',
          resting: '#6B7280',
          error: '#EF4444',
          offline: '#374151',
        };

        return (
          <div
            key={agent.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: pos.x - 4,
              top: pos.y - 4,
              backgroundColor: colors[agent.status] || '#6B7280',
              boxShadow: `0 0 4px ${colors[agent.status] || '#6B7280'}`,
            }}
          />
        );
      })}

      {/* Label */}
      <div className="absolute bottom-1 left-1 text-[8px] text-muted-foreground">
        TACTICAL MAP
      </div>
    </motion.div>
  );
}
