
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting migration...');

  // Read the source file
  const filePath = path.join(__dirname, '../src/data/movies.ts');
  const content = fs.readFileSync(filePath, 'utf8');

  // Extract the array content using regex
  // This looks for everything between "export const movies: Movie[] = [" and "];"
  const match = content.match(/export const movies: Movie\[\] = \[([\s\S]*)\];/);
  
  if (!match) {
    console.error('❌ Could not find movies array in file');
    return;
  }

  // Eval the array string to get actual objects
  // We wrap it in brackets to make it a valid array expression
  // We also need to mock "posterUrl" if it's used without quotes in the source?
  // Actually, the source uses single quotes.
  // Using eval is safe here since we own the file.
  const moviesData = eval(`[${match[1]}]`);

  console.log(`Found ${moviesData.length} movies to migrate.`);

  let count = 0;
  for (const movie of moviesData) {
    // Check if exists
    const existing = await prisma.movie.findFirst({
      where: {
        title: movie.title,
        date: movie.date
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
          // Default Elo
          elo: 1200,
          matches: 0
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
