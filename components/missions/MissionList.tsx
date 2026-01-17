'use client';

import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import { Clock, Users, AlertCircle, CheckCircle, PauseCircle, XCircle } from 'lucide-react';
import type { Mission } from '@/types';

const statusConfig: Record<string, { icon: typeof Clock; color: string; label: string }> = {
  pending: { icon: Clock, color: 'text-muted-foreground', label: 'Pending' },
  in_progress: { icon: Users, color: 'text-neon-blue', label: 'In Progress' },
  paused: { icon: PauseCircle, color: 'text-neon-orange', label: 'Paused' },
  completed: { icon: CheckCircle, color: 'text-neon-green', label: 'Completed' },
  failed: { icon: XCircle, color: 'text-neon-red', label: 'Failed' },
  cancelled: { icon: AlertCircle, color: 'text-muted-foreground', label: 'Cancelled' },
};

const priorityColors: Record<string, string> = {
  low: 'bg-gray-500',
  normal: 'bg-blue-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500',
};

export function MissionList() {
  const missions = useStore((state) => state.missions);
  const setActiveMission = useStore((state) => state.setActiveMission);
  const toggleRightPanel = useStore((state) => state.toggleRightPanel);

  // Group by status
  const activeMissions = missions.filter(
    (m) => m.status === 'in_progress' || m.status === 'pending'
  );
  const completedMissions = missions.filter(
    (m) => m.status === 'completed' || m.status === 'failed' || m.status === 'cancelled'
  );

  const handleMissionClick = (mission: Mission) => {
    setActiveMission(mission);
    toggleRightPanel();
  };

  return (
    <div className="p-4 space-y-4">
      {/* Active Missions */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">
          Active ({activeMissions.length})
        </h3>
        <div className="space-y-2">
          {activeMissions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              onClick={() => handleMissionClick(mission)}
            />
          ))}
          {activeMissions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No active missions</p>
              <p className="text-xs mt-1">Create a mission to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Completed Missions */}
      {completedMissions.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">
            History ({completedMissions.length})
          </h3>
          <div className="space-y-2">
            {completedMissions.slice(0, 5).map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onClick={() => handleMissionClick(mission)}
                compact
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Target(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

interface MissionCardProps {
  mission: Mission;
  onClick: () => void;
  compact?: boolean;
}

function MissionCard({ mission, onClick, compact = false }: MissionCardProps) {
  const StatusIcon = statusConfig[mission.status].icon;
  const statusColor = statusConfig[mission.status].color;
  const agents = useStore((state) => state.agents);

  const assignedAgents = agents.filter((a) =>
    mission.assignedAgents.includes(a.id)
  );

  if (compact) {
    return (
      <div
        onClick={onClick}
        className="p-2 bg-surface rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors flex items-center gap-2"
      >
        <StatusIcon className={`w-4 h-4 ${statusColor}`} />
        <span className="text-sm truncate flex-1">{mission.title}</span>
        <span className="text-xs text-muted-foreground">
          {statusConfig[mission.status].label}
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="p-4 bg-surface rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${priorityColors[mission.priority]}`}
          />
          <h4 className="font-medium">{mission.title}</h4>
        </div>
        <div className={`flex items-center gap-1 text-xs ${statusColor}`}>
          <StatusIcon className="w-3 h-3" />
          {statusConfig[mission.status].label}
        </div>
      </div>

      {mission.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {mission.description}
        </p>
      )}

      {/* Progress */}
      {mission.status === 'in_progress' && (
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Progress</span>
            <span>{mission.progress}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-neon-blue to-neon-purple"
              initial={{ width: 0 }}
              animate={{ width: `${mission.progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Assigned Agents */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {assignedAgents.slice(0, 3).map((agent, i) => (
            <div
              key={agent.id}
              className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs"
              style={{ marginLeft: i > 0 ? -8 : 0 }}
              title={agent.name}
            >
              {agent.name[0]}
            </div>
          ))}
          {assignedAgents.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs ml-[-8px]">
              +{assignedAgents.length - 3}
            </div>
          )}
          {assignedAgents.length === 0 && (
            <span className="text-xs text-muted-foreground">No agents assigned</span>
          )}
        </div>

        {mission.estimatedDuration && (
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {mission.estimatedDuration}m
          </div>
        )}
      </div>

      {/* Required Skills */}
      {mission.requiredSkills.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {mission.requiredSkills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="text-xs px-1.5 py-0.5 bg-muted rounded capitalize"
            >
              {skill.replace('_', ' ')}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
