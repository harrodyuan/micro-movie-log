import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { calculateNewRatings } from '@/lib/ranking';

export async function POST(request: NextRequest) {
  try {
    const { movieAId, movieBId, winnerId } = await request.json();

    if (!movieAId || !movieBId || !winnerId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const loserId = winnerId === movieAId ? movieBId : movieAId;

    const [winner, loser] = await Promise.all([
      prisma.movie.findUnique({ where: { id: winnerId } }),
      prisma.movie.findUnique({ where: { id: loserId } }),
    ]);

    if (!winner || !loser) {
      return NextResponse.json({ error: 'Movies not found' }, { status: 404 });
    }

    const [newWinner, newLoser] = calculateNewRatings(
      { id: winner.id, elo: winner.elo, matches: winner.matches },
      { id: loser.id, elo: loser.elo, matches: loser.matches }
    );

    await prisma.$transaction([
      prisma.movie.update({
        where: { id: winner.id },
        data: { elo: newWinner.elo, matches: newWinner.matches },
      }),
      prisma.movie.update({
        where: { id: loser.id },
        data: { elo: newLoser.elo, matches: newLoser.matches },
      }),
    ]);

    return NextResponse.json({
      winner: { id: newWinner.id, elo: newWinner.elo },
      loser: { id: newLoser.id, elo: newLoser.elo },
    });
  } catch (error) {
    console.error('Battle vote error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
