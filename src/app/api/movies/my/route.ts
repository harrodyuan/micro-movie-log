import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  }

  const movies = await prisma.movie.findMany({
    where: { userId: session.user.id },
    select: { id: true, title: true, date: true, posterUrl: true, elo: true, matches: true },
    orderBy: { elo: 'desc' },
  });

  return NextResponse.json(movies);
}
