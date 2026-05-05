'use client';

import { useEffect, useState } from 'react';
import { Plus, Check, Loader2, Clapperboard, TrendingUp, Clock } from 'lucide-react';

interface TmdbMovie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  vote_average: number;
}

type Tab = 'now' | 'trending' | 'soon';

const TABS: { id: Tab; label: string; icon: React.ReactNode; endpoint: string }[] = [
  { id: 'now',      label: 'In Theaters',  icon: <Clapperboard className="w-3 h-3" />, endpoint: '/api/tmdb/now-playing' },
  { id: 'trending', label: 'Trending',     icon: <TrendingUp className="w-3 h-3" />,  endpoint: '/api/tmdb/trending'    },
  { id: 'soon',     label: 'Coming Soon',  icon: <Clock className="w-3 h-3" />,       endpoint: '/api/tmdb/upcoming'    },
];

export function NowInTheaters() {
  const [tab, setTab]       = useState<Tab>('now');
  const [cache, setCache]   = useState<Partial<Record<Tab, TmdbMovie[]>>>({});
  const [loading, setLoading] = useState(false);
  const [added, setAdded]   = useState<Record<number, 'adding' | 'done' | 'exists'>>({});

  useEffect(() => {
    if (cache[tab]) return;
    setLoading(true);
    const endpoint = TABS.find(t => t.id === tab)!.endpoint;
    fetch(endpoint)
      .then(r => r.json())
      .then(data => setCache(c => ({ ...c, [tab]: data })))
      .finally(() => setLoading(false));
  }, [tab, cache]);

  async function handleAdd(movie: TmdbMovie) {
    setAdded(a => ({ ...a, [movie.id]: 'adding' }));
    const res = await fetch('/api/movies/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tmdb: movie }),
    });
    setAdded(a => ({ ...a, [movie.id]: res.status === 409 ? 'exists' : res.ok ? 'done' : undefined as any }));
  }

  const movies = cache[tab] || [];

  return (
    <section className="mb-10">
      {/* Tab bar */}
      <div className="flex gap-1 mb-4 bg-zinc-900 rounded-lg p-1 w-fit">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              tab === t.id ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* Strip */}
      {loading ? (
        <div className="flex gap-3">
          {[...Array(5)].map((_, i) => <div key={i} className="shrink-0 w-28 h-44 rounded-xl bg-zinc-900 animate-pulse" />)}
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          {movies.map(movie => {
            const state = added[movie.id];
            return (
              <div key={movie.id} className="shrink-0 w-28 group relative">
                <div className="w-28 h-40 rounded-xl overflow-hidden bg-zinc-900 mb-2 relative border border-zinc-800">
                  {movie.poster_path
                    ? <img src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`} alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    : <div className="w-full h-full flex items-center justify-center text-zinc-700">
                        <Clapperboard className="w-6 h-6" />
                      </div>}
                  <button onClick={() => !state && handleAdd(movie)} disabled={!!state}
                    className={`absolute inset-0 flex items-center justify-center transition-all ${
                      state ? 'bg-black/60' : 'bg-black/0 group-hover:bg-black/60'}`}>
                    <span className={`transition-all ${state ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      {state === 'done'   ? <Check className="w-7 h-7 text-green-400" /> :
                       state === 'exists' ? <Check className="w-7 h-7 text-zinc-400" /> :
                       state === 'adding' ? <Loader2 className="w-7 h-7 text-white animate-spin" /> :
                       <Plus className="w-7 h-7 text-white" />}
                    </span>
                  </button>
                </div>
                <p className="text-xs text-zinc-300 leading-tight line-clamp-2 font-medium">{movie.title}</p>
                <p className="text-[10px] text-zinc-600 mt-0.5">{movie.release_date?.split('-')[0]}</p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
