import { prisma } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Film, Users, Swords, Star, ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Props { params: Promise<{ title: string }> }

const MEDAL = ['🥇', '🥈', '🥉'];

export default async function MovieDetailPage({ params }: Props) {
  const { title } = await params;
  const decoded = decodeURIComponent(title);

  const entries = await prisma.movie.findMany({
    where: { title: decoded },
    include: { user: { select: { username: true } } },
    orderBy: { elo: 'desc' },
  });

  if (!entries.length) notFound();

  const avgElo    = Math.round(entries.reduce((s, m) => s + m.elo, 0) / entries.length);
  const maxElo    = Math.max(...entries.map(m => m.elo));
  const minElo    = Math.min(...entries.map(m => m.elo));
  const totalBattles = entries.reduce((s, m) => s + m.matches, 0);
  const poster    = entries.find(m => m.posterUrl)?.posterUrl;
  const year      = entries[0]?.date?.split('-')[0];

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 font-sans pt-20">
      <div className="max-w-2xl mx-auto">
        <Link href="/rankings" className="flex items-center gap-1.5 text-zinc-500 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Rankings
        </Link>

        {/* Hero */}
        <div className="flex gap-6 mb-8">
          <div className="w-24 h-36 rounded-xl overflow-hidden bg-zinc-900 shrink-0 border border-zinc-800">
            {poster
              ? <img src={poster} alt={decoded} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center"><Film className="w-8 h-8 text-zinc-700" /></div>}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-white mb-1">{decoded}</h1>
            {year && <p className="text-zinc-500 text-sm mb-4">{year}</p>}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Avg Elo', value: avgElo, color: 'text-yellow-400' },
                { label: 'Ranked by', value: `${entries.length} users`, color: 'text-white' },
                { label: 'Battles', value: totalBattles, color: 'text-white' },
              ].map(s => (
                <div key={s.label} className="bg-zinc-900 rounded-lg p-2 text-center border border-zinc-800">
                  <div className={`text-lg font-black ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-zinc-600">{s.label}</div>
                </div>
              ))}
            </div>
            {entries.length >= 2 && (
              <p className="text-xs text-zinc-600 mt-3">
                Elo range: <span className="text-green-400">{maxElo}</span> high · <span className="text-red-400">{minElo}</span> low
                {maxElo - minElo > 300 && <span className="text-red-400 ml-2">⚡ Highly divisive</span>}
              </p>
            )}
          </div>
        </div>

        {/* Per-user rankings */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-zinc-500" />
            <h2 className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">How each person ranks it</h2>
          </div>
          <div className="space-y-2">
            {entries.map((m, i) => (
              <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <span className="text-lg w-8 text-center">{i < 3 ? MEDAL[i] : `#${i+1}`}</span>
                <Link href={`/users/${m.user.username}`} className="flex-1 hover:text-yellow-400 transition-colors font-medium">
                  @{m.user.username}
                </Link>
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <div className="flex items-center gap-1"><Star className="w-3 h-3" />{m.elo}</div>
                  <div className="flex items-center gap-1"><Swords className="w-3 h-3" />{m.matches}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
