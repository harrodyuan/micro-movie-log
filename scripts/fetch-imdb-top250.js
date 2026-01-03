const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { PrismaClient } = require('@prisma/client');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

const prisma = new PrismaClient();

// IMDB Top 250 movies (as of 2024) - curated list with titles and years
const IMDB_TOP_250 = [
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
  { title: "The Dark Knight", year: 2008 },
  { title: "The Godfather Part II", year: 1974 },
  { title: "12 Angry Men", year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: "The Lord of the Rings: The Return of the King", year: 2003 },
  { title: "Pulp Fiction", year: 1994 },
  { title: "The Lord of the Rings: The Fellowship of the Ring", year: 2001 },
  { title: "Forrest Gump", year: 1994 },
  { title: "The Good, the Bad and the Ugly", year: 1966 },
  { title: "Fight Club", year: 1999 },
  { title: "The Lord of the Rings: The Two Towers", year: 2002 },
  { title: "Inception", year: 2010 },
  { title: "Star Wars: Episode V - The Empire Strikes Back", year: 1980 },
  { title: "The Matrix", year: 1999 },
  { title: "Goodfellas", year: 1990 },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: "Se7en", year: 1995 },
  { title: "Seven Samurai", year: 1954 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: "The Silence of the Lambs", year: 1991 },
  { title: "Saving Private Ryan", year: 1998 },
  { title: "City of God", year: 2002 },
  { title: "Interstellar", year: 2014 },
  { title: "The Green Mile", year: 1999 },
  { title: "Spirited Away", year: 2001 },
  { title: "Parasite", year: 2019 },
  { title: "Leon: The Professional", year: 1994 },
  { title: "The Usual Suspects", year: 1995 },
  { title: "Harakiri", year: 1962 },
  { title: "The Lion King", year: 1994 },
  { title: "Back to the Future", year: 1985 },
  { title: "The Pianist", year: 2002 },
  { title: "Terminator 2: Judgment Day", year: 1991 },
  { title: "American History X", year: 1998 },
  { title: "Modern Times", year: 1936 },
  { title: "Psycho", year: 1960 },
  { title: "Gladiator", year: 2000 },
  { title: "City Lights", year: 1931 },
  { title: "The Departed", year: 2006 },
  { title: "Whiplash", year: 2014 },
  { title: "The Intouchables", year: 2011 },
  { title: "The Prestige", year: 2006 },
  { title: "Grave of the Fireflies", year: 1988 },
  { title: "Casablanca", year: 1942 },
  { title: "Once Upon a Time in the West", year: 1968 },
  { title: "Cinema Paradiso", year: 1988 },
  { title: "Rear Window", year: 1954 },
  { title: "Alien", year: 1979 },
  { title: "Apocalypse Now", year: 1979 },
  { title: "Memento", year: 2000 },
  { title: "Django Unchained", year: 2012 },
  { title: "Raiders of the Lost Ark", year: 1981 },
  { title: "The Lives of Others", year: 2006 },
  { title: "WALL-E", year: 2008 },
  { title: "Sunset Boulevard", year: 1950 },
  { title: "Paths of Glory", year: 1957 },
  { title: "The Shining", year: 1980 },
  { title: "The Great Dictator", year: 1940 },
  { title: "Avengers: Infinity War", year: 2018 },
  { title: "Witness for the Prosecution", year: 1957 },
  { title: "Aliens", year: 1986 },
  { title: "American Beauty", year: 1999 },
  { title: "Dr. Strangelove", year: 1964 },
  { title: "Spider-Man: Into the Spider-Verse", year: 2018 },
  { title: "The Dark Knight Rises", year: 2012 },
  { title: "Oldboy", year: 2003 },
  { title: "Coco", year: 2017 },
  { title: "Braveheart", year: 1995 },
  { title: "Amadeus", year: 1984 },
  { title: "Toy Story", year: 1995 },
  { title: "Das Boot", year: 1981 },
  { title: "Inglourious Basterds", year: 2009 },
  { title: "Princess Mononoke", year: 1997 },
  { title: "Avengers: Endgame", year: 2019 },
  { title: "Good Will Hunting", year: 1997 },
  { title: "Once Upon a Time in America", year: 1984 },
  { title: "Requiem for a Dream", year: 2000 },
  { title: "Toy Story 3", year: 2010 },
  { title: "Star Wars: Episode IV - A New Hope", year: 1977 },
  { title: "Reservoir Dogs", year: 1992 },
  { title: "Singin' in the Rain", year: 1952 },
  { title: "Capernaum", year: 2018 },
  { title: "2001: A Space Odyssey", year: 1968 },
  { title: "Eternal Sunshine of the Spotless Mind", year: 2004 },
  { title: "Full Metal Jacket", year: 1987 },
  { title: "The Hunt", year: 2012 },
  { title: "Ikiru", year: 1952 },
  { title: "A Clockwork Orange", year: 1971 },
  { title: "Snatch", year: 2000 },
  { title: "Taxi Driver", year: 1976 },
  { title: "Lawrence of Arabia", year: 1962 },
  { title: "Amélie", year: 2001 },
  { title: "Bicycle Thieves", year: 1948 },
  { title: "Vertigo", year: 1958 },
  { title: "North by Northwest", year: 1959 },
  { title: "M", year: 1931 },
  { title: "Scarface", year: 1983 },
  { title: "The Sting", year: 1973 },
  { title: "Heat", year: 1995 },
  { title: "Metropolis", year: 1927 },
  { title: "A Separation", year: 2011 },
  { title: "Come and See", year: 1985 },
  { title: "Rashomon", year: 1950 },
  { title: "Incendies", year: 2010 },
  { title: "The Kid", year: 1921 },
  { title: "1917", year: 2019 },
  { title: "Dangal", year: 2016 },
  { title: "To Kill a Mockingbird", year: 1962 },
  { title: "Top Gun: Maverick", year: 2022 },
  { title: "Yojimbo", year: 1961 },
  { title: "The Father", year: 2020 },
  { title: "The Apartment", year: 1960 },
  { title: "Downfall", year: 2004 },
  { title: "For a Few Dollars More", year: 1965 },
  { title: "Batman Begins", year: 2005 },
  { title: "Some Like It Hot", year: 1959 },
  { title: "Unforgiven", year: 1992 },
  { title: "Ran", year: 1985 },
  { title: "The Wolf of Wall Street", year: 2013 },
  { title: "Children of Heaven", year: 1997 },
  { title: "A Beautiful Mind", year: 2001 },
  { title: "All About Eve", year: 1950 },
  { title: "Pan's Labyrinth", year: 2006 },
  { title: "Casino", year: 1995 },
  { title: "The Truman Show", year: 1998 },
  { title: "There Will Be Blood", year: 2007 },
  { title: "Shutter Island", year: 2010 },
  { title: "Joker", year: 2019 },
  { title: "The Secret in Their Eyes", year: 2009 },
  { title: "Up", year: 2009 },
  { title: "My Neighbor Totoro", year: 1988 },
  { title: "The Great Escape", year: 1963 },
  { title: "No Country for Old Men", year: 2007 },
  { title: "Monty Python and the Holy Grail", year: 1975 },
  { title: "Kill Bill: Vol. 1", year: 2003 },
  { title: "Judgment at Nuremberg", year: 1961 },
  { title: "The Seventh Seal", year: 1957 },
  { title: "Raging Bull", year: 1980 },
  { title: "Chinatown", year: 1974 },
  { title: "V for Vendetta", year: 2005 },
  { title: "Inside Out", year: 2015 },
  { title: "The Thing", year: 1982 },
  { title: "Dial M for Murder", year: 1954 },
  { title: "Warrior", year: 2011 },
  { title: "The Treasure of the Sierra Madre", year: 1948 },
  { title: "Howl's Moving Castle", year: 2004 },
  { title: "The Bridge on the River Kwai", year: 1957 },
  { title: "The Gold Rush", year: 1925 },
  { title: "Lock, Stock and Two Smoking Barrels", year: 1998 },
  { title: "Three Billboards Outside Ebbing, Missouri", year: 2017 },
  { title: "The Elephant Man", year: 1980 },
  { title: "Trainspotting", year: 1996 },
  { title: "The Third Man", year: 1949 },
  { title: "Gran Torino", year: 2008 },
  { title: "Catch Me If You Can", year: 2002 },
  { title: "The General", year: 1926 },
  { title: "Fargo", year: 1996 },
  { title: "Klaus", year: 2019 },
  { title: "Wild Strawberries", year: 1957 },
  { title: "Prisoners", year: 2013 },
  { title: "Million Dollar Baby", year: 2004 },
  { title: "Blade Runner", year: 1982 },
  { title: "Before Sunrise", year: 1995 },
  { title: "The Sixth Sense", year: 1999 },
  { title: "The Grand Budapest Hotel", year: 2014 },
  { title: "Gone with the Wind", year: 1939 },
  { title: "Sherlock Jr.", year: 1924 },
  { title: "Barry Lyndon", year: 1975 },
  { title: "Spider-Man: Across the Spider-Verse", year: 2023 },
  { title: "The Banshees of Inisherin", year: 2022 },
  { title: "On the Waterfront", year: 1954 },
  { title: "In the Name of the Father", year: 1993 },
  { title: "The Deer Hunter", year: 1978 },
  { title: "Rush", year: 2013 },
  { title: "Cool Hand Luke", year: 1967 },
  { title: "Mary and Max", year: 2009 },
  { title: "Hacksaw Ridge", year: 2016 },
  { title: "Rebecca", year: 1940 },
  { title: "The Wages of Fear", year: 1953 },
  { title: "Hachi: A Dog's Tale", year: 2009 },
  { title: "Tokyo Story", year: 1953 },
  { title: "Gone Girl", year: 2014 },
  { title: "How to Train Your Dragon", year: 2010 },
  { title: "Room", year: 2015 },
  { title: "Pather Panchali", year: 1955 },
  { title: "The Handmaiden", year: 2016 },
  { title: "Ford v Ferrari", year: 2019 },
  { title: "Sunrise", year: 1927 },
  { title: "La Haine", year: 1995 },
  { title: "It Happened One Night", year: 1934 },
  { title: "Andhadhun", year: 2018 },
  { title: "The Passion of Joan of Arc", year: 1928 },
  { title: "Dead Poets Society", year: 1989 },
  { title: "The Help", year: 2011 },
  { title: "The Exorcist", year: 1973 },
  { title: "Dune", year: 2021 },
  { title: "Jai Bhim", year: 2021 },
  { title: "Memories of Murder", year: 2003 },
  { title: "Stand by Me", year: 1986 },
  { title: "The Battle of Algiers", year: 1966 },
  { title: "Logan", year: 2017 },
  { title: "The Terminator", year: 1984 },
  { title: "Butch Cassidy and the Sundance Kid", year: 1969 },
  { title: "Monsters, Inc.", year: 2001 },
  { title: "Network", year: 1976 },
  { title: "The Wizard of Oz", year: 1939 },
  { title: "Platoon", year: 1986 },
  { title: "Ratatouille", year: 2007 },
  { title: "The Princess Bride", year: 1987 },
  { title: "Mad Max: Fury Road", year: 2015 },
  { title: "Ben-Hur", year: 1959 },
  { title: "Hotel Rwanda", year: 2004 },
  { title: "Nausicaä of the Valley of the Wind", year: 1984 },
  { title: "Before Sunset", year: 2004 },
  { title: "The Big Lebowski", year: 1998 },
  { title: "Spotlight", year: 2015 },
  { title: "Into the Wild", year: 2007 },
  { title: "12 Years a Slave", year: 2013 },
  { title: "The Incredibles", year: 2004 },
  { title: "La La Land", year: 2016 },
  { title: "The Sound of Music", year: 1965 },
  { title: "Amores Perros", year: 2000 },
  { title: "The Grapes of Wrath", year: 1940 },
  { title: "To Be or Not to Be", year: 1942 },
  { title: "The 400 Blows", year: 1959 },
  { title: "Aladdin", year: 1992 },
  { title: "Finding Nemo", year: 2003 },
  { title: "Groundhog Day", year: 1993 },
  { title: "Persona", year: 1966 },
  { title: "Paris, Texas", year: 1984 },
  { title: "Stalker", year: 1979 },
  { title: "In the Mood for Love", year: 2000 },
  { title: "The Night of the Hunter", year: 1955 },
  { title: "The Best Years of Our Lives", year: 1946 },
  { title: "The Maltese Falcon", year: 1941 },
  { title: "Life of Brian", year: 1979 },
  { title: "Soul", year: 2020 },
  { title: "The Social Network", year: 2010 },
  { title: "Everything Everywhere All at Once", year: 2022 },
  { title: "Oppenheimer", year: 2023 },
];

async function searchTMDB(title, year) {
  if (!TMDB_API_KEY) return null;

  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    query: title,
    year: year.toString(),
  });

  try {
    const response = await fetch(`${TMDB_BASE_URL}/search/movie?${params}`);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const movie = data.results[0];
      return {
        posterUrl: movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : null,
        tmdbId: movie.id,
      };
    }
    return null;
  } catch (error) {
    console.error(`Error searching TMDB for ${title}:`, error);
    return null;
  }
}

async function main() {
  console.log('Fetching IMDB Top 250 movies...\n');

  // Get admin user to assign movies to
  let adminUser = await prisma.user.findUnique({
    where: { username: 'imdb_top250' }
  });

  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        username: 'imdb_top250',
        bio: 'IMDB Top 250 Movies Collection'
      }
    });
    console.log('Created imdb_top250 user\n');
  }

  let added = 0;
  let skipped = 0;

  for (const movie of IMDB_TOP_250) {
    // Check if movie already exists
    const existing = await prisma.movie.findFirst({
      where: {
        title: movie.title,
        userId: adminUser.id
      }
    });

    if (existing) {
      console.log(`⏭ Skipping: ${movie.title} (already exists)`);
      skipped++;
      continue;
    }

    // Get poster from TMDB
    const tmdbData = await searchTMDB(movie.title, movie.year);
    
    await prisma.movie.create({
      data: {
        title: movie.title,
        date: `${movie.year}-01-01`,
        rating: 5,
        posterUrl: tmdbData?.posterUrl || null,
        userId: adminUser.id,
      }
    });

    console.log(`✓ Added: ${movie.title} (${movie.year})`);
    added++;

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log(`\n========================================`);
  console.log(`Done! Added: ${added}, Skipped: ${skipped}`);
  console.log(`========================================`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
