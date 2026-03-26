const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Temporarily use Supabase URL for this reset
const DATABASE_URL = process.env.SUPABASE_URL || 'postgresql://postgres.lqwpuxttrslrsugwvtra:A%2FS4DaeQRU4%3FUvk@aws-0-us-west-2.pooler.supabase.com:5432/postgres';

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: DATABASE_URL } } });

async function main() {
  const count = await prisma.movie.count({ where: { posterUrl: '' } });
  console.log(`Found ${count} movies with empty string posterUrl`);

  const result = await prisma.movie.updateMany({
    where: { posterUrl: '' },
    data: { posterUrl: null },
  });
  console.log(`✅ Reset ${result.count} movies from "" to null`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
