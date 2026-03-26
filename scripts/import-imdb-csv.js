const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const CSV_PATH = process.argv[2] || path.join(__dirname, '../../be33f45b-cf71-4484-a4e1-786fe6d640ac.csv');

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

function parseCSV(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  return lines.slice(1).map(line => {
    // Handle commas inside quoted fields
    const cols = [];
    let current = '';
    let inQuotes = false;
    for (const ch of line) {
      if (ch === '"') { inQuotes = !inQuotes; }
      else if (ch === ',' && !inQuotes) { cols.push(current.trim()); current = ''; }
      else { current += ch; }
    }
    cols.push(current.trim());
    return Object.fromEntries(headers.map((h, i) => [h, cols[i] || '']));
  });
}

async function getPosterFromTMDB(imdbId) {
  try {
    const url = `https://api.themoviedb.org/3/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const movie = data.movie_results?.[0];
    if (movie?.poster_path) {
      return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    }
    return null;
  } catch {
    return null;
  }
}

async function main() {
  console.log('📂 Reading CSV:', CSV_PATH);
  const content = fs.readFileSync(CSV_PATH, 'utf8');
  const rows = parseCSV(content);
  
  // Filter to movies only (skip TV shows etc.)
  const movies = rows.filter(r => r['Title Type'] === 'Movie' || r['Title Type'] === '');
  console.log(`🎬 Found ${movies.length} movies to import`);

  // Find Harold's user
  const user = await prisma.user.findUnique({ where: { username: 'bigdirectorharold' } });
  if (!user) {
    console.error('❌ User bigdirectorharold not found');
    process.exit(1);
  }
  console.log(`👤 Importing as: ${user.username} (${user.id})\n`);

  let added = 0;
  let skipped = 0;
  let noPosters = 0;

  for (let i = 0; i < movies.length; i++) {
    const row = movies[i];
    const title = row['Title'] || row['Original Title'];
    const imdbId = row['Const'];
    const year = row['Year'];
    const yourRating = parseFloat(row['Your Rating']) || 0;
    const dateRated = row['Date Rated'] || row['Release Date'] || `${year}-01-01`;
    const releaseDate = row['Release Date'] || `${year}-01-01`;

    if (!title || !imdbId) continue;

    // Check if already exists for this user
    const existing = await prisma.movie.findFirst({
      where: { userId: user.id, title: { equals: title, mode: 'insensitive' } },
    });
    if (existing) {
      skipped++;
      process.stdout.write(`⏭  [${i + 1}/${movies.length}] Skipped: ${title}\r`);
      continue;
    }

    // Fetch poster from TMDB
    const posterUrl = await getPosterFromTMDB(imdbId);
    if (!posterUrl) noPosters++;

    await prisma.movie.create({
      data: {
        title,
        date: releaseDate.substring(0, 10),
        rating: yourRating,
        posterUrl,
        userId: user.id,
        elo: 1200,
        matches: 0,
      },
    });

    added++;
    console.log(`✓ [${i + 1}/${movies.length}] ${title} (${year}) ${posterUrl ? '🖼' : '📭 no poster'}`);

    // Polite rate limiting — 5 requests/sec to stay safe
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ Done! Added: ${added} | Skipped: ${skipped} | No poster: ${noPosters}`);
  console.log(`${'='.repeat(50)}`);

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
