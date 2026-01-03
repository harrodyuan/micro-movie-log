import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Film } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = await params;
  
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      movies: {
        orderBy: { date: 'desc' },
        select: {
          id: true,
          title: true,
          date: true,
          rating: true,
          posterUrl: true,
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">@{user.username}</h1>
          {user.bio && <p className="text-zinc-400">{user.bio}</p>}
          <p className="text-sm text-zinc-500 mt-2">{user.movies.length} movies</p>
        </header>

        {/* Movie Grid */}
        {user.movies.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-neutral-800 rounded-2xl">
            <Film className="w-12 h-12 mx-auto mb-4 text-zinc-700" />
            <p className="text-zinc-500">No movies in this collection yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {user.movies.map((movie) => (
              <div key={movie.id} className="group">
                <div className="aspect-[2/3] rounded-lg overflow-hidden bg-neutral-900 mb-2">
                  {movie.posterUrl ? (
                    <img 
                      src={movie.posterUrl} 
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-700">
                      <Film className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium text-white line-clamp-2">{movie.title}</p>
                <p className="text-xs text-zinc-500">{movie.date.split('-')[0]}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
