
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Hardcoded movie data since we can't easily import TS files in a JS script without setup
// I'll read the file content directly or just paste the array here.
// For simplicity in this environment, I will read the file and parse it.

const fs = require('fs');
const path = require('path');

async function main() {
  console.log('Starting migration...');
  
  // Read the TS file
  const moviesFile = fs.readFileSync(path.join(__dirname, '../src/data/movies.ts'), 'utf8');
  
  // quick and dirty regex to parse the object array from the TS file
  // This is safer than eval()
  const match = moviesFile.match(/export const movies: Movie\[\] = (\[[\s\S]*?\]);/);
  
  if (!match) {
    console.error('Could not find movies array');
    return;
  }

  // We need to make the string valid JSON to parse it
  // 1. Remove comments // ...
  // 2. Quote keys (id: -> "id":)
  // 3. Convert single quotes to double quotes
  
  // Actually, since this is a one-off script, let's just use a smarter way:
  // We'll create a temporary TS file that imports the data and uses Prisma to save it.
}

// Rewriting strategy: Create a ts-node compatible script
