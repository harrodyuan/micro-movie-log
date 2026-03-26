import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BATCH_SIZE = 20; // process 20 movies per call to stay within serverless timeout

async function getPosterByImdbId(imdbId: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const movie = data.movie_results?.[0];
    return movie?.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null;
  } catch { return null; }
}

async function getPosterBySearch(title: string, year: string): Promise<string | null> {
  try {
    const query = encodeURIComponent(title);
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}&year=${year}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const movie = data.results?.[0];
    return movie?.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null;
  } catch { return null; }
}

export async function GET() {
  const movies = await prisma.movie.findMany({
    where: { posterUrl: null },
    select: { id: true, title: true, date: true },
    orderBy: { createdAt: 'asc' },
    take: BATCH_SIZE,
  });

  if (movies.length === 0) {
    return NextResponse.json({ message: 'All posters filled!', fixed: 0, remaining: 0 });
  }

  let fixed = 0;
  const results: { title: string; status: string }[] = [];

  for (const movie of movies) {
    const year = movie.date?.split('-')[0] || '';
    let posterUrl = await getPosterBySearch(movie.title, year);

    if (!posterUrl) {
      posterUrl = await getPosterBySearch(movie.title, '');
    }

    if (posterUrl) {
      await prisma.movie.update({ where: { id: movie.id }, data: { posterUrl } });
      fixed++;
      results.push({ title: movie.title, status: '✓ fixed' });
    } else {
      // Mark with empty string so it exits the processing queue
      await prisma.movie.update({ where: { id: movie.id }, data: { posterUrl: '' } });
      results.push({ title: movie.title, status: '✗ no poster found' });
    }

    await new Promise(r => setTimeout(r, 100));
  }

  const remaining = await prisma.movie.count({ where: { posterUrl: null } });

  return NextResponse.json({
    message: `Processed ${movies.length} movies`,
    fixed,
    remaining,
    results,
  });
}
