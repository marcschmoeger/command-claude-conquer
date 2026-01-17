import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Agent, Mission, MapZone, UserProfile, Position3D, Notification } from '@/types';

interface SelectionState {
  selectedAgentIds: string[];
  hoveredAgentId: string | null;
  isSelecting: boolean;
  selectionStart: { x: number; y: number } | null;
  selectionEnd: { x: number; y: number } | null;
}

interface CameraState {
  position: Position3D;
  target: Position3D;
  zoom: number;
}

interface UIState {
  sidebarOpen: boolean;
  rightPanelOpen: boolean;
  activePanelTab: 'agents' | 'missions' | 'settings';
  showMinimap: boolean;
  showShortcuts: boolean;
}

interface AppState {
  // User
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;

  // Agents
  agents: Agent[];
  setAgents: (agents: Agent[]) => void;
  addAgent: (agent: Agent) => void;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  removeAgent: (id: string) => void;

  // Missions
  missions: Mission[];
  setMissions: (missions: Mission[]) => void;
  addMission: (mission: Mission) => void;
  updateMission: (id: string, updates: Partial<Mission>) => void;
  removeMission: (id: string) => void;
  activeMission: Mission | null;
  setActiveMission: (mission: Mission | null) => void;

  // Map Zones
  zones: MapZone[];
  setZones: (zones: MapZone[]) => void;
  updateZone: (id: string, updates: Partial<MapZone>) => void;

  // Selection
  selection: SelectionState;
  selectAgent: (id: string, append?: boolean) => void;
  selectAgents: (ids: string[]) => void;
  clearSelection: () => void;
  setHoveredAgent: (id: string | null) => void;
  startSelection: (x: number, y: number) => void;
  updateSelection: (x: number, y: number) => void;
  endSelection: () => void;

  // Camera
  camera: CameraState;
  setCameraPosition: (position: Position3D) => void;
  setCameraTarget: (target: Position3D) => void;
  setCameraZoom: (zoom: number) => void;
  resetCamera: () => void;

  // UI State
  ui: UIState;
  toggleSidebar: () => void;
  toggleRightPanel: () => void;
  setActivePanelTab: (tab: 'agents' | 'missions' | 'settings') => void;
  toggleMinimap: () => void;
  toggleShortcuts: () => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // Control Groups
  controlGroups: Record<number, string[]>;
  setControlGroup: (group: number, agentIds: string[]) => void;
  recallControlGroup: (group: number) => void;

  // Connection Status
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;

  // Loading States
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const defaultCamera: CameraState = {
  position: { x: 0, y: 50, z: 50 },
  target: { x: 0, y: 0, z: 0 },
  zoom: 1,
};

const defaultSelection: SelectionState = {
  selectedAgentIds: [],
  hoveredAgentId: null,
  isSelecting: false,
  selectionStart: null,
  selectionEnd: null,
};

const defaultUI: UIState = {
  sidebarOpen: true,
  rightPanelOpen: false,
  activePanelTab: 'agents',
  showMinimap: true,
  showShortcuts: false,
};

export const useStore = create<AppState>()(
  subscribeWithSelector((set, get) => ({
    // User
    user: null,
    setUser: (user) => set({ user }),

    // Agents
    agents: [],
    setAgents: (agents) => set({ agents }),
    addAgent: (agent) => set((state) => ({ agents: [...state.agents, agent] })),
    updateAgent: (id, updates) =>
      set((state) => ({
        agents: state.agents.map((a) => (a.id === id ? { ...a, ...updates } : a)),
      })),
    removeAgent: (id) =>
      set((state) => ({
        agents: state.agents.filter((a) => a.id !== id),
        selection: {
          ...state.selection,
          selectedAgentIds: state.selection.selectedAgentIds.filter((aid) => aid !== id),
        },
      })),

    // Missions
    missions: [],
    setMissions: (missions) => set({ missions }),
    addMission: (mission) => set((state) => ({ missions: [...state.missions, mission] })),
    updateMission: (id, updates) =>
      set((state) => ({
        missions: state.missions.map((m) => (m.id === id ? { ...m, ...updates } : m)),
      })),
    removeMission: (id) =>
      set((state) => ({
        missions: state.missions.filter((m) => m.id !== id),
      })),
    activeMission: null,
    setActiveMission: (mission) => set({ activeMission: mission }),

    // Map Zones
    zones: [],
    setZones: (zones) => set({ zones }),
    updateZone: (id, updates) =>
      set((state) => ({
        zones: state.zones.map((z) => (z.id === id ? { ...z, ...updates } : z)),
      })),

    // Selection
    selection: defaultSelection,
    selectAgent: (id, append = false) =>
      set((state) => ({
        selection: {
          ...state.selection,
          selectedAgentIds: append
            ? state.selection.selectedAgentIds.includes(id)
              ? state.selection.selectedAgentIds.filter((aid) => aid !== id)
              : [...state.selection.selectedAgentIds, id]
            : [id],
        },
      })),
    selectAgents: (ids) =>
      set((state) => ({
        selection: { ...state.selection, selectedAgentIds: ids },
      })),
    clearSelection: () =>
      set((state) => ({
        selection: { ...state.selection, selectedAgentIds: [] },
      })),
    setHoveredAgent: (id) =>
      set((state) => ({
        selection: { ...state.selection, hoveredAgentId: id },
      })),
    startSelection: (x, y) =>
      set((state) => ({
        selection: {
          ...state.selection,
          isSelecting: true,
          selectionStart: { x, y },
          selectionEnd: { x, y },
        },
      })),
    updateSelection: (x, y) =>
      set((state) => ({
        selection: { ...state.selection, selectionEnd: { x, y } },
      })),
    endSelection: () =>
      set((state) => ({
        selection: {
          ...state.selection,
          isSelecting: false,
          selectionStart: null,
          selectionEnd: null,
        },
      })),

    // Camera
    camera: defaultCamera,
    setCameraPosition: (position) =>
      set((state) => ({ camera: { ...state.camera, position } })),
    setCameraTarget: (target) =>
      set((state) => ({ camera: { ...state.camera, target } })),
    setCameraZoom: (zoom) =>
      set((state) => ({ camera: { ...state.camera, zoom: Math.max(0.5, Math.min(3, zoom)) } })),
    resetCamera: () => set({ camera: defaultCamera }),

    // UI State
    ui: defaultUI,
    toggleSidebar: () =>
      set((state) => ({ ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen } })),
    toggleRightPanel: () =>
      set((state) => ({ ui: { ...state.ui, rightPanelOpen: !state.ui.rightPanelOpen } })),
    setActivePanelTab: (tab) =>
      set((state) => ({ ui: { ...state.ui, activePanelTab: tab } })),
    toggleMinimap: () =>
      set((state) => ({ ui: { ...state.ui, showMinimap: !state.ui.showMinimap } })),
    toggleShortcuts: () =>
      set((state) => ({ ui: { ...state.ui, showShortcuts: !state.ui.showShortcuts } })),

    // Notifications
    notifications: [],
    addNotification: (notification) =>
      set((state) => ({
        notifications: [
          ...state.notifications,
          {
            ...notification,
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
          },
        ],
      })),
    removeNotification: (id) =>
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      })),
    clearNotifications: () => set({ notifications: [] }),

    // Control Groups
    controlGroups: {},
    setControlGroup: (group, agentIds) =>
      set((state) => ({
        controlGroups: { ...state.controlGroups, [group]: agentIds },
      })),
    recallControlGroup: (group) => {
      const agentIds = get().controlGroups[group];
      if (agentIds && agentIds.length > 0) {
        set((state) => ({
          selection: { ...state.selection, selectedAgentIds: agentIds },
        }));
      }
    },

    // Connection Status
    isConnected: false,
    setIsConnected: (connected) => set({ isConnected: connected }),

    // Loading States
    isLoading: false,
    setIsLoading: (loading) => set({ isLoading: loading }),
  }))
);

// Selectors
export const useSelectedAgents = () => {
  const agents = useStore((state) => state.agents);
  const selectedIds = useStore((state) => state.selection.selectedAgentIds);
  return agents.filter((a) => selectedIds.includes(a.id));
};

export const useIdleAgents = () => {
  return useStore((state) => state.agents.filter((a) => a.status === 'idle'));
};

export const useActiveMissions = () => {
  return useStore((state) =>
    state.missions.filter((m) => m.status === 'in_progress' || m.status === 'pending')
  );
};
