'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Check, Loader2, Film, Flame } from 'lucide-react';

interface TmdbMovie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  vote_average: number;
  overview: string;
}

type AddState = 'adding' | 'done' | 'exists';

function AddBtn({ state, onClick }: { state?: AddState; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={!!state}
      className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
        state === 'done'   ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
        state === 'exists' ? 'bg-zinc-800 text-zinc-500 border border-zinc-700' :
        state === 'adding' ? 'bg-zinc-800 text-zinc-500' :
        'bg-yellow-500 text-black hover:bg-yellow-400 active:scale-95'
      }`}
    >
      {state === 'done'   ? <><Check className="w-3 h-3" />Added</> :
       state === 'exists' ? <>In list</> :
       state === 'adding' ? <><Loader2 className="w-3 h-3 animate-spin" />Adding…</> :
       <><Plus className="w-3 h-3" />Add</>}
    </button>
  );
}

export function AddMoviesClient() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TmdbMovie[]>([]);
  const [popular, setPopular] = useState<TmdbMovie[]>([]);
  const [searching, setSearching] = useState(false);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [added, setAdded] = useState<Record<string | number, AddState>>({});

  useEffect(() => {
    fetch('/api/tmdb/popular')
      .then(r => r.json())
      .then(setPopular)
      .finally(() => setLoadingPopular(false));
  }, []);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    setSearching(true);
    try {
      const res = await fetch(`/api/tmdb/search?query=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
    } finally {
      setSearching(false);
    }
  }, []);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setQuery(v);
    clearTimeout((window as any)._st);
    (window as any)._st = setTimeout(() => search(v), 300);
  }

  async function handleAdd(movie: TmdbMovie) {
    setAdded(a => ({ ...a, [movie.id]: 'adding' }));
    const res = await fetch('/api/movies/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tmdb: movie }),
    });
    setAdded(a => ({ ...a, [movie.id]: res.status === 409 ? 'exists' : res.ok ? 'done' : undefined as any }));
  }

  const display = query.length >= 2 ? results : popular;
  const isSearch = query.length >= 2;

  return (
    <div>
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input type="text" value={query} onChange={handleInput} autoFocus
          placeholder="Search any movie — powered by TMDB…"
          className="w-full pl-11 pr-4 py-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-500 transition-colors text-sm"
        />
        {(searching || loadingPopular) && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 animate-spin" />
        )}
      </div>

      {/* Section label */}
      {!isSearch && (
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Trending now · tap to add</span>
        </div>
      )}

      {/* Results grid */}
      <div className="grid grid-cols-1 gap-2">
        {display.map(movie => (
          <div key={movie.id} className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition-colors">
            <div className="w-10 h-14 rounded-md overflow-hidden bg-zinc-800 shrink-0">
              {movie.poster_path
                ? <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} alt={movie.title} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center"><Film className="w-4 h-4 text-zinc-600" /></div>
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{movie.title}</p>
              <p className="text-zinc-500 text-xs">{movie.release_date?.split('-')[0]} · ⭐ {movie.vote_average?.toFixed(1)}</p>
            </div>
            <AddBtn state={added[movie.id]} onClick={() => !added[movie.id] && handleAdd(movie)} />
          </div>
        ))}
      </div>

      {isSearch && !searching && results.length === 0 && (
        <div className="text-center py-12 text-zinc-600">
          <Film className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p>No results for &quot;{query}&quot;</p>
        </div>
      )}
    </div>
  );
}
