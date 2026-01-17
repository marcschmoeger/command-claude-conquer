'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Loader2, Zap } from 'lucide-react';
import type { MissionPriority } from '@/types';

interface CreateMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateMissionModal({ isOpen, onClose }: CreateMissionModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  const [priority, setPriority] = useState<MissionPriority>('normal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMission = useStore((state) => state.addMission);
  const addNotification = useStore((state) => state.addNotification);
  const selectedAgentIds = useStore((state) => state.selection.selectedAgentIds);
  const clearSelection = useStore((state) => state.clearSelection);

  const priorities: { value: MissionPriority; label: string; color: string }[] = [
    { value: 'low', label: 'Low', color: 'bg-gray-500' },
    { value: 'normal', label: 'Normal', color: 'bg-blue-500' },
    { value: 'high', label: 'High', color: 'bg-orange-500' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-500' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          priority,
          blueprint: { prompt: prompt.trim() },
          agentIds: selectedAgentIds,
          position: { x: 20, y: 0, z: Math.random() * 40 - 20 },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create mission');
      }

      const { mission } = await response.json();

      // Add to local state
      addMission({
        id: mission.id,
        userId: mission.user_id,
        title: mission.title,
        description: mission.description,
        type: mission.type,
        priority: mission.priority,
        blueprint: mission.blueprint,
        resources: mission.resources || {},
        requiredSkills: mission.required_skills || [],
        zoneId: mission.zone_id,
        position: {
          x: mission.position_x,
          y: mission.position_y,
          z: mission.position_z,
        },
        status: mission.status,
        progress: mission.progress,
        output: mission.output || {},
        error: mission.error,
        assignedAgents: selectedAgentIds,
        startedAt: mission.started_at,
        completedAt: mission.completed_at,
        estimatedDuration: mission.estimated_duration,
        createdAt: mission.created_at,
        updatedAt: mission.updated_at,
      });

      addNotification({
        type: 'success',
        title: 'Mission Created',
        message: `"${title}" is ready for deployment`,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setPrompt('');
      setPriority('normal');
      clearSelection();
      onClose();
    } catch (err) {
      setError('Failed to create mission. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg glass rounded-xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">New Mission</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-muted rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Mission Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Build landing page component"
                required
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Description (optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the mission"
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Prompt */}
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Mission Brief
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Detailed instructions for your agents..."
                required
                rows={4}
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Priority
              </label>
              <div className="flex gap-2">
                {priorities.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPriority(p.value)}
                    className={`flex-1 py-2 px-3 rounded-lg border text-sm transition-colors ${
                      priority === p.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <span className={`inline-block w-2 h-2 rounded-full ${p.color} mr-2`} />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Assigned Agents */}
            {selectedAgentIds.length > 0 && (
              <div className="p-3 bg-neon-green/10 border border-neon-green/20 rounded-lg">
                <div className="flex items-center gap-2 text-neon-green text-sm">
                  <Zap className="w-4 h-4" />
                  {selectedAgentIds.length} agent{selectedAgentIds.length > 1 ? 's' : ''} will be deployed
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !title.trim() || !prompt.trim()}
                className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4" />
                    Create Mission
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
