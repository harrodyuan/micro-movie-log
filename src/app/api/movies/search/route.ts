import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim();
  if (!q || q.length < 2) return NextResponse.json([]);

  try {
    const movies = await prisma.movie.findMany({
      where: {
        title: { contains: q, mode: 'insensitive' },
      },
      select: {
        id: true,
        title: true,
        date: true,
        posterUrl: true,
        userId: true,
      },
      orderBy: { title: 'asc' },
      take: 20,
    });

    return NextResponse.json(movies);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}
