import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  }

  const body = await request.json();

  // Accept either a local movieId OR raw TMDB movie data
  let title: string, date: string, posterUrl: string | null, rating: number;

  if (body.movieId) {
    const source = await prisma.movie.findUnique({ where: { id: body.movieId } });
    if (!source) return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    title = source.title; date = source.date; posterUrl = source.posterUrl; rating = source.rating;
  } else if (body.tmdb) {
    const t = body.tmdb;
    title     = t.title;
    date      = t.release_date || '';
    posterUrl = t.poster_path ? `https://image.tmdb.org/t/p/w500${t.poster_path}` : null;
    rating    = t.vote_average ?? 0;
  } else {
    return NextResponse.json({ error: 'movieId or tmdb data required' }, { status: 400 });
  }

  const existing = await prisma.movie.findFirst({
    where: { userId: session.user.id, title },
  });
  if (existing) return NextResponse.json({ error: 'Already in your list', movie: existing }, { status: 409 });

  const movie = await prisma.movie.create({
    data: { title, date, posterUrl, rating, userId: session.user.id, elo: 1200, matches: 0 },
  });

  // Notify followers who haven't added this movie yet — "Have you seen this?"
  const myUsername = session.user.username || session.user.name;
  try {
    const followers = await prisma.follow.findMany({
      where: { followingId: session.user.id },
      select: { followerId: true },
    });
    for (const { followerId } of followers) {
      const alreadyHas = await prisma.movie.findFirst({ where: { userId: followerId, title } });
      if (!alreadyHas) {
        fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/push/notify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: followerId,
            title: `Have you seen "${title}"?`,
            body: `@${myUsername} just added it to their ranking`,
            url: `/movies/${encodeURIComponent(title)}`,
          }),
        }).catch(() => {});
      }
    }
  } catch {}

  return NextResponse.json({ movie });
}
