import { prisma } from '@/lib/db';
import Link from 'next/link';
import { Trophy, Users, Swords, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

const MEDAL = ['🥇', '🥈', '🥉'];

export default async function RankingsPage() {
  // Aggregate all movies by title: avg elo, sum matches, count users who have it
  const rows = await prisma.$queryRaw<{
    title: string;
    posterUrl: string | null;
    avg_elo: number;
    total_matches: bigint;
    user_count: bigint;
  }[]>`
    SELECT
      title,
      MAX("poster_url") as "posterUrl",
      AVG(elo)::numeric(10,0) as avg_elo,
      SUM(matches) as total_matches,
      COUNT(DISTINCT "user_id") as user_count
    FROM movies
    GROUP BY title
    HAVING SUM(matches) > 0
    ORDER BY avg_elo DESC, user_count DESC
    LIMIT 100
  `;

  // Most divisive: high std deviation in Elo
  const divisive = await prisma.$queryRaw<{
    title: string;
    posterUrl: string | null;
    stddev: number;
    avg_elo: number;
    user_count: bigint;
  }[]>`
    SELECT
      title,
      MAX("poster_url") as "posterUrl",
      STDDEV(elo)::numeric(10,0) as stddev,
      AVG(elo)::numeric(10,0) as avg_elo,
      COUNT(DISTINCT "user_id") as user_count
    FROM movies
    GROUP BY title
    HAVING COUNT(DISTINCT "user_id") >= 2 AND STDDEV(elo) IS NOT NULL
    ORDER BY stddev DESC
    LIMIT 10
  `;

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 font-sans pt-20">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Trophy className="w-7 h-7 text-yellow-400" />
            <h1 className="text-3xl font-bold">Global Top 100</h1>
          </div>
          <p className="text-zinc-500 text-sm">Aggregated Elo across all users · {rows.length} movies ranked</p>
        </header>

        {/* Most divisive */}
        {divisive.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-red-400" />
              <h2 className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">Most Divisive</h2>
              <span className="text-xs text-zinc-700">— love it or hate it</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {divisive.map(m => (
                <Link key={m.title} href={`/movies/${encodeURIComponent(m.title)}`}
                  className="shrink-0 w-24 group">
                  <div className="w-24 h-32 rounded-lg overflow-hidden bg-zinc-900 mb-1.5 border border-zinc-800 group-hover:border-red-500/50 transition-colors">
                    {m.posterUrl
                      ? <img src={m.posterUrl} alt={m.title} className="w-full h-full object-cover" />
                      : <div className="w-full h-full bg-zinc-900" />}
                  </div>
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-tight">{m.title}</p>
                  <p className="text-[10px] text-red-400 mt-0.5">±{Number(m.stddev)} elo spread</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Top 100 */}
        <div className="space-y-2">
          {rows.map((item, i) => (
            <Link key={item.title} href={`/movies/${encodeURIComponent(item.title)}`}
              className="flex items-center gap-4 p-3 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 transition-all group">
              <span className={`font-mono text-lg w-9 text-center font-black shrink-0 ${
                i === 0 ? 'text-yellow-400' : i === 1 ? 'text-zinc-300' : i === 2 ? 'text-amber-600' : 'text-zinc-600'
              }`}>
                {i < 3 ? MEDAL[i] : i + 1}
              </span>

              {item.posterUrl && (
                <div className="w-9 h-12 rounded overflow-hidden shrink-0">
                  <img src={item.posterUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate group-hover:text-yellow-400 transition-colors">{item.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="h-1 flex-1 bg-zinc-800 rounded-full max-w-[120px] overflow-hidden">
                    <div className="h-full bg-yellow-500/60 rounded-full"
                      style={{ width: `${Math.min(100, (Number(item.avg_elo) / 2000) * 100)}%` }} />
                  </div>
                  <span className="text-xs text-zinc-500">{Number(item.avg_elo)} elo</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 text-xs text-zinc-600 shrink-0">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{Number(item.user_count)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Swords className="w-3 h-3" />
                  <span>{Number(item.total_matches)}</span>
                </div>
              </div>
            </Link>
          ))}

          {rows.length === 0 && (
            <div className="text-center py-20 text-zinc-600 border border-dashed border-zinc-800 rounded-2xl">
              <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No battles yet — start fighting on the homepage</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
