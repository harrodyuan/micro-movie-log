const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { PrismaClient } = require('@prisma/client');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

const prisma = new PrismaClient();

async function searchMovie(query, year) {
  if (!TMDB_API_KEY) {
    console.error('TMDB_API_KEY not set in .env');
    return null;
  }

  // Clean up the query - remove anniversary/screening suffixes
  const cleanQuery = query
    .replace(/\s*[-–]\s*(40th|45th|30th|50th)?\s*Anniversary.*$/i, '')
    .replace(/\s*\(FF25\)$/i, '')
    .replace(/\s*[-–]\s*Early Access Screening$/i, '')
    .replace(/:\s*The Grand Finale$/i, '')
    .replace(/:\s*Fire and Ash$/i, '')
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
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return data.results[0];
    }
    
    // Try without year if no results
    if (year) {
      params.delete('year');
      const retryResponse = await fetch(`${TMDB_BASE_URL}/search/movie?${params}`);
      const retryData = await retryResponse.json();
      if (retryData.results && retryData.results.length > 0) {
        return retryData.results[0];
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Failed to search for "${query}":`, error);
    return null;
  }
}

function getPosterUrl(posterPath) {
  if (!posterPath) return null;
  return `${TMDB_IMAGE_BASE}${posterPath}`;
}

async function main() {
  console.log('Fetching all movies from database...');
  
  const movies = await prisma.movie.findMany({
    select: {
      id: true,
      title: true,
      date: true,
      posterUrl: true,
    }
  });

  console.log(`Found ${movies.length} movies`);
  
  let updated = 0;
  let failed = 0;
  
  for (const movie of movies) {
    // Extract year from date
    const year = movie.date ? new Date(movie.date).getFullYear() : null;
    
    console.log(`\nSearching for: "${movie.title}" (${year || 'unknown year'})`);
    
    const tmdbMovie = await searchMovie(movie.title, year);
    
    if (tmdbMovie && tmdbMovie.poster_path) {
      const posterUrl = getPosterUrl(tmdbMovie.poster_path);
      
      await prisma.movie.update({
        where: { id: movie.id },
        data: { posterUrl }
      });
      
      console.log(`  ✓ Found: ${tmdbMovie.title} -> ${posterUrl}`);
      updated++;
    } else {
      console.log(`  ✗ No poster found`);
      failed++;
    }
    
    // Rate limiting - TMDB allows 40 requests per 10 seconds
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  
  console.log(`\n========================================`);
  console.log(`Done! Updated: ${updated}, Failed: ${failed}`);
  console.log(`========================================`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
