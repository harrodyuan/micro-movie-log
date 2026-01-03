const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
}

export interface TMDBSearchResult {
  results: TMDBMovie[];
  total_results: number;
}

export async function searchMovie(query: string, year?: number): Promise<TMDBMovie | null> {
  if (!TMDB_API_KEY) {
    console.error('TMDB_API_KEY not set');
    return null;
  }

  // Clean up the query - remove anniversary/screening suffixes
  const cleanQuery = query
    .replace(/\s*[-–]\s*(40th|45th|30th|50th)?\s*Anniversary.*$/i, '')
    .replace(/\s*\(FF25\)$/i, '')
    .replace(/\s*[-–]\s*Early Access Screening$/i, '')
    .trim();

  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    query: cleanQuery,
    include_adult: 'false',
  });

  if (year) {
    params.append('year', year.toString());
  }

  try {
    const response = await fetch(`${TMDB_BASE_URL}/search/movie?${params}`);
    const data: TMDBSearchResult = await response.json();

    if (data.results && data.results.length > 0) {
      return data.results[0];
    }
    return null;
  } catch (error) {
    console.error(`Failed to search for "${query}":`, error);
    return null;
  }
}

export function getPosterUrl(posterPath: string | null): string | null {
  if (!posterPath) return null;
  return `${TMDB_IMAGE_BASE}${posterPath}`;
}

export async function getMoviePosterUrl(title: string, year?: number): Promise<string | null> {
  const movie = await searchMovie(title, year);
  if (movie && movie.poster_path) {
    return getPosterUrl(movie.poster_path);
  }
  return null;
}
