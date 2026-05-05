'use client';

import { useState, useEffect, useCallback } from 'react';

interface Movie {
  id: string;
  title: string;
  date: string;
  posterUrl: string | null;
  elo: number;
}

function getRandomPair(movies: Movie[]): [Movie, Movie] | null {
  if (movies.length < 2) return null;
  const shuffled = [...movies].sort(() => Math.random() - 0.5);
  return [shuffled[0], shuffled[1]];
}

export function BattleArena() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [pair, setPair] = useState<[Movie, Movie] | null>(null);
  const [loading, setLoading] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [battleCount, setBattleCount] = useState(0);
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    // Try user's own list first; fall back to global catalog
    fetch('/api/movies/my')
      .then(async r => {
        if (r.status === 401) return fetch('/api/movies/all').then(r2 => r2.json());
        const data = await r.json();
        if (Array.isArray(data) && data.length >= 2) return data;
        return fetch('/api/movies/all').then(r2 => r2.json());
      })
      .then((data: Movie[]) => {
        const withPoster = data.filter(m => m.posterUrl && m.posterUrl.length > 5);
        setMovies(withPoster);
        setPair(getRandomPair(withPoster));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleVote = useCallback(async (movieId: string) => {
    if (!pair || voting || winner) return;
    setVoting(true);
    setWinner(movieId);

    fetch('/api/battle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movieAId: pair[0].id, movieBId: pair[1].id, winnerId: movieId }),
    }).catch(() => {});

    await new Promise(r => setTimeout(r, 800));

    setBattleCount(c => c + 1);
    setWinner(null);
    setPair(getRandomPair(movies));
    setVoting(false);
  }, [pair, voting, winner, movies]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-500 text-sm">Loading your movies...</p>
      </div>
    );
  }

  if (!pair) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-zinc-500">No movies available</p>
      </div>
    );
  }

  const [movieA, movieB] = pair;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Battle count */}
      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">
        <span className="text-yellow-500 text-xs font-bold">⚡</span>
        <span className="text-zinc-400 text-xs font-medium">{battleCount} battles</span>
      </div>

      <p className="text-zinc-500 text-sm">Which movie do you prefer?</p>

      {/* Cards */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-3 md:gap-6 w-full items-center">
        {/* Movie A */}
        <button
          onClick={() => handleVote(movieA.id)}
          disabled={voting}
          className={`group relative rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer
            ${winner === movieA.id
              ? 'border-green-500 scale-105 shadow-lg shadow-green-500/20'
              : winner === movieB.id
                ? 'border-zinc-800 opacity-40'
                : 'border-zinc-800 hover:border-yellow-500 hover:scale-[1.02] active:scale-[0.98]'
            }`}
        >
          <div className="aspect-[2/3] w-full bg-zinc-900">
            <img
              src={movieA.posterUrl!}
              alt={movieA.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-3 bg-zinc-950">
            <p className="text-white text-sm font-semibold line-clamp-2 leading-tight">{movieA.title}</p>
            <p className="text-zinc-500 text-xs mt-1">{movieA.date?.split('-')[0]}</p>
          </div>
          {winner === movieA.id && (
            <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold">✓</span>
            </div>
          )}
        </button>

        {/* VS */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
            <span className="text-zinc-300 text-xs font-black tracking-widest">VS</span>
          </div>
        </div>

        {/* Movie B */}
        <button
          onClick={() => handleVote(movieB.id)}
          disabled={voting}
          className={`group relative rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer
            ${winner === movieB.id
              ? 'border-green-500 scale-105 shadow-lg shadow-green-500/20'
              : winner === movieA.id
                ? 'border-zinc-800 opacity-40'
                : 'border-zinc-800 hover:border-yellow-500 hover:scale-[1.02] active:scale-[0.98]'
            }`}
        >
          <div className="aspect-[2/3] w-full bg-zinc-900">
            <img
              src={movieB.posterUrl!}
              alt={movieB.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-3 bg-zinc-950">
            <p className="text-white text-sm font-semibold line-clamp-2 leading-tight">{movieB.title}</p>
            <p className="text-zinc-500 text-xs mt-1">{movieB.date?.split('-')[0]}</p>
          </div>
          {winner === movieB.id && (
            <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold">✓</span>
            </div>
          )}
        </button>
      </div>

      <p className="text-zinc-700 text-xs">Tap a movie to vote · every vote updates the ranking</p>
    </div>
  );
}
