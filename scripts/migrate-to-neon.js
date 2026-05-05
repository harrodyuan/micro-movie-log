const { PrismaClient } = require('@prisma/client');

const SUPABASE = 'postgresql://postgres.lqwpuxttrslrsugwvtra:A%2FS4DaeQRU4%3FUvk@aws-0-us-west-2.pooler.supabase.com:5432/postgres';
const NEON     = 'postgresql://neondb_owner:npg_oAjbO8QqRxd3@ep-lively-waterfall-am9k73g9.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require';

const src  = new PrismaClient({ datasources: { db: { url: SUPABASE } } });
const dest = new PrismaClient({ datasources: { db: { url: NEON } } });

async function bulkCopy(label, readFn, model) {
  process.stdout.write(`  ${label}... `);
  const rows = await readFn();
  if (rows.length === 0) { console.log('0 rows, skipped'); return; }
  await model.createMany({ data: rows, skipDuplicates: true });
  console.log(`✅ ${rows.length} rows`);
}

async function main() {
  console.log('🚀 Starting Supabase → Neon migration\n');

  await bulkCopy('Users',      () => src.user.findMany(),      dest.user);
  await bulkCopy('Movies',     () => src.movie.findMany(),     dest.movie);
  await bulkCopy('Votes',      () => src.vote.findMany(),      dest.vote);
  await bulkCopy('Videos',     () => src.video.findMany(),     dest.video);
  await bulkCopy('VideoVotes', () => src.videoVote.findMany(), dest.videoVote);

  console.log('\n📊 Verification:');
  const [u, m, v, vid, vv] = await Promise.all([
    dest.user.count(), dest.movie.count(), dest.vote.count(),
    dest.video.count(), dest.videoVote.count(),
  ]);
  console.log(`  Users: ${u} | Movies: ${m} | Votes: ${v} | Videos: ${vid} | VideoVotes: ${vv}`);

  await src.$disconnect();
  await dest.$disconnect();
  console.log('\n✅ Migration complete!');
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
