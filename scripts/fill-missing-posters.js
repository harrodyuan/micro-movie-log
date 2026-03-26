const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const TMDB_API_KEY = process.env.TMDB_API_KEY;

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

// Build a map of title → imdb_id from the CSV
function buildImdbMap(csvPath) {
  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.trim().split('\n');
  const map = new Map();
  for (let i = 1; i < lines.length; i++) {
    const cols = [];
    let current = '';
    let inQuotes = false;
    for (const ch of lines[i]) {
      if (ch === '"') { inQuotes = !inQuotes; }
      else if (ch === ',' && !inQuotes) { cols.push(current.trim()); current = ''; }
      else { current += ch; }
    }
    cols.push(current.trim());
    const title = cols[4] || cols[5]; // Title or Original Title
    const imdbId = cols[1]; // Const
    if (title && imdbId) map.set(title.toLowerCase(), imdbId);
  }
  return map;
}

async function getPosterByImdbId(imdbId) {
  try {
    const url = `https://api.themoviedb.org/3/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const movie = data.movie_results?.[0];
    return movie?.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null;
  } catch { return null; }
}

async function getPosterBySearch(title, year) {
  try {
    const query = encodeURIComponent(title);
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}&year=${year}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const movie = data.results?.[0];
    return movie?.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null;
  } catch { return null; }
}

async function main() {
  const csvPath = path.join(__dirname, '../../be33f45b-cf71-4484-a4e1-786fe6d640ac.csv');
  const imdbMap = buildImdbMap(csvPath);

  // Get all movies with no poster
  const movies = await prisma.movie.findMany({
    where: { posterUrl: null },
    select: { id: true, title: true, date: true },
    orderBy: { createdAt: 'asc' },
  });

  console.log(`🖼  Found ${movies.length} movies with no poster. Filling in...\n`);

  let fixed = 0;
  let stillMissing = 0;

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    const year = movie.date?.split('-')[0] || '';
    
    // Try IMDB ID first
    const imdbId = imdbMap.get(movie.title.toLowerCase());
    let posterUrl = null;

    if (imdbId) {
      posterUrl = await getPosterByImdbId(imdbId);
    }
    // Fallback: search by title
    if (!posterUrl) {
      posterUrl = await getPosterBySearch(movie.title, year);
    }

    if (posterUrl) {
      await prisma.movie.update({
        where: { id: movie.id },
        data: { posterUrl },
      });
      fixed++;
      console.log(`✓ [${i + 1}/${movies.length}] ${movie.title} (${year}) 🖼`);
    } else {
      stillMissing++;
      console.log(`✗ [${i + 1}/${movies.length}] ${movie.title} (${year}) — still no poster`);
    }

    // 300ms delay to avoid rate limit
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ Fixed: ${fixed} | Still missing: ${stillMissing}`);
  console.log(`${'='.repeat(50)}`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
