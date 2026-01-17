import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const keys = await prisma.userApiKey.findMany({
    where: { userId: session.userId },
    select: {
      id: true,
      provider: true,
      isValid: true,
      lastValidatedAt: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ keys });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { provider, key } = await request.json();

  if (!provider || !key) {
    return NextResponse.json(
      { error: 'Provider and key are required' },
      { status: 400 }
    );
  }

  // Upsert the API key
  const apiKey = await prisma.userApiKey.upsert({
    where: {
      userId_provider: {
        userId: session.userId,
        provider,
      },
    },
    update: {
      encryptedKey: key, // In production, encrypt this!
      isValid: true,
      lastValidatedAt: new Date(),
    },
    create: {
      userId: session.userId,
      provider,
      encryptedKey: key, // In production, encrypt this!
      isValid: true,
      lastValidatedAt: new Date(),
    },
    select: {
      id: true,
      provider: true,
      isValid: true,
      lastValidatedAt: true,
    },
  });

  return NextResponse.json({ key: apiKey });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const provider = searchParams.get('provider');

  if (!provider) {
    return NextResponse.json({ error: 'Provider is required' }, { status: 400 });
  }

  await prisma.userApiKey.delete({
    where: {
      userId_provider: {
        userId: session.userId,
        provider,
      },
    },
  });

  return NextResponse.json({ success: true });
}
