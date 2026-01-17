import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ user: null });
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
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        ...user,
        achievements: JSON.parse(user.achievements || '[]'),
      },
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ user: null });
  }
}
