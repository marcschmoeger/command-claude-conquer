import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getSession } from '@/lib/auth';
import { getTemplateById } from '@/data/agentTemplates';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const agents = await prisma.agent.findMany({
    where: { userId: session.userId },
  });

  return NextResponse.json({
    agents: agents.map((a) => ({
      ...a,
      skills: JSON.parse(a.skills || '[]'),
    })),
  });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { templateId, name, position } = body;

  // Get template
  const template = getTemplateById(templateId);
  if (!template) {
    return NextResponse.json({ error: 'Invalid template' }, { status: 400 });
  }

  // Create agent
  const agent = await prisma.agent.create({
    data: {
      userId: session.userId,
      templateId,
      name: name || template.name,
      class: template.class,
      positionX: position?.x || 0,
      positionY: position?.y || 0,
      positionZ: position?.z || 0,
      statSpeed: template.baseStats.speed,
      statAccuracy: template.baseStats.accuracy,
      statStamina: template.baseStats.stamina,
      statVersatility: template.baseStats.versatility,
      skills: JSON.stringify(template.baseSkills),
    },
  });

  return NextResponse.json({
    agent: {
      ...agent,
      skills: JSON.parse(agent.skills || '[]'),
    },
  });
}
