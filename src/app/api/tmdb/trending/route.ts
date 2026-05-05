import { NextResponse } from 'next/server';

const KEY = process.env.TMDB_API_KEY;

export const revalidate = 3600;

export async function GET() {
  if (!KEY) return NextResponse.json([]);
  try {
    const res  = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${KEY}&language=en-US`);
    const data = await res.json();
    return NextResponse.json(data.results?.slice(0, 20) || []);
  } catch { return NextResponse.json([]); }
}
