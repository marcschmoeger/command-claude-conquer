'use client';

import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, StopCircle, Clock, Users, AlertTriangle } from 'lucide-react';

export function MissionPanel() {
  const ui = useStore((state) => state.ui);
  const toggleRightPanel = useStore((state) => state.toggleRightPanel);
  const activeMission = useStore((state) => state.activeMission);
  const setActiveMission = useStore((state) => state.setActiveMission);
  const agents = useStore((state) => state.agents);

  const handleClose = () => {
    toggleRightPanel();
    setActiveMission(null);
  };

  if (!ui.rightPanelOpen || !activeMission) return null;

  const assignedAgents = agents.filter((a) =>
    activeMission.assignedAgents.includes(a.id)
  );

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ x: 400 }}
        animate={{ x: 0 }}
        exit={{ x: 400 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-14 bottom-0 w-96 glass z-30 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold">{activeMission.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`text-xs px-2 py-0.5 rounded capitalize ${
                  activeMission.status === 'in_progress'
                    ? 'bg-neon-blue/20 text-neon-blue'
                    : activeMission.status === 'completed'
                    ? 'bg-neon-green/20 text-neon-green'
                    : activeMission.status === 'failed'
                    ? 'bg-neon-red/20 text-neon-red'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {activeMission.status.replace('_', ' ')}
              </span>
              <span className="text-xs text-muted-foreground capitalize">
                {activeMission.priority} priority
              </span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Description */}
          {activeMission.description && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">
                {activeMission.description}
              </p>
            </div>
          )}

          {/* Progress */}
          {activeMission.status === 'in_progress' && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{activeMission.progress}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-neon-blue to-neon-purple"
                  initial={{ width: 0 }}
                  animate={{ width: `${activeMission.progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}

          {/* Blueprint */}
          {activeMission.blueprint?.prompt && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Mission Brief</h3>
              <div className="p-3 bg-surface rounded-lg">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {activeMission.blueprint.prompt}
                </p>
              </div>
            </div>
          )}

          {/* Assigned Agents */}
          <div>
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Assigned Agents ({assignedAgents.length})
            </h3>
            <div className="space-y-2">
              {assignedAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="p-2 bg-surface rounded-lg flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    {agent.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{agent.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {agent.class}
                    </div>
                  </div>
                </div>
              ))}
              {assignedAgents.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No agents assigned yet
                </p>
              )}
            </div>
          </div>

          {/* Required Skills */}
          {activeMission.requiredSkills.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {activeMission.requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2 py-1 bg-muted rounded capitalize"
                  >
                    {skill.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Timing */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {activeMission.estimatedDuration
                ? `Est. ${activeMission.estimatedDuration}m`
                : 'No estimate'}
            </div>
            {activeMission.startedAt && (
              <div>
                Started:{' '}
                {new Date(activeMission.startedAt).toLocaleTimeString()}
              </div>
            )}
          </div>

          {/* Output */}
          {activeMission.output?.result && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Output</h3>
              <div className="p-3 bg-surface rounded-lg max-h-48 overflow-y-auto">
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                  {activeMission.output.result}
                </pre>
              </div>
            </div>
          )}

          {/* Error */}
          {activeMission.error && (
            <div className="p-3 bg-neon-red/10 border border-neon-red/20 rounded-lg">
              <div className="flex items-center gap-2 text-neon-red mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-semibold">Error</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {activeMission.error}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        {(activeMission.status === 'pending' ||
          activeMission.status === 'in_progress' ||
          activeMission.status === 'paused') && (
          <div className="p-4 border-t border-border flex gap-2">
            {activeMission.status === 'pending' && (
              <button className="flex-1 py-2 px-4 bg-neon-green text-surface font-medium rounded-lg hover:bg-neon-green/90 transition-colors flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                Start Mission
              </button>
            )}
            {activeMission.status === 'in_progress' && (
              <>
                <button className="flex-1 py-2 px-4 bg-neon-orange text-surface font-medium rounded-lg hover:bg-neon-orange/90 transition-colors flex items-center justify-center gap-2">
                  <Pause className="w-4 h-4" />
                  Pause
                </button>
                <button className="py-2 px-4 bg-neon-red text-white font-medium rounded-lg hover:bg-neon-red/90 transition-colors">
                  <StopCircle className="w-4 h-4" />
                </button>
              </>
            )}
            {activeMission.status === 'paused' && (
              <button className="flex-1 py-2 px-4 bg-neon-blue text-surface font-medium rounded-lg hover:bg-neon-blue/90 transition-colors flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                Resume
              </button>
            )}
          </div>
        )}
      </motion.aside>
    </AnimatePresence>
  );
}
