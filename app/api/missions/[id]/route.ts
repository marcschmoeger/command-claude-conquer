import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const mission = await prisma.mission.findFirst({
    where: {
      id: params.id,
      userId: session.userId,
    },
    include: {
      missionAgents: {
        select: { agentId: true },
      },
    },
  });

  if (!mission) {
    return NextResponse.json({ error: 'Mission not found' }, { status: 404 });
  }

  return NextResponse.json({
    mission: {
      ...mission,
      blueprint: JSON.parse(mission.blueprint || '{}'),
      resources: JSON.parse(mission.resources || '{}'),
      requiredSkills: JSON.parse(mission.requiredSkills || '[]'),
      output: JSON.parse(mission.output || '{}'),
      assignedAgents: mission.missionAgents.map((ma) => ma.agentId),
    },
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { status, progress, output, error: missionError } = body;

  const updateData: Record<string, unknown> = {};
  if (status !== undefined) updateData.status = status;
  if (progress !== undefined) updateData.progress = progress;
  if (output !== undefined) updateData.output = JSON.stringify(output);
  if (missionError !== undefined) updateData.error = missionError;

  // Handle status transitions
  if (status === 'in_progress') {
    updateData.startedAt = new Date();
  }
  if (['completed', 'failed', 'cancelled'].includes(status)) {
    updateData.completedAt = new Date();
  }

  const mission = await prisma.mission.update({
    where: {
      id: params.id,
      userId: session.userId,
    },
    data: updateData,
  });

  // If mission completed/failed/cancelled, update agent statuses
  if (['completed', 'failed', 'cancelled'].includes(status)) {
    const missionAgents = await prisma.missionAgent.findMany({
      where: { missionId: params.id },
      select: { agentId: true },
    });

    if (missionAgents.length > 0) {
      const agentIds = missionAgents.map((ma) => ma.agentId);

      await prisma.agent.updateMany({
        where: { id: { in: agentIds } },
        data: {
          status: 'returning',
          currentMissionId: null,
        },
      });

      // Update mission completed count
      if (status === 'completed') {
        await prisma.agent.updateMany({
          where: { id: { in: agentIds } },
          data: {
            missionsCompleted: { increment: 1 },
          },
        });
      }
    }
  }

  return NextResponse.json({
    mission: {
      ...mission,
      blueprint: JSON.parse(mission.blueprint || '{}'),
      resources: JSON.parse(mission.resources || '{}'),
      requiredSkills: JSON.parse(mission.requiredSkills || '[]'),
      output: JSON.parse(mission.output || '{}'),
    },
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get assigned agents first
  const missionAgents = await prisma.missionAgent.findMany({
    where: { missionId: params.id },
    select: { agentId: true },
  });

  // Delete mission (cascade will delete mission_agents)
  await prisma.mission.delete({
    where: {
      id: params.id,
      userId: session.userId,
    },
  });

  // Reset agent statuses
  if (missionAgents.length > 0) {
    const agentIds = missionAgents.map((ma) => ma.agentId);
    await prisma.agent.updateMany({
      where: { id: { in: agentIds } },
      data: {
        status: 'idle',
        currentMissionId: null,
      },
    });
  }

  return NextResponse.json({ success: true });
}
