import { BattleOfToday } from '@/components/BattleOfToday';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function BattlePage() {
  const movies = await prisma.movie.findMany({
    orderBy: { date: 'desc' },
    select: {
      id: true,
      title: true,
      date: true,
      posterUrl: true
    }
  });

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Daily Movie Battle
          </h1>
          <p className="text-zinc-400">Vote for your favorite movie each day</p>
        </header>

        <BattleOfToday movies={movies} />
      </div>
    </main>
  );
}
