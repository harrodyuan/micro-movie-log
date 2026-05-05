import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  }

  const { movieId } = await request.json();
  if (!movieId) return NextResponse.json({ error: 'movieId required' }, { status: 400 });

  const source = await prisma.movie.findUnique({ where: { id: movieId } });
  if (!source) return NextResponse.json({ error: 'Movie not found' }, { status: 404 });

  // Check if user already has this title
  const existing = await prisma.movie.findFirst({
    where: { userId: session.user.id, title: source.title },
  });
  if (existing) return NextResponse.json({ error: 'Already in your list', movie: existing }, { status: 409 });

  const movie = await prisma.movie.create({
    data: {
      title: source.title,
      date: source.date,
      posterUrl: source.posterUrl,
      rating: source.rating,
      userId: session.user.id,
      elo: 1200,
      matches: 0,
    },
  });

  return NextResponse.json({ movie });
}
