import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const missions = await prisma.mission.findMany({
    where: { userId: session.userId },
    include: {
      missionAgents: {
        select: { agentId: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({
    missions: missions.map((m) => ({
      ...m,
      blueprint: JSON.parse(m.blueprint || '{}'),
      resources: JSON.parse(m.resources || '{}'),
      requiredSkills: JSON.parse(m.requiredSkills || '[]'),
      output: JSON.parse(m.output || '{}'),
      assignedAgents: m.missionAgents.map((ma) => ma.agentId),
    })),
  });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const {
    title,
    description,
    type = 'general',
    priority = 'normal',
    blueprint,
    requiredSkills = [],
    zoneId,
    position,
    agentIds = [],
  } = body;

  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  // Create mission
  const mission = await prisma.mission.create({
    data: {
      userId: session.userId,
      title,
      description,
      type,
      priority,
      blueprint: JSON.stringify(blueprint || {}),
      requiredSkills: JSON.stringify(requiredSkills),
      zoneId,
      positionX: position?.x || 0,
      positionY: position?.y || 0,
      positionZ: position?.z || 0,
    },
  });

  // Assign agents if provided
  if (agentIds.length > 0) {
    await prisma.missionAgent.createMany({
      data: agentIds.map((agentId: string) => ({
        missionId: mission.id,
        agentId,
      })),
    });

    // Update agent status
    await prisma.agent.updateMany({
      where: { id: { in: agentIds } },
      data: {
        status: 'deploying',
        currentMissionId: mission.id,
      },
    });
  }

  return NextResponse.json({
    mission: {
      ...mission,
      blueprint: JSON.parse(mission.blueprint || '{}'),
      resources: JSON.parse(mission.resources || '{}'),
      requiredSkills: JSON.parse(mission.requiredSkills || '[]'),
      output: JSON.parse(mission.output || '{}'),
      assignedAgents: agentIds,
    },
  });
}
