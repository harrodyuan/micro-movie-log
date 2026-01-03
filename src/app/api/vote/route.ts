import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { calculateNewRatings } from '@/lib/ranking';

export async function POST(request: Request) {
  try {
    const { userId, movieAId, movieBId, winnerId } = await request.json();

    if (!userId || !movieAId || !movieBId || !winnerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get today's date string
    const today = new Date();
    const battleDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // Check if user already voted today
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_battleDate: {
          userId,
          battleDate
        }
      }
    });

    if (existingVote) {
      return NextResponse.json(
        { error: 'Already voted today', vote: existingVote },
        { status: 409 }
      );
    }

    // Fetch current movie stats to calculate Elo
    const [winner, loser] = await Promise.all([
      prisma.movie.findUnique({ where: { id: winnerId } }),
      prisma.movie.findUnique({ where: { id: winnerId === movieAId ? movieBId : movieAId } }),
    ]);

    if (!winner || !loser) {
      return NextResponse.json(
        { error: 'Movies not found' },
        { status: 404 }
      );
    }

    // Calculate new Elo ratings
    const winnerRanked = { id: winner.id, elo: winner.elo, matches: winner.matches };
    const loserRanked = { id: loser.id, elo: loser.elo, matches: loser.matches };
    const [newWinnerStats, newLoserStats] = calculateNewRatings(winnerRanked, loserRanked);

    // Create the vote AND update Elo in a transaction
    const [vote] = await prisma.$transaction([
      prisma.vote.create({
        data: {
          battleDate,
          movieAId,
          movieBId,
          winnerId,
          userId
        }
      }),
      prisma.movie.update({
        where: { id: winnerId },
        data: {
          elo: newWinnerStats.elo,
          matches: newWinnerStats.matches,
        },
      }),
      prisma.movie.update({
        where: { id: loser.id },
        data: {
          elo: newLoserStats.elo,
          matches: newLoserStats.matches,
        },
      }),
    ]);

    return NextResponse.json({ vote });
  } catch (error) {
    console.error('Error saving vote:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get user's vote for today
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    const today = new Date();
    const battleDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const vote = await prisma.vote.findUnique({
      where: {
        userId_battleDate: {
          userId,
          battleDate
        }
      }
    });

    return NextResponse.json({ vote });
  } catch (error) {
    console.error('Error getting vote:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
