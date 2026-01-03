'use server';

import { prisma } from '@/lib/db';
import { calculateNewRatings } from '@/lib/ranking';
import { revalidatePath } from 'next/cache';

export async function getVotingPair(username: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        movies: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user || user.movies.length < 2) {
      return null;
    }

    // Pick two random indices
    const count = user.movies.length;
    const idx1 = Math.floor(Math.random() * count);
    let idx2 = Math.floor(Math.random() * count);
    
    while (idx1 === idx2) {
      idx2 = Math.floor(Math.random() * count);
    }

    const movie1Id = user.movies[idx1].id;
    const movie2Id = user.movies[idx2].id;

    // Fetch full movie details for the selected pair
    const [movie1, movie2] = await Promise.all([
      prisma.movie.findUnique({ where: { id: movie1Id } }),
      prisma.movie.findUnique({ where: { id: movie2Id } }),
    ]);

    if (!movie1 || !movie2) return null;

    return [movie1, movie2];
  } catch (error) {
    console.error('Error fetching voting pair:', error);
    return null;
  }
}

export async function submitVote(winnerId: string, loserId: string, username: string) {
  try {
    // 1. Fetch current stats
    const [winner, loser] = await Promise.all([
      prisma.movie.findUnique({ where: { id: winnerId } }),
      prisma.movie.findUnique({ where: { id: loserId } }),
    ]);

    if (!winner || !loser) {
      throw new Error('Movies not found');
    }

    // 2. Calculate new Elo
    // We map the Prisma model to RankedItem interface required by calculateNewRatings
    const winnerRanked = { id: winner.id, elo: winner.elo, matches: winner.matches };
    const loserRanked = { id: loser.id, elo: loser.elo, matches: loser.matches };

    const [newWinnerStats, newLoserStats] = calculateNewRatings(winnerRanked, loserRanked);

    // 3. Update DB transactionally
    await prisma.$transaction([
      prisma.movie.update({
        where: { id: winnerId },
        data: {
          elo: newWinnerStats.elo,
          matches: newWinnerStats.matches,
        },
      }),
      prisma.movie.update({
        where: { id: loserId },
        data: {
          elo: newLoserStats.elo,
          matches: newLoserStats.matches,
        },
      }),
    ]);

    revalidatePath(`/${username}/rankings`);
    return { success: true };
  } catch (error) {
    console.error('Error submitting vote:', error);
    return { success: false, error: 'Failed to submit vote' };
  }
}

export async function getLeaderboard(username: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) return [];

    const movies = await prisma.movie.findMany({
      where: { userId: user.id },
      orderBy: [
        { elo: 'desc' },
        { matches: 'desc' }, // Tie-breaker
      ],
      take: 100, // Limit leaderboard size
    });

    return movies.map((m, i) => ({ ...m, rank: i + 1 }));
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}
