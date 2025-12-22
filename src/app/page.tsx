
import { prisma } from '@/lib/db';
import MovieDashboard from '@/components/MovieDashboard';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const movies = await prisma.movie.findMany({
    orderBy: {
      date: 'desc'
    }
  });

  // Transform data to plain objects for Client Component and match the Interface
  const formattedMovies = movies.map(movie => ({
    id: movie.id,
    title: movie.title,
    date: movie.date,
    rating: movie.rating,
    review: movie.review,
    posterUrl: movie.posterUrl,
    location: movie.location,
    elo: movie.elo,
    matches: movie.matches
  }));

  return <MovieDashboard initialMovies={formattedMovies} />;
}
