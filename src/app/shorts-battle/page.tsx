import ShortsBattle from '@/components/ShortsBattle';
import { seedViralShorts, getVideoCount } from './actions';

export const dynamic = 'force-dynamic';

export default async function ShortsBattlePage() {
  // Seed curated viral shorts if needed
  const videoCount = await getVideoCount();
  
  if (videoCount < 50) {
    try {
      await seedViralShorts();
    } catch (error) {
      console.error('Failed to seed shorts:', error);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
            Shorts Battle
          </h1>
          <p className="text-zinc-400">
            Watch both shorts and pick your favorite
          </p>
        </header>

        <ShortsBattle />

        <div className="mt-12 text-center">
          <a 
            href="/"
            className="text-zinc-500 hover:text-white transition-colors"
          >
            ← Back to Movies
          </a>
        </div>
      </div>
    </main>
  );
}
