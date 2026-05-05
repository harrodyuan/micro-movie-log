import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Film } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ username: string }>;
}

const MEDAL = ['🥇', '🥈', '🥉'];

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      movies: {
        orderBy: { elo: 'desc' },
        select: {
          id: true,
          title: true,
          date: true,
          posterUrl: true,
          elo: true,
          matches: true,
        },
      },
    },
  });

  if (!user) notFound();

  const top10   = user.movies.slice(0, 10);
  const rest    = user.movies.slice(10);
  const battled = user.movies.filter(m => m.matches > 0).length;

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">

        {/* Profile header */}
        <header className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <span className="text-2xl font-black text-zinc-300 uppercase">{user.username[0]}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">@{user.username}</h1>
              {user.bio && <p className="text-zinc-400 text-sm mt-0.5">{user.bio}</p>}
            </div>
          </div>
          <div className="flex gap-6 text-sm">
            <div><span className="text-white font-bold">{user.movies.length.toLocaleString()}</span><span className="text-zinc-500 ml-1">movies</span></div>
            <div><span className="text-white font-bold">{battled.toLocaleString()}</span><span className="text-zinc-500 ml-1">ranked</span></div>
            <div><span className="text-white font-bold">{user.movies.reduce((s, m) => s + m.matches, 0).toLocaleString()}</span><span className="text-zinc-500 ml-1">battles</span></div>
          </div>
        </header>

        {user.movies.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
            <Film className="w-12 h-12 mx-auto mb-4 text-zinc-700" />
            <p className="text-zinc-500 mb-1">No movies yet</p>
            <p className="text-zinc-700 text-sm">Add movies and battle them to build a ranking</p>
          </div>
        ) : (
          <>
            {/* ── TOP 10 ── */}
            <section className="mb-12">
              <h2 className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-4">
                Top 10 · ranked by battle results
              </h2>
              <div className="space-y-2">
                {top10.map((movie, i) => (
                  <div
                    key={movie.id}
                    className={`flex items-center gap-4 p-3 rounded-xl border transition-all
                      ${i === 0 ? 'border-yellow-500/40 bg-yellow-500/5' :
                        i === 1 ? 'border-zinc-400/30 bg-zinc-400/5' :
                        i === 2 ? 'border-amber-700/30 bg-amber-700/5' :
                        'border-zinc-800 bg-zinc-900/20'}`}
                  >
                    {/* Rank */}
                    <span className="w-8 text-center text-lg shrink-0">
                      {i < 3 ? MEDAL[i] : <span className="text-zinc-600 text-sm font-bold">#{i + 1}</span>}
                    </span>

                    {/* Poster */}
                    <div className="w-10 h-14 rounded-md overflow-hidden bg-zinc-800 shrink-0">
                      {movie.posterUrl
                        ? <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><Film className="w-4 h-4 text-zinc-600" /></div>
                      }
                    </div>

                    {/* Title */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate">{movie.title}</p>
                      <p className="text-xs text-zinc-500">{movie.date?.split('-')[0]} · {movie.matches} battles</p>
                    </div>

                    {/* Elo */}
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-bold ${i === 0 ? 'text-yellow-400' : 'text-zinc-300'}`}>{movie.elo}</p>
                      <p className="text-xs text-zinc-600">elo</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── FULL COLLECTION ── */}
            {rest.length > 0 && (
              <section>
                <h2 className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-4">
                  Full collection · {user.movies.length} movies
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                  {user.movies.map((movie, i) => (
                    <div key={movie.id} className="group relative">
                      <div className="aspect-[2/3] rounded-lg overflow-hidden bg-zinc-900">
                        {movie.posterUrl
                          ? <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          : <div className="w-full h-full flex items-center justify-center"><Film className="w-6 h-6 text-zinc-700" /></div>
                        }
                        {/* Rank badge */}
                        {i < 10 && (
                          <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-black/80 flex items-center justify-center">
                            <span className="text-[10px] font-black text-yellow-400">#{i + 1}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs font-medium text-zinc-300 mt-1.5 line-clamp-2 leading-tight">{movie.title}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
