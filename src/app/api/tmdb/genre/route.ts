import { NextRequest, NextResponse } from 'next/server';

const KEY = process.env.TMDB_API_KEY;

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id || !KEY) return NextResponse.json([]);
  try {
    const res  = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${KEY}&with_genres=${id}&sort_by=vote_average.desc&vote_count.gte=500&language=en-US&page=1`
    );
    const data = await res.json();
    return NextResponse.json(data.results?.slice(0, 20) || []);
  } catch { return NextResponse.json([]); }
}
