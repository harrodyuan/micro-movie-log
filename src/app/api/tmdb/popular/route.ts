import { NextRequest, NextResponse } from 'next/server';

const KEY = process.env.TMDB_API_KEY;
const BASE = 'https://api.themoviedb.org/3';

export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get('page') || '1';
  if (!KEY) return NextResponse.json([], { status: 500 });
  try {
    const res = await fetch(`${BASE}/movie/popular?api_key=${KEY}&language=en-US&page=${page}`);
    const data = await res.json();
    return NextResponse.json(data.results || []);
  } catch {
    return NextResponse.json([]);
  }
}
