require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting migration...');

  const filePath = path.join(__dirname, '../src/data/movies.ts');
  const content = fs.readFileSync(filePath, 'utf8');

  const match = content.match(/export const movies: Movie\[\] = \[([\s\S]*)\];/);
  
  if (!match) {
    console.error('❌ Could not find movies array in file');
    return;
  }

  const moviesData = eval(`[${match[1]}]`);
  console.log(`Found ${moviesData.length} movies to migrate.`);

  // Create default user
  const user = await prisma.user.upsert({
    where: { username: 'bigdirectorharold' },
    update: {},
    create: {
      username: 'bigdirectorharold',
      bio: 'The creator of this movie log.',
    }
  });
  console.log(`👤 Using user: ${user.username} (${user.id})`);

  let count = 0;
  for (const movie of moviesData) {
    const existing = await prisma.movie.findFirst({
      where: {
        title: movie.title,
        date: movie.date,
        userId: user.id
      }
    });

    if (!existing) {
      await prisma.movie.create({
        data: {
          title: movie.title,
          date: movie.date,
          rating: movie.rating || 0,
          review: movie.review || null,
          posterUrl: movie.posterUrl || null,
          location: movie.location || null,
          elo: 1200,
          matches: 0,
          userId: user.id
        }
      });
      process.stdout.write('.');
      count++;
    }
  }

  console.log(`\n✅ Migration complete! Added ${count} new movies.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
