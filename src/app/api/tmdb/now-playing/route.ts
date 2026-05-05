import { NextResponse } from 'next/server';

const KEY  = process.env.TMDB_API_KEY;
const BASE = 'https://api.themoviedb.org/3';

export const revalidate = 3600; // refresh once per hour

export async function GET() {
  if (!KEY) return NextResponse.json([]);
  try {
    const res  = await fetch(`${BASE}/movie/now_playing?api_key=${KEY}&language=en-US&page=1`);
    const data = await res.json();
    return NextResponse.json(data.results?.slice(0, 20) || []);
  } catch {
    return NextResponse.json([]);
  }
}
