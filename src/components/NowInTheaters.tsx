'use client';

import { useEffect, useState } from 'react';
import { Plus, Check, Loader2, Clapperboard } from 'lucide-react';

interface TmdbMovie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  vote_average: number;
  overview: string;
}

export function NowInTheaters() {
  const [movies, setMovies]   = useState<TmdbMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded]     = useState<Record<number, 'adding' | 'done' | 'exists'>>({});

  useEffect(() => {
    fetch('/api/tmdb/now-playing')
      .then(r => r.json())
      .then(setMovies)
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(movie: TmdbMovie) {
    setAdded(a => ({ ...a, [movie.id]: 'adding' }));
    const res = await fetch('/api/movies/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tmdb: movie }),
    });
    setAdded(a => ({ ...a, [movie.id]: res.status === 409 ? 'exists' : res.ok ? 'done' : undefined as any }));
  }

  if (loading) return (
    <div className="flex gap-3 overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="shrink-0 w-28 h-44 rounded-xl bg-zinc-900 animate-pulse" />
      ))}
    </div>
  );

  if (!movies.length) return null;

  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <Clapperboard className="w-4 h-4 text-yellow-400" />
        <h2 className="text-xs text-zinc-400 uppercase tracking-widest font-semibold">Now in Theaters</h2>
      </div>

      {/* Horizontal scroll strip */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
        {movies.map(movie => {
          const state = added[movie.id];
          return (
            <div key={movie.id} className="shrink-0 w-28 group relative">
              <div className="w-28 h-40 rounded-xl overflow-hidden bg-zinc-900 mb-2 relative">
                {movie.poster_path
                  ? <img
                      src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  : <div className="w-full h-full flex items-center justify-center text-zinc-700">
                      <Clapperboard className="w-6 h-6" />
                    </div>
                }
                {/* Add overlay on hover */}
                <button
                  onClick={() => !state && handleAdd(movie)}
                  disabled={!!state}
                  className={`absolute inset-0 flex items-center justify-center transition-all
                    ${state ? 'bg-black/60' : 'bg-black/0 group-hover:bg-black/60'}`}
                >
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
    </section>
  );
}
