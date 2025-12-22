import { prisma } from '@/lib/db';
import MovieDashboard from '@/components/MovieDashboard';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function UserLogPage({ params }: PageProps) {
  const { username } = await params;
  
  // Find the user first
  const user = await prisma.user.findUnique({
    where: { username: username }
  });

  if (!user) {
    notFound();
  }

  // Fetch movies for this user
  const movies = await prisma.movie.findMany({
    where: {
      userId: user.id
    },
    orderBy: {
      date: 'desc'
    }
  });

  // Transform data to plain objects
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

  return <MovieDashboard initialMovies={formattedMovies} username={user.username} />;
}
