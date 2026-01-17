'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Target,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  PlusCircle,
} from 'lucide-react';
import { AgentList } from '../agents/AgentList';
import { MissionList } from '../missions/MissionList';
import { CreateMissionModal } from '../missions/CreateMissionModal';

export function Sidebar() {
  const [showMissionModal, setShowMissionModal] = useState(false);
  const ui = useStore((state) => state.ui);
  const toggleSidebar = useStore((state) => state.toggleSidebar);
  const setActivePanelTab = useStore((state) => state.setActivePanelTab);
  const user = useStore((state) => state.user);
  const agents = useStore((state) => state.agents);
  const missions = useStore((state) => state.missions);

  const activeMissions = missions.filter(
    (m) => m.status === 'in_progress' || m.status === 'pending'
  );
  const idleAgents = agents.filter((a) => a.status === 'idle');

  const tabs = [
    {
      id: 'agents' as const,
      label: 'Agents',
      icon: Users,
      count: agents.length,
    },
    {
      id: 'missions' as const,
      label: 'Missions',
      icon: Target,
      count: activeMissions.length,
    },
    {
      id: 'settings' as const,
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Sidebar */}
      <AnimatePresence>
        {ui.sidebarOpen && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-80 glass z-40 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-bold flex items-center gap-2">
                    <Zap className="w-5 h-5 text-neon-blue" />
                    C3
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    {user?.baseName || 'Command Base'}
                  </p>
                </div>
                <button
                  onClick={toggleSidebar}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="p-4 border-b border-border">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-surface rounded-lg">
                  <div className="text-2xl font-bold text-neon-green">
                    {idleAgents.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Idle Agents</div>
                </div>
                <div className="p-3 bg-surface rounded-lg">
                  <div className="text-2xl font-bold text-neon-blue">
                    {activeMissions.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Active Missions</div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActivePanelTab(tab.id)}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                    ui.activePanelTab === tab.id
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <tab.icon className="w-4 h-4" />
                    {tab.count !== undefined && (
                      <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                        {tab.count}
                      </span>
                    )}
                  </div>
                  {ui.activePanelTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {ui.activePanelTab === 'agents' && <AgentList />}
              {ui.activePanelTab === 'missions' && <MissionList />}
              {ui.activePanelTab === 'settings' && <SettingsPanel />}
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-border">
              {ui.activePanelTab === 'missions' && (
                <button
                  onClick={() => setShowMissionModal(true)}
                  className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  New Mission
                </button>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mission Modal */}
      <CreateMissionModal
        isOpen={showMissionModal}
        onClose={() => setShowMissionModal(false)}
      />

      {/* Toggle Button (when closed) */}
      {!ui.sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed left-4 top-4 p-3 glass rounded-lg z-40 hover:bg-surface-elevated transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </>
  );
}

function SettingsPanel() {
  const user = useStore((state) => state.user);

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-2">Commander Profile</h3>
        <div className="p-3 bg-surface rounded-lg">
          <div className="text-sm">{user?.displayName || user?.email}</div>
          <div className="text-xs text-muted-foreground capitalize">
            Level {user?.level || 1} &middot; {user?.tier || 'Free'} Tier
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">Power Cores</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
            <div className="flex items-center gap-2">
              <span>⚡</span>
              <span className="text-sm">Anthropic</span>
            </div>
            <span className="text-xs text-neon-green">Connected</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
            <div className="flex items-center gap-2">
              <span>🐙</span>
              <span className="text-sm">GitHub</span>
            </div>
            <span className="text-xs text-muted-foreground">Not connected</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">Keyboard Shortcuts</h3>
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Select all idle</span>
            <kbd className="px-1.5 py-0.5 bg-muted rounded">Ctrl+A</kbd>
          </div>
          <div className="flex justify-between">
            <span>Clear selection</span>
            <kbd className="px-1.5 py-0.5 bg-muted rounded">Esc</kbd>
          </div>
          <div className="flex justify-between">
            <span>Reset camera</span>
            <kbd className="px-1.5 py-0.5 bg-muted rounded">Space</kbd>
          </div>
          <div className="flex justify-between">
            <span>Toggle minimap</span>
            <kbd className="px-1.5 py-0.5 bg-muted rounded">Tab</kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
