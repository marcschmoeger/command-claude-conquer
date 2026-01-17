import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { hashPassword, createSession, setSessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password, displayName } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        displayName: displayName || null,
      },
    });

    // Create default zones for the user
    await prisma.mapZone.createMany({
      data: [
        {
          userId: user.id,
          type: 'barracks',
          name: 'Barracks',
          positionX: -30,
          positionY: 0,
          positionZ: 0,
          color: '#4CAF50',
          maxCapacity: 20,
        },
        {
          userId: user.id,
          type: 'mission',
          name: 'Mission Zone Alpha',
          positionX: 20,
          positionY: 0,
          positionZ: -20,
          color: '#8B5CF6',
          maxCapacity: 5,
        },
        {
          userId: user.id,
          type: 'mission',
          name: 'Mission Zone Beta',
          positionX: 20,
          positionY: 0,
          positionZ: 20,
          color: '#00D4FF',
          maxCapacity: 5,
        },
        {
          userId: user.id,
          type: 'mission',
          name: 'Mission Zone Gamma',
          positionX: 50,
          positionY: 0,
          positionZ: 0,
          color: '#F59E0B',
          maxCapacity: 5,
        },
      ],
    });

    // Create starter agents
    await prisma.agent.createMany({
      data: [
        {
          userId: user.id,
          templateId: 'scout-basic',
          name: 'Scout Alpha',
          class: 'scout',
          positionX: -35,
          positionY: 0,
          positionZ: -5,
          skills: JSON.stringify(['web_search', 'document_analysis', 'synthesis']),
          statSpeed: 8,
          statAccuracy: 6,
          statStamina: 5,
          statVersatility: 7,
        },
        {
          userId: user.id,
          templateId: 'builder-basic',
          name: 'Builder Prime',
          class: 'builder',
          positionX: -30,
          positionY: 0,
          positionZ: 0,
          skills: JSON.stringify(['code_generation', 'code_review', 'file_operations']),
          statSpeed: 5,
          statAccuracy: 7,
          statStamina: 8,
          statVersatility: 6,
        },
        {
          userId: user.id,
          templateId: 'courier-basic',
          name: 'Courier Swift',
          class: 'courier',
          positionX: -25,
          positionY: 0,
          positionZ: 5,
          skills: JSON.stringify(['send_notification', 'email_compose']),
          statSpeed: 9,
          statAccuracy: 5,
          statStamina: 6,
          statVersatility: 7,
        },
      ],
    });

    // Create session
    const token = await createSession(user.id, user.email);

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
      },
    });

    setSessionCookie(response, token);

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
