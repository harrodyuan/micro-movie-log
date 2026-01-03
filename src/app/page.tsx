import Link from 'next/link';
import { MiniBattleArena } from '@/components/MiniBattleArena';
import { BattleOfToday } from '@/components/BattleOfToday';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let movies: { id: string; title: string; date: string; rating: number; location: string | null; posterUrl: string | null }[] = [];
  let dbError: string | null = null;
  
  try {
    // Fetch Harold's movies for the preview
    const user = await prisma.user.findUnique({
      where: { username: 'bigdirectorharold' }
    });

    if (user) {
      const dbMovies = await prisma.movie.findMany({
        where: { userId: user.id },
        orderBy: { date: 'desc' },
        select: {
          id: true,
          title: true,
          date: true,
          rating: true,
          location: true,
          posterUrl: true
        }
      });
      movies = dbMovies;
    }
  } catch (e) {
    console.error('Database Error:', e);
    dbError = "Could not connect to database. Please check Vercel environment variables.";
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Moving Image Data Base
          </h1>
          {dbError && (
            <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
              <p className="font-bold">System Error</p>
              <p>{dbError}</p>
            </div>
          )}
        </header>

        {/* Editors' Lists Section */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 text-left">Editors' Lists</h2>
          <Link href="/top10" className="block">
            <div className="p-4 border border-neutral-800 rounded-xl hover:border-white transition-colors">
              <p className="text-white font-medium">Harold's Top 10 Movies in Theater 2025</p>
            </div>
          </Link>
        </section>

        {/* Battle of Today Section */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 text-left">Battle of Today</h2>
          <BattleOfToday movies={movies} />
        </section>

        {/* Movie Battle Section */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 text-left">Movie Battle</h2>
          <div className="p-4 border border-neutral-800 rounded-xl">
            <MiniBattleArena movies={movies} />
          </div>
        </section>
      </div>
    </main>
  );
}
