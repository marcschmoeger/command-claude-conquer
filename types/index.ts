// Agent Types
export type AgentClass = 'scout' | 'builder' | 'guardian' | 'courier' | 'analyst' | 'commander';

export type AgentStatus = 'idle' | 'deploying' | 'working' | 'returning' | 'resting' | 'error' | 'offline';

export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export interface AgentStats {
  speed: number;
  accuracy: number;
  stamina: number;
  versatility: number;
}

export interface Agent {
  id: string;
  userId: string;
  templateId: string;
  name: string;
  class: AgentClass;
  status: AgentStatus;
  position: Position3D;
  targetPosition?: Position3D;
  currentMissionId?: string;
  level: number;
  experience: number;
  stats: AgentStats;
  skills: string[];
  missionsCompleted: number;
  totalTasksCompleted: number;
  successRate: number;
  controlGroup?: number;
  customAvatar?: string;
  createdAt: string;
  updatedAt: string;
  lastActiveAt: string;
}

// Mission Types
export type MissionStatus = 'pending' | 'in_progress' | 'paused' | 'completed' | 'failed' | 'cancelled';
export type MissionPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface MissionBlueprint {
  prompt: string;
  context?: string;
  expectedOutput?: string;
  constraints?: string[];
}

export interface MissionOutput {
  result?: string;
  artifacts?: { name: string; content: string; type: string }[];
  logs?: { timestamp: string; message: string; level: string }[];
}

export interface Mission {
  id: string;
  userId: string;
  title: string;
  description?: string;
  type: string;
  priority: MissionPriority;
  blueprint: MissionBlueprint;
  resources: Record<string, unknown>;
  requiredSkills: string[];
  zoneId?: string;
  position: Position3D;
  status: MissionStatus;
  progress: number;
  output: MissionOutput;
  error?: string;
  assignedAgents: string[];
  startedAt?: string;
  completedAt?: string;
  estimatedDuration?: number;
  createdAt: string;
  updatedAt: string;
}

// Map Zone Types
export type ZoneType = 'barracks' | 'mission' | 'workshop' | 'archive' | 'powercore';
export type ZoneStatus = 'empty' | 'active' | 'full' | 'locked';

export interface MapZone {
  id: string;
  userId: string;
  type: ZoneType;
  name: string;
  position: Position3D;
  size: { width: number; height: number; depth: number };
  maxCapacity: number;
  currentAgents: string[];
  status: ZoneStatus;
  color: string;
  missionId?: string;
  createdAt: string;
  updatedAt: string;
}

// User Profile Types
export type UserTier = 'free' | 'pro' | 'enterprise';
export type CommanderAvatar = 'general' | 'engineer' | 'strategist' | 'speedrunner';
export type MissionType = 'coding' | 'research' | 'content' | 'automation' | 'mixed';

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  commanderAvatar: CommanderAvatar;
  baseName: string;
  primaryMissionType: MissionType;
  tier: UserTier;
  level: number;
  experience: number;
  achievements: string[];
  onboardingCompleted: boolean;
  onboardingStep: number;
  lastActiveAt: string;
  createdAt: string;
  updatedAt: string;
}

// API Key Types
export type ApiProvider = 'anthropic' | 'openai' | 'github' | 'google' | 'slack' | 'notion';

export interface ApiKeyConnection {
  id: string;
  userId: string;
  provider: ApiProvider;
  isValid: boolean;
  lastValidatedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// MCP Types
export type McpStatus = 'connected' | 'disconnected' | 'error';

export interface McpConnection {
  id: string;
  userId: string;
  mcpServerId: string;
  status: McpStatus;
  lastError?: string;
  config: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// Real-time Event Types
export type ClientEventType =
  | 'subscribe'
  | 'unsubscribe'
  | 'agent:select'
  | 'agent:deploy'
  | 'agent:recall'
  | 'mission:start'
  | 'mission:pause'
  | 'mission:cancel'
  | 'camera:position';

export type ServerEventType =
  | 'agent:updated'
  | 'agent:status_changed'
  | 'agent:position_changed'
  | 'mission:updated'
  | 'mission:progress'
  | 'mission:output'
  | 'mission:completed'
  | 'mission:failed'
  | 'notification'
  | 'achievement:unlocked';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  unlockedAt: string;
}

// Skill Types
export type SkillCategory = 'research' | 'coding' | 'communication' | 'data' | 'integration' | 'orchestration';
export type ExecutionType = 'instant' | 'streaming' | 'long_running';

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  requiredMcp: string[];
  requiredLevel: number;
  executionType: ExecutionType;
  timeout: number;
  speedModifier: number;
  accuracyModifier: number;
  icon: string;
  color: string;
}

// Agent Template Types
export interface AgentTemplate {
  id: string;
  name: string;
  class: AgentClass;
  description: string;
  baseStats: AgentStats;
  baseSkills: string[];
  icon: string;
  color: string;
  requiredLevel: number;
  requiredTier: UserTier;
}
