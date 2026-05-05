'use client';

import { useState, useCallback } from 'react';
import { Search, Plus, Check, Loader2, Film } from 'lucide-react';

interface Movie {
  id: string;
  title: string;
  date: string;
  posterUrl: string | null;
  userId: string;
}

export function AddMoviesClient() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [searching, setSearching] = useState(false);
  const [added, setAdded] = useState<Record<string, 'adding' | 'done' | 'exists'>>({});

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    setSearching(true);
    try {
      const res = await fetch(`/api/movies/search?q=${encodeURIComponent(q)}`);
      setResults(await res.json());
    } finally {
      setSearching(false);
    }
  }, []);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setQuery(v);
    clearTimeout((window as any)._searchTimer);
    (window as any)._searchTimer = setTimeout(() => search(v), 300);
  }

  async function handleAdd(movie: Movie) {
    setAdded(a => ({ ...a, [movie.id]: 'adding' }));
    const res = await fetch('/api/movies/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movieId: movie.id }),
    });
    if (res.status === 409) {
      setAdded(a => ({ ...a, [movie.id]: 'exists' }));
    } else if (res.ok) {
      setAdded(a => ({ ...a, [movie.id]: 'done' }));
    } else {
      setAdded(a => { const n = { ...a }; delete n[movie.id]; return n; });
    }
  }

  return (
    <div>
      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          value={query}
          onChange={handleInput}
          placeholder="Search by movie title…"
          className="w-full pl-11 pr-4 py-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-500 transition-colors text-sm"
          autoFocus
        />
        {searching && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 animate-spin" />
        )}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-2">
          {results.map(movie => {
            const state = added[movie.id];
            return (
              <div
                key={movie.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800 bg-zinc-900/40"
              >
                {/* Poster */}
                <div className="w-10 h-14 rounded-md overflow-hidden bg-zinc-800 shrink-0">
                  {movie.posterUrl
                    ? <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><Film className="w-4 h-4 text-zinc-600" /></div>
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{movie.title}</p>
                  <p className="text-zinc-500 text-xs">{movie.date?.split('-')[0]}</p>
                </div>

                {/* Add button */}
                <button
                  onClick={() => !state && handleAdd(movie)}
                  disabled={!!state}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    state === 'done'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : state === 'exists'
                        ? 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                        : state === 'adding'
                          ? 'bg-zinc-800 text-zinc-500'
                          : 'bg-yellow-500 text-black hover:bg-yellow-400 active:scale-95'
                  }`}
                >
                  {state === 'done' ? (
                    <><Check className="w-3 h-3" /> Added</>
                  ) : state === 'exists' ? (
                    <>Already in list</>
                  ) : state === 'adding' ? (
                    <><Loader2 className="w-3 h-3 animate-spin" /> Adding…</>
                  ) : (
                    <><Plus className="w-3 h-3" /> Add</>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {query.length >= 2 && !searching && results.length === 0 && (
        <div className="text-center py-12 text-zinc-600">
          <Film className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p>No movies found for &quot;{query}&quot;</p>
        </div>
      )}

      {query.length < 2 && (
        <div className="text-center py-12 text-zinc-700 text-sm">
          Type at least 2 characters to search 1,258 movies
        </div>
      )}
    </div>
  );
}
