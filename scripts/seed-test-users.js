const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const SUPABASE_URL = 'postgresql://postgres.lqwpuxttrslrsugwvtra:A%2FS4DaeQRU4%3FUvk@aws-0-us-west-2.pooler.supabase.com:5432/postgres';
const prisma = new PrismaClient({ datasources: { db: { url: SUPABASE_URL } } });

const TEST_USERS = [
  { username: 'cinephile_max',  email: 'max@midb.test',    password: 'test1234', battles: 300 },
  { username: 'reelqueen',      email: 'reel@midb.test',   password: 'test1234', battles: 250 },
  { username: 'blockbuster_bob',email: 'bob@midb.test',    password: 'test1234', battles: 200 },
  { username: 'arthouselover',  email: 'art@midb.test',    password: 'test1234', battles: 180 },
  { username: 'popcorn_pete',   email: 'pete@midb.test',   password: 'test1234', battles: 150 },
];

const K = 40;

function expected(a, b) { return 1 / (1 + Math.pow(10, (b - a) / 400)); }

function newElo(winnerElo, loserElo) {
  const eW = expected(winnerElo, loserElo);
  const eL = expected(loserElo, winnerElo);
  return [
    Math.round(winnerElo + K * (1 - eW)),
    Math.round(loserElo  + K * (0 - eL)),
  ];
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function getRandomPair(movies) {
  const i = Math.floor(Math.random() * movies.length);
  let j = Math.floor(Math.random() * (movies.length - 1));
  if (j >= i) j++;
  return [movies[i], movies[j]];
}

async function main() {
  console.log('🎬 Fetching movies from Supabase...');
  const movies = await prisma.movie.findMany({
    select: { id: true, title: true, elo: true, matches: true },
  });
  console.log(`   Found ${movies.length} movies`);

  // Build a mutable Elo map so battles compound on each other
  const eloMap = {};
  const matchMap = {};
  for (const m of movies) {
    eloMap[m.id] = m.elo;
    matchMap[m.id] = m.matches;
  }

  // Create / upsert test users
  console.log('\n👤 Creating test users...');
  for (const u of TEST_USERS) {
    const hashed = await bcrypt.hash(u.password, 10);
    await prisma.user.upsert({
      where: { username: u.username },
      update: {},
      create: { username: u.username, email: u.email, password: hashed },
    });
    console.log(`   ✓ ${u.username}`);
  }

  // Simulate battles — update the in-memory Elo map
  console.log('\n⚔️  Simulating battles...');
  let totalBattles = 0;

  for (const u of TEST_USERS) {
    for (let i = 0; i < u.battles; i++) {
      const [a, b] = getRandomPair(movies);
      // Slight bias: higher-rated movie wins 60% of the time (makes rankings stable)
      const winnerProb = eloMap[a.id] >= eloMap[b.id] ? 0.60 : 0.40;
      const winner = Math.random() < winnerProb ? a : b;
      const loser  = winner.id === a.id ? b : a;

      const [newW, newL] = newElo(eloMap[winner.id], eloMap[loser.id]);
      eloMap[winner.id] = newW;
      eloMap[loser.id]  = newL;
      matchMap[winner.id]++;
      matchMap[loser.id]++;
    }
    totalBattles += u.battles;
    process.stdout.write(`   ${u.username}: ${u.battles} battles done\n`);
  }

  // Bulk-update all movies whose Elo changed
  console.log(`\n💾 Writing ${movies.length} Elo updates to database...`);
  let updated = 0;
  for (const m of movies) {
    if (eloMap[m.id] !== m.elo || matchMap[m.id] !== m.matches) {
      await prisma.movie.update({
        where: { id: m.id },
        data: { elo: eloMap[m.id], matches: matchMap[m.id] },
      });
      updated++;
    }
  }

  console.log(`\n✅ Done!`);
  console.log(`   Total battles simulated : ${totalBattles}`);
  console.log(`   Movies with updated Elo : ${updated}`);

  // Show top 10
  const sorted = [...movies].sort((a, b) => eloMap[b.id] - eloMap[a.id]);
  console.log('\n🏆 Top 10 after seeding:');
  sorted.slice(0, 10).forEach((m, i) => {
    console.log(`   ${i + 1}. ${m.title.padEnd(40)} Elo: ${eloMap[m.id]}`);
  });

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
