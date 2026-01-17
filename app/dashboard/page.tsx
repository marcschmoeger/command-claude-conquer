'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useStore } from '@/store/useStore';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { MissionPanel } from '@/components/missions/MissionPanel';
import { Minimap } from '@/components/map/Minimap';
import { NotificationToast } from '@/components/ui/NotificationToast';
import { Loader2 } from 'lucide-react';
import type { Agent, Mission, MapZone, UserProfile } from '@/types';

// Dynamic import for 3D map to avoid SSR issues
const CommandMap = dynamic(() => import('@/components/3d/CommandMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-surface">
      <Loader2 className="w-8 h-8 animate-spin text-neon-blue" />
    </div>
  ),
});

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const setUser = useStore((state) => state.setUser);
  const setAgents = useStore((state) => state.setAgents);
  const setMissions = useStore((state) => state.setMissions);
  const setZones = useStore((state) => state.setZones);
  const ui = useStore((state) => state.ui);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check session
        const sessionRes = await fetch('/api/auth/session');
        if (!sessionRes.ok) {
          router.push('/auth/login');
          return;
        }

        // Load profile
        const profileRes = await fetch('/api/profile');
        if (!profileRes.ok) {
          router.push('/auth/login');
          return;
        }

        const { user: profile } = await profileRes.json();

        // Check if onboarding is completed
        if (!profile.onboardingCompleted) {
          router.push('/onboarding');
          return;
        }

        setUser({
          id: profile.id,
          email: profile.email,
          displayName: profile.displayName,
          avatarUrl: profile.avatarUrl,
          commanderAvatar: profile.commanderAvatar,
          baseName: profile.baseName,
          primaryMissionType: profile.primaryMissionType,
          tier: profile.tier,
          level: profile.level,
          experience: profile.experience,
          achievements: profile.achievements || [],
          onboardingCompleted: profile.onboardingCompleted,
          onboardingStep: profile.onboardingStep,
          lastActiveAt: profile.lastActiveAt,
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt,
        } as UserProfile);

        // Load agents
        const agentsRes = await fetch('/api/agents');
        if (agentsRes.ok) {
          const { agents } = await agentsRes.json();
          setAgents(
            agents.map((a: Agent) => ({
              id: a.id,
              userId: a.userId,
              templateId: a.templateId,
              name: a.name,
              class: a.class,
              status: a.status,
              position: a.position,
              currentMissionId: a.currentMissionId,
              level: a.level,
              experience: a.experience,
              stats: a.stats,
              skills: a.skills || [],
              missionsCompleted: a.missionsCompleted,
              totalTasksCompleted: a.totalTasksCompleted,
              successRate: a.successRate,
              controlGroup: a.controlGroup,
              customAvatar: a.customAvatar,
              createdAt: a.createdAt,
              updatedAt: a.updatedAt,
              lastActiveAt: a.lastActiveAt,
            })) as Agent[]
          );
        }

        // Load missions
        const missionsRes = await fetch('/api/missions');
        if (missionsRes.ok) {
          const { missions } = await missionsRes.json();
          setMissions(
            missions.map((m: Mission) => ({
              id: m.id,
              userId: m.userId,
              title: m.title,
              description: m.description,
              type: m.type,
              priority: m.priority,
              blueprint: m.blueprint || {},
              resources: m.resources || {},
              requiredSkills: m.requiredSkills || [],
              zoneId: m.zoneId,
              position: m.position,
              status: m.status,
              progress: m.progress,
              output: m.output || {},
              error: m.error,
              assignedAgents: m.assignedAgents || [],
              startedAt: m.startedAt,
              completedAt: m.completedAt,
              estimatedDuration: m.estimatedDuration,
              createdAt: m.createdAt,
              updatedAt: m.updatedAt,
            })) as Mission[]
          );
        }

        // Load zones
        const zonesRes = await fetch('/api/zones');
        if (zonesRes.ok) {
          const { zones } = await zonesRes.json();
          setZones(
            zones.map((z: MapZone) => ({
              id: z.id,
              userId: z.userId,
              type: z.type,
              name: z.name,
              position: z.position,
              size: z.size,
              maxCapacity: z.maxCapacity,
              currentAgents: [],
              status: 'empty',
              color: z.color,
              missionId: z.missionId,
              createdAt: z.createdAt,
              updatedAt: z.updatedAt,
            })) as MapZone[]
          );
        }

        setLoading(false);
      } catch (error) {
        console.error('Failed to load data:', error);
        router.push('/auth/login');
      }
    };

    loadData();
  }, [router, setUser, setAgents, setMissions, setZones]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-neon-blue mx-auto mb-4" />
          <p className="text-muted-foreground">Loading command center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface overflow-hidden">
      {/* 3D Map (Full Screen Background) */}
      <div className="fixed inset-0 z-0">
        <CommandMap />
      </div>

      {/* Top Bar */}
      <TopBar />

      {/* Sidebar */}
      <Sidebar />

      {/* Right Panel (Mission Details) */}
      <MissionPanel />

      {/* Minimap */}
      {ui.showMinimap && <Minimap />}

      {/* Notifications */}
      <NotificationToast />
    </div>
  );
}
