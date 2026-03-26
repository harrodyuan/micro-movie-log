import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const movies = await prisma.movie.findMany({
      where: { posterUrl: { not: null } },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        date: true,
        posterUrl: true,
        elo: true,
        matches: true,
      },
    });

    return NextResponse.json(movies);
  } catch (error) {
    console.error('Error fetching all movies:', error);
    return NextResponse.json([], { status: 500 });
  }
}
