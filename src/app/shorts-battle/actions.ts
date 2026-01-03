'use server';

import { prisma } from '@/lib/db';
import { searchShorts } from '@/lib/youtube';
import { calculateNewRatings } from '@/lib/ranking';
import { TOP_VIRAL_SHORTS, VIRAL_SHORTS_CHANNELS } from '@/data/viral-shorts';

// Seed the curated viral shorts list
export async function seedViralShorts(): Promise<number> {
  let count = 0;
  
  for (const short of TOP_VIRAL_SHORTS) {
    try {
      await prisma.video.upsert({
        where: { youtubeId: short.youtubeId },
        update: {
          title: short.title,
          channelTitle: short.channelTitle,
        },
        create: {
          youtubeId: short.youtubeId,
          title: short.title,
          channelTitle: short.channelTitle,
          thumbnailUrl: `https://i.ytimg.com/vi/${short.youtubeId}/oar2.jpg`,
        },
      });
      count++;
    } catch (e) {
      console.error(`Failed to seed ${short.youtubeId}:`, e);
    }
  }
  
  return count;
}

// Fetch more shorts from popular channels via API
export async function fetchFromPopularChannels(): Promise<number> {
  let count = 0;
  
  for (const channel of VIRAL_SHORTS_CHANNELS.slice(0, 5)) {
    try {
      const shorts = await searchShorts(`${channel.name} shorts`, 20);
      
      for (const short of shorts) {
        await prisma.video.upsert({
          where: { youtubeId: short.id },
          update: {
            title: short.title,
            channelTitle: short.channelTitle,
            thumbnailUrl: short.thumbnailUrl,
          },
          create: {
            youtubeId: short.id,
            title: short.title,
            channelTitle: short.channelTitle,
            thumbnailUrl: short.thumbnailUrl,
          },
        });
        count++;
      }
    } catch (e) {
      console.error(`Failed to fetch from ${channel.name}:`, e);
    }
  }
  
  return count;
}

// Legacy function for backward compatibility
export async function fetchAndStoreShorts(query: string = 'trending'): Promise<void> {
  const shorts = await searchShorts(query, 20);
  
  for (const short of shorts) {
    await prisma.video.upsert({
      where: { youtubeId: short.id },
      update: {
        title: short.title,
        channelTitle: short.channelTitle,
        thumbnailUrl: short.thumbnailUrl,
      },
      create: {
        youtubeId: short.id,
        title: short.title,
        channelTitle: short.channelTitle,
        thumbnailUrl: short.thumbnailUrl,
      },
    });
  }
}

export async function getVideoBattlePair(): Promise<{ videoA: any; videoB: any } | null> {
  const videos = await prisma.video.findMany({
    orderBy: { matches: 'asc' },
    take: 10,
  });

  if (videos.length < 2) {
    return null;
  }

  // Randomly pick two videos from the pool
  const shuffled = videos.sort(() => Math.random() - 0.5);
  return {
    videoA: shuffled[0],
    videoB: shuffled[1],
  };
}

export async function submitVideoVote(
  visitorId: string,
  videoAId: string,
  videoBId: string,
  winnerId: string
): Promise<{ success: boolean }> {
  const [videoA, videoB] = await Promise.all([
    prisma.video.findUnique({ where: { id: videoAId } }),
    prisma.video.findUnique({ where: { id: videoBId } }),
  ]);

  if (!videoA || !videoB) {
    return { success: false };
  }

  const loserId = winnerId === videoAId ? videoBId : videoAId;
  const winner = winnerId === videoAId ? videoA : videoB;
  const loser = winnerId === videoAId ? videoB : videoA;

  const [updatedWinner, updatedLoser] = calculateNewRatings(
    { id: winner.id, elo: winner.elo, matches: winner.matches },
    { id: loser.id, elo: loser.elo, matches: loser.matches }
  );

  await prisma.$transaction([
    prisma.video.update({
      where: { id: winnerId },
      data: {
        elo: updatedWinner.elo,
        matches: updatedWinner.matches,
      },
    }),
    prisma.video.update({
      where: { id: loserId },
      data: {
        elo: updatedLoser.elo,
        matches: updatedLoser.matches,
      },
    }),
    prisma.videoVote.create({
      data: {
        visitorId,
        videoAId,
        videoBId,
        winnerId,
      },
    }),
  ]);

  return { success: true };
}

export async function getVideoLeaderboard(limit: number = 20): Promise<any[]> {
  return prisma.video.findMany({
    orderBy: { elo: 'desc' },
    take: limit,
  });
}

export async function getVideoCount(): Promise<number> {
  return prisma.video.count();
}
