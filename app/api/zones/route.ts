import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const zones = await prisma.mapZone.findMany({
    where: { userId: session.userId },
  });

  return NextResponse.json({
    zones: zones.map((z) => ({
      id: z.id,
      userId: z.userId,
      type: z.type,
      name: z.name,
      position: { x: z.positionX, y: z.positionY, z: z.positionZ },
      size: { width: z.sizeWidth, height: z.sizeHeight, depth: z.sizeDepth },
      maxCapacity: z.maxCapacity,
      color: z.color,
      missionId: z.missionId,
      createdAt: z.createdAt,
      updatedAt: z.updatedAt,
    })),
  });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { type, name, position, size, maxCapacity, color } = body;

  if (!type || !name) {
    return NextResponse.json(
      { error: 'Type and name are required' },
      { status: 400 }
    );
  }

  const zone = await prisma.mapZone.create({
    data: {
      userId: session.userId,
      type,
      name,
      positionX: position?.x || 0,
      positionY: position?.y || 0,
      positionZ: position?.z || 0,
      sizeWidth: size?.width || 10,
      sizeHeight: size?.height || 10,
      sizeDepth: size?.depth || 10,
      maxCapacity: maxCapacity || 5,
      color: color || '#4a90d9',
    },
  });

  return NextResponse.json({
    zone: {
      id: zone.id,
      userId: zone.userId,
      type: zone.type,
      name: zone.name,
      position: { x: zone.positionX, y: zone.positionY, z: zone.positionZ },
      size: { width: zone.sizeWidth, height: zone.sizeHeight, depth: zone.sizeDepth },
      maxCapacity: zone.maxCapacity,
      color: zone.color,
      missionId: zone.missionId,
      createdAt: zone.createdAt,
      updatedAt: zone.updatedAt,
    },
  });
}
