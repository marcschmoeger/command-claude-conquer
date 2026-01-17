import { AgentTemplate } from '@/types';

export const agentTemplates: AgentTemplate[] = [
  // SCOUT CLASS
  {
    id: 'scout-basic',
    name: 'Scout',
    class: 'scout',
    description: 'Fast reconnaissance agent for research and information gathering',
    baseStats: { speed: 8, accuracy: 6, stamina: 5, versatility: 7 },
    baseSkills: ['web_search', 'document_analysis', 'synthesis'],
    icon: '🔍',
    color: '#10B981',
    requiredLevel: 1,
    requiredTier: 'free',
  },
  {
    id: 'scout-research',
    name: 'Research Scout',
    class: 'scout',
    description: 'Specialized in deep research and academic analysis',
    baseStats: { speed: 6, accuracy: 9, stamina: 6, versatility: 5 },
    baseSkills: ['web_search', 'document_analysis', 'synthesis', 'deep_dive'],
    icon: '📚',
    color: '#059669',
    requiredLevel: 5,
    requiredTier: 'free',
  },
  {
    id: 'scout-competitive',
    name: 'Intel Scout',
    class: 'scout',
    description: 'Expert at competitive analysis and market research',
    baseStats: { speed: 7, accuracy: 8, stamina: 5, versatility: 6 },
    baseSkills: ['web_search', 'competitive_analysis', 'synthesis'],
    icon: '🎯',
    color: '#047857',
    requiredLevel: 10,
    requiredTier: 'pro',
  },

  // BUILDER CLASS
  {
    id: 'builder-basic',
    name: 'Builder',
    class: 'builder',
    description: 'General-purpose code generation and development',
    baseStats: { speed: 5, accuracy: 7, stamina: 8, versatility: 6 },
    baseSkills: ['code_generation', 'code_review', 'file_operations'],
    icon: '🛠️',
    color: '#8B5CF6',
    requiredLevel: 1,
    requiredTier: 'free',
  },
  {
    id: 'builder-frontend',
    name: 'Frontend Builder',
    class: 'builder',
    description: 'Specialized in React, Vue, and modern frontend development',
    baseStats: { speed: 6, accuracy: 8, stamina: 7, versatility: 5 },
    baseSkills: ['code_generation', 'code_review', 'frontend_dev'],
    icon: '🎨',
    color: '#7C3AED',
    requiredLevel: 5,
    requiredTier: 'free',
  },
  {
    id: 'builder-backend',
    name: 'Backend Builder',
    class: 'builder',
    description: 'Expert in APIs, databases, and server-side logic',
    baseStats: { speed: 5, accuracy: 9, stamina: 8, versatility: 5 },
    baseSkills: ['code_generation', 'code_review', 'backend_dev', 'database_ops'],
    icon: '⚙️',
    color: '#6D28D9',
    requiredLevel: 5,
    requiredTier: 'free',
  },
  {
    id: 'builder-fullstack',
    name: 'Fullstack Builder',
    class: 'builder',
    description: 'Versatile developer handling both frontend and backend',
    baseStats: { speed: 5, accuracy: 7, stamina: 8, versatility: 9 },
    baseSkills: ['code_generation', 'code_review', 'frontend_dev', 'backend_dev'],
    icon: '🏗️',
    color: '#5B21B6',
    requiredLevel: 15,
    requiredTier: 'pro',
  },

  // GUARDIAN CLASS
  {
    id: 'guardian-basic',
    name: 'Guardian',
    class: 'guardian',
    description: 'Code quality and testing specialist',
    baseStats: { speed: 4, accuracy: 9, stamina: 7, versatility: 4 },
    baseSkills: ['code_review', 'testing', 'security_scan'],
    icon: '🛡️',
    color: '#EF4444',
    requiredLevel: 3,
    requiredTier: 'free',
  },
  {
    id: 'guardian-security',
    name: 'Security Guardian',
    class: 'guardian',
    description: 'Focused on security audits and vulnerability detection',
    baseStats: { speed: 3, accuracy: 10, stamina: 6, versatility: 3 },
    baseSkills: ['code_review', 'security_scan', 'security_audit'],
    icon: '🔒',
    color: '#DC2626',
    requiredLevel: 10,
    requiredTier: 'pro',
  },
  {
    id: 'guardian-qa',
    name: 'QA Guardian',
    class: 'guardian',
    description: 'Testing expert with comprehensive QA capabilities',
    baseStats: { speed: 5, accuracy: 9, stamina: 8, versatility: 5 },
    baseSkills: ['testing', 'code_review', 'test_generation'],
    icon: '✅',
    color: '#B91C1C',
    requiredLevel: 8,
    requiredTier: 'free',
  },

  // COURIER CLASS
  {
    id: 'courier-basic',
    name: 'Courier',
    class: 'courier',
    description: 'Communication and notification specialist',
    baseStats: { speed: 9, accuracy: 5, stamina: 6, versatility: 7 },
    baseSkills: ['send_notification', 'email_compose'],
    icon: '📨',
    color: '#F59E0B',
    requiredLevel: 2,
    requiredTier: 'free',
  },
  {
    id: 'courier-social',
    name: 'Social Courier',
    class: 'courier',
    description: 'Expert in social media and public communications',
    baseStats: { speed: 8, accuracy: 6, stamina: 7, versatility: 8 },
    baseSkills: ['social_posting', 'email_compose', 'content_writing'],
    icon: '📱',
    color: '#D97706',
    requiredLevel: 7,
    requiredTier: 'pro',
  },
  {
    id: 'courier-docs',
    name: 'Documentation Courier',
    class: 'courier',
    description: 'Specialized in documentation and technical writing',
    baseStats: { speed: 6, accuracy: 8, stamina: 7, versatility: 6 },
    baseSkills: ['content_writing', 'doc_generation', 'notion_ops'],
    icon: '📝',
    color: '#B45309',
    requiredLevel: 5,
    requiredTier: 'free',
  },

  // ANALYST CLASS
  {
    id: 'analyst-basic',
    name: 'Analyst',
    class: 'analyst',
    description: 'Data processing and analysis specialist',
    baseStats: { speed: 4, accuracy: 8, stamina: 7, versatility: 6 },
    baseSkills: ['data_analysis', 'spreadsheet_ops', 'synthesis'],
    icon: '📊',
    color: '#00D4FF',
    requiredLevel: 3,
    requiredTier: 'free',
  },
  {
    id: 'analyst-data',
    name: 'Data Analyst',
    class: 'analyst',
    description: 'Advanced data processing and visualization',
    baseStats: { speed: 4, accuracy: 9, stamina: 8, versatility: 5 },
    baseSkills: ['data_analysis', 'etl', 'database_ops', 'visualization'],
    icon: '📈',
    color: '#0EA5E9',
    requiredLevel: 8,
    requiredTier: 'pro',
  },
  {
    id: 'analyst-bi',
    name: 'BI Analyst',
    class: 'analyst',
    description: 'Business intelligence and reporting expert',
    baseStats: { speed: 5, accuracy: 8, stamina: 7, versatility: 7 },
    baseSkills: ['data_analysis', 'synthesis', 'spreadsheet_ops', 'report_generation'],
    icon: '🎯',
    color: '#0284C7',
    requiredLevel: 12,
    requiredTier: 'pro',
  },

  // COMMANDER CLASS
  {
    id: 'commander-basic',
    name: 'Commander',
    class: 'commander',
    description: 'Agent coordination and mission orchestration',
    baseStats: { speed: 5, accuracy: 7, stamina: 6, versatility: 9 },
    baseSkills: ['agent_coordination', 'task_delegation'],
    icon: '⭐',
    color: '#FFD700',
    requiredLevel: 15,
    requiredTier: 'pro',
  },
  {
    id: 'commander-elite',
    name: 'Elite Commander',
    class: 'commander',
    description: 'Master strategist with advanced orchestration capabilities',
    baseStats: { speed: 6, accuracy: 8, stamina: 7, versatility: 10 },
    baseSkills: ['agent_coordination', 'task_delegation', 'mission_optimization'],
    icon: '👑',
    color: '#FCD34D',
    requiredLevel: 25,
    requiredTier: 'enterprise',
  },
];

export const getTemplateById = (id: string): AgentTemplate | undefined => {
  return agentTemplates.find((t) => t.id === id);
};

export const getTemplatesByClass = (agentClass: string): AgentTemplate[] => {
  return agentTemplates.filter((t) => t.class === agentClass);
};

export const getAvailableTemplates = (userLevel: number, userTier: string): AgentTemplate[] => {
  const tierOrder = ['free', 'pro', 'enterprise'];
  const userTierIndex = tierOrder.indexOf(userTier);

  return agentTemplates.filter((t) => {
    const templateTierIndex = tierOrder.indexOf(t.requiredTier);
    return t.requiredLevel <= userLevel && templateTierIndex <= userTierIndex;
  });
};
