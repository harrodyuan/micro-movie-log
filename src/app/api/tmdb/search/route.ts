import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  if (!TMDB_API_KEY) {
    return NextResponse.json({ error: 'TMDB API key not configured' }, { status: 500 });
  }

  try {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      query,
      include_adult: 'false',
    });

    const response = await fetch(`${TMDB_BASE_URL}/search/movie?${params}`);
    const data = await response.json();

    return NextResponse.json({ results: data.results?.slice(0, 10) || [] });
  } catch (error) {
    console.error('TMDB search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
