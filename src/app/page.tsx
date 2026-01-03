import { AnonymousBattle } from '@/components/AnonymousBattle';
import { BattleOfToday } from '@/components/BattleOfToday';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let movies: { id: string; title: string; date: string; posterUrl: string | null }[] = [];
  
  try {
    const dbMovies = await prisma.movie.findMany({
      orderBy: { date: 'desc' },
      select: {
        id: true,
        title: true,
        date: true,
        posterUrl: true
      }
    });
    movies = dbMovies;
  } catch (e) {
    console.error('Database Error:', e);
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Hero Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">
            Movie Battle
          </h1>
          <p className="text-zinc-400">
            Which movie wins? You decide.
          </p>
        </header>

        {/* Main Battle Section */}
        <section className="mb-8">
          <AnonymousBattle movies={movies} />
        </section>

        {/* Daily Battle */}
        <section>
          <BattleOfToday movies={movies} />
        </section>
      </div>
    </main>
  );
}
