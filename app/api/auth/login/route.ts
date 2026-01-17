import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyPassword, createSession, setSessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update last active
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() },
    });

    // Create session
    const token = await createSession(user.id, user.email);

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        onboardingCompleted: user.onboardingCompleted,
      },
    });

    setSessionCookie(response, token);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to sign in' },
      { status: 500 }
    );
  }
}
