import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const movies = await prisma.movie.findMany({
      where: { matches: { gt: 0 } },
      orderBy: { elo: 'desc' },
      take: 100,
      select: {
        id: true,
        title: true,
        date: true,
        posterUrl: true,
        elo: true,
        matches: true,
      },
    });

    const leaderboard = movies.map((m, i) => ({
      ...m,
      rank: i + 1,
    }));

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
