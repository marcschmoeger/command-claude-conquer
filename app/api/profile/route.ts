import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      displayName: true,
      avatarUrl: true,
      commanderAvatar: true,
      baseName: true,
      primaryMissionType: true,
      tier: true,
      level: true,
      experience: true,
      achievements: true,
      onboardingCompleted: true,
      onboardingStep: true,
      lastActiveAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      ...user,
      achievements: JSON.parse(user.achievements || '[]'),
    },
  });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const {
    displayName,
    commanderAvatar,
    baseName,
    primaryMissionType,
    onboardingCompleted,
    onboardingStep,
  } = body;

  const updateData: Record<string, unknown> = {};
  if (displayName !== undefined) updateData.displayName = displayName;
  if (commanderAvatar !== undefined) updateData.commanderAvatar = commanderAvatar;
  if (baseName !== undefined) updateData.baseName = baseName;
  if (primaryMissionType !== undefined) updateData.primaryMissionType = primaryMissionType;
  if (onboardingCompleted !== undefined) updateData.onboardingCompleted = onboardingCompleted;
  if (onboardingStep !== undefined) updateData.onboardingStep = onboardingStep;

  const user = await prisma.user.update({
    where: { id: session.userId },
    data: updateData,
    select: {
      id: true,
      email: true,
      displayName: true,
      avatarUrl: true,
      commanderAvatar: true,
      baseName: true,
      primaryMissionType: true,
      tier: true,
      level: true,
      experience: true,
      achievements: true,
      onboardingCompleted: true,
      onboardingStep: true,
      lastActiveAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({
    user: {
      ...user,
      achievements: JSON.parse(user.achievements || '[]'),
    },
  });
}
