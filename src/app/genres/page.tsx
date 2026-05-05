'use client';

import { useState, useEffect } from 'react';
import { Plus, Check, Loader2, Film, Swords } from 'lucide-react';

const GENRES = [
  { id: 28,    name: 'Action',      emoji: '💥' },
  { id: 35,    name: 'Comedy',      emoji: '😂' },
  { id: 27,    name: 'Horror',      emoji: '👻' },
  { id: 878,   name: 'Sci-Fi',      emoji: '🚀' },
  { id: 10749, name: 'Romance',     emoji: '❤️' },
  { id: 53,    name: 'Thriller',    emoji: '🔪' },
  { id: 16,    name: 'Animation',   emoji: '🎨' },
  { id: 99,    name: 'Documentary', emoji: '📽️' },
  { id: 18,    name: 'Drama',       emoji: '🎭' },
  { id: 12,    name: 'Adventure',   emoji: '🗺️' },
  { id: 14,    name: 'Fantasy',     emoji: '🧙' },
  { id: 80,    name: 'Crime',       emoji: '🕵️' },
];

interface Movie { id: number; title: string; release_date: string; poster_path: string | null; vote_average: number }

export default function GenresPage() {
  const [selected, setSelected] = useState<typeof GENRES[0] | null>(null);
  const [movies, setMovies]     = useState<Movie[]>([]);
  const [loading, setLoading]   = useState(false);
  const [added, setAdded]       = useState<Record<number, 'adding' | 'done' | 'exists'>>({});

  useEffect(() => {
    if (!selected) return;
    setLoading(true); setMovies([]);
    fetch(`/api/tmdb/genre?id=${selected.id}`)
      .then(r => r.json())
      .then(setMovies)
      .finally(() => setLoading(false));
  }, [selected]);

  async function handleAdd(movie: Movie) {
    setAdded(a => ({ ...a, [movie.id]: 'adding' }));
    const res = await fetch('/api/movies/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tmdb: movie }),
    });
    setAdded(a => ({ ...a, [movie.id]: res.status === 409 ? 'exists' : res.ok ? 'done' : undefined as any }));
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 font-sans pt-20">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Swords className="w-6 h-6 text-yellow-400" />
            <h1 className="text-2xl font-bold">Battle by Genre</h1>
          </div>
          <p className="text-zinc-500 text-sm">Pick a genre, add your favourites, then battle them</p>
        </header>

        {/* Genre grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-8">
          {GENRES.map(g => (
            <button key={g.id} onClick={() => setSelected(g)}
              className={`p-3 rounded-xl border text-sm font-semibold transition-all flex flex-col items-center gap-1 ${
                selected?.id === g.id
                  ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                  : 'border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:border-zinc-600'
              }`}>
              <span className="text-xl">{g.emoji}</span>
              {g.name}
            </button>
          ))}
        </div>

        {/* Movies */}
        {selected && (
          <section>
            <h2 className="text-sm font-semibold text-zinc-400 mb-4">
              Top {selected.emoji} {selected.name} movies — tap to add to your battle list
            </h2>
            {loading ? (
              <div className="flex gap-3">
                {[...Array(5)].map((_, i) => <div key={i} className="shrink-0 w-24 h-36 rounded-xl bg-zinc-900 animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {movies.map(movie => {
                  const state = added[movie.id];
                  return (
                    <div key={movie.id} className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800 bg-zinc-900/40">
                      <div className="w-9 h-12 rounded overflow-hidden bg-zinc-800 shrink-0">
                        {movie.poster_path
                          ? <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} alt={movie.title} className="w-full h-full object-cover" />
                          : <Film className="w-4 h-4 m-auto mt-4 text-zinc-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{movie.title}</p>
                        <p className="text-zinc-500 text-xs">{movie.release_date?.split('-')[0]} · ⭐ {movie.vote_average?.toFixed(1)}</p>
                      </div>
                      <button onClick={() => !state && handleAdd(movie)} disabled={!!state}
                        className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          state === 'done'   ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                          state === 'exists' ? 'bg-zinc-800 text-zinc-500' :
                          state === 'adding' ? 'bg-zinc-800 text-zinc-500' :
                          'bg-yellow-500 text-black hover:bg-yellow-400'}`}>
                        {state === 'done'   ? <><Check className="w-3 h-3" />Added</> :
                         state === 'exists' ? <>In list</> :
                         state === 'adding' ? <><Loader2 className="w-3 h-3 animate-spin" />…</> :
                         <><Plus className="w-3 h-3" />Add</>}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
