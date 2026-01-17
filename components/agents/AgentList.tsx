'use client';

import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import type { Agent } from '@/types';

const statusColors: Record<string, string> = {
  idle: 'bg-neon-green',
  working: 'bg-neon-blue',
  deploying: 'bg-neon-purple',
  returning: 'bg-neon-orange',
  resting: 'bg-gray-500',
  error: 'bg-neon-red',
  offline: 'bg-gray-700',
};

const classIcons: Record<string, string> = {
  scout: '🔍',
  builder: '🛠️',
  guardian: '🛡️',
  courier: '📨',
  analyst: '📊',
  commander: '⭐',
};

export function AgentList() {
  const agents = useStore((state) => state.agents);
  const selectedAgentIds = useStore((state) => state.selection.selectedAgentIds);
  const selectAgent = useStore((state) => state.selectAgent);

  // Group agents by status
  const groupedAgents = agents.reduce(
    (acc, agent) => {
      const group = agent.status === 'idle' ? 'available' : 'busy';
      acc[group].push(agent);
      return acc;
    },
    { available: [] as Agent[], busy: [] as Agent[] }
  );

  return (
    <div className="p-4 space-y-4">
      {/* Available Agents */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-neon-green" />
          Available ({groupedAgents.available.length})
        </h3>
        <div className="space-y-2">
          {groupedAgents.available.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              isSelected={selectedAgentIds.includes(agent.id)}
              onSelect={(e) => selectAgent(agent.id, e.shiftKey)}
            />
          ))}
          {groupedAgents.available.length === 0 && (
            <p className="text-sm text-muted-foreground py-2">
              No available agents
            </p>
          )}
        </div>
      </div>

      {/* Busy Agents */}
      {groupedAgents.busy.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
            Working ({groupedAgents.busy.length})
          </h3>
          <div className="space-y-2">
            {groupedAgents.busy.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                isSelected={selectedAgentIds.includes(agent.id)}
                onSelect={(e) => selectAgent(agent.id, e.shiftKey)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface AgentCardProps {
  agent: Agent;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
}

function AgentCard({ agent, isSelected, onSelect }: AgentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onSelect}
      className={`p-3 rounded-lg cursor-pointer transition-all ${
        isSelected
          ? 'bg-primary/20 border border-primary'
          : 'bg-surface hover:bg-surface-elevated border border-transparent'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className="text-2xl">{classIcons[agent.class]}</div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{agent.name}</span>
            <span
              className={`w-2 h-2 rounded-full ${statusColors[agent.status]}`}
            />
          </div>
          <div className="text-xs text-muted-foreground capitalize">
            {agent.class} &middot; Lvl {agent.level}
          </div>
        </div>

        {/* Stats */}
        <div className="text-right text-xs text-muted-foreground">
          <div>{agent.missionsCompleted} missions</div>
          <div>{Math.round(agent.successRate)}% success</div>
        </div>
      </div>

      {/* Progress bar for working agents */}
      {agent.status === 'working' && (
        <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-neon-blue to-neon-purple"
            initial={{ width: 0 }}
            animate={{ width: '60%' }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}

      {/* Skills preview */}
      <div className="mt-2 flex flex-wrap gap-1">
        {agent.skills.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="text-xs px-1.5 py-0.5 bg-muted rounded capitalize"
          >
            {skill.replace('_', ' ')}
          </span>
        ))}
        {agent.skills.length > 3 && (
          <span className="text-xs px-1.5 py-0.5 bg-muted rounded">
            +{agent.skills.length - 3}
          </span>
        )}
      </div>
    </motion.div>
  );
}
