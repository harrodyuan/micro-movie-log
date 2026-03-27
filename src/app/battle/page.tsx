import { BattleArena } from '@/components/BattleArena';

export default function BattlePage() {
  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Movie Battle
          </h1>
          <p className="text-zinc-500">Pick your favorite — every tap ranks your movies</p>
        </header>

        <BattleArena />
      </div>
    </main>
  );
}
