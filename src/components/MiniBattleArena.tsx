'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swords } from 'lucide-react';
import { submitVote } from '@/app/actions';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Movie {
  id: string;
  title: string;
  date: string;
  posterUrl?: string | null;
}

interface MiniBattleArenaProps {
  movies: Movie[];
  username?: string;
}

// Helper to get a random pair
function getRandomPair(allMovies: Movie[]): [Movie, Movie] | null {
  if (allMovies.length < 2) return null;
  
  const idx1 = Math.floor(Math.random() * allMovies.length);
  let idx2 = Math.floor(Math.random() * allMovies.length);
  while (idx1 === idx2) {
    idx2 = Math.floor(Math.random() * allMovies.length);
  }
  
  return [allMovies[idx1], allMovies[idx2]];
}

export function MiniBattleArena({ movies, username = 'bigdirectorharold' }: MiniBattleArenaProps) {
  const [pair1, setPair1] = useState<[Movie, Movie] | null>(null);
  const [pair2, setPair2] = useState<[Movie, Movie] | null>(null);
  const [voting1, setVoting1] = useState(false);
  const [voting2, setVoting2] = useState(false);

  useEffect(() => {
    setPair1(getRandomPair(movies));
    setPair2(getRandomPair(movies));
  }, [movies]);

  const handleVote = async (pairIndex: 1 | 2, winnerId: string) => {
    const pair = pairIndex === 1 ? pair1 : pair2;
    const setPair = pairIndex === 1 ? setPair1 : setPair2;
    const setVoting = pairIndex === 1 ? setVoting1 : setVoting2;

    if (!pair) return;

    const winner = pair.find(m => m.id === winnerId);
    const loser = pair.find(m => m.id !== winnerId);

    if (!winner || !loser) return;

    setVoting(true);
    try {
      // Submit vote to server
      await submitVote(winner.id, loser.id, username);
      
      // Get new pair
      setPair(getRandomPair(movies));
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setVoting(false);
    }
  };

  const refreshPair1 = () => {
    setPair1(getRandomPair(movies));
  };

  const refreshPair2 = () => {
    setPair2(getRandomPair(movies));
  };

  if (!pair1 || !pair2) return null;

  return (
    <div className="space-y-8">
      {/* Battle 1 */}
      <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-white" />
            <span className="text-xs text-white uppercase tracking-wider font-semibold">Battle 1</span>
          </div>
          <button 
            onClick={refreshPair1}
            disabled={voting1}
            className="px-3 py-1 rounded-lg border border-neutral-800 hover:border-white hover:bg-neutral-900 transition-all text-xs text-white disabled:opacity-50"
          >
            Skip
          </button>
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleVote(1, pair1[0].id)}
            disabled={voting1}
            className="p-4 rounded-xl border border-neutral-800 hover:border-white bg-black transition-all text-center flex flex-col group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Poster space */}
            <div className="aspect-[2/3] w-full flex items-center justify-center text-neutral-700 text-xs border border-dashed border-neutral-800 rounded-lg mb-3 relative overflow-hidden">
              {pair1[0].posterUrl ? (
                <img src={pair1[0].posterUrl} alt={pair1[0].title} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <span>[Poster]</span>
              )}
            </div>
            {/* Title area */}
            <div className="h-16 flex flex-col justify-center">
              <p className="text-sm font-bold text-white line-clamp-2">{pair1[0].title}</p>
              <p className="text-xs text-neutral-400 mt-1">{pair1[0].date.split('-')[0]}</p>
            </div>
          </motion.button>

          <div className="w-12 h-12 rounded-full bg-black border border-neutral-800 flex items-center justify-center text-sm text-white font-bold">
            VS
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleVote(1, pair1[1].id)}
            disabled={voting1}
            className="p-4 rounded-xl border border-neutral-800 hover:border-white bg-black transition-all text-center flex flex-col group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Poster space */}
            <div className="aspect-[2/3] w-full flex items-center justify-center text-neutral-700 text-xs border border-dashed border-neutral-800 rounded-lg mb-3 relative overflow-hidden">
              {pair1[1].posterUrl ? (
                <img src={pair1[1].posterUrl} alt={pair1[1].title} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <span>[Poster]</span>
              )}
            </div>
            {/* Title area */}
            <div className="h-16 flex flex-col justify-center">
              <p className="text-sm font-bold text-white line-clamp-2">{pair1[1].title}</p>
              <p className="text-xs text-neutral-400 mt-1">{pair1[1].date.split('-')[0]}</p>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Battle 2 */}
      <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-white" />
            <span className="text-xs text-white uppercase tracking-wider font-semibold">Battle 2</span>
          </div>
          <button 
            onClick={refreshPair2}
            disabled={voting2}
            className="px-3 py-1 rounded-lg border border-neutral-800 hover:border-white hover:bg-neutral-900 transition-all text-xs text-white disabled:opacity-50"
          >
            Skip
          </button>
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleVote(2, pair2[0].id)}
            disabled={voting2}
            className="p-4 rounded-xl border border-neutral-800 hover:border-white bg-black transition-all text-center flex flex-col group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Poster space */}
            <div className="aspect-[2/3] w-full flex items-center justify-center text-neutral-700 text-xs border border-dashed border-neutral-800 rounded-lg mb-3 relative overflow-hidden">
              {pair2[0].posterUrl ? (
                <img src={pair2[0].posterUrl} alt={pair2[0].title} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <span>[Poster]</span>
              )}
            </div>
            {/* Title area */}
            <div className="h-16 flex flex-col justify-center">
              <p className="text-sm font-bold text-white line-clamp-2">{pair2[0].title}</p>
              <p className="text-xs text-neutral-400 mt-1">{pair2[0].date.split('-')[0]}</p>
            </div>
          </motion.button>

          <div className="w-12 h-12 rounded-full bg-black border border-neutral-800 flex items-center justify-center text-sm text-white font-bold">
            VS
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleVote(2, pair2[1].id)}
            disabled={voting2}
            className="p-4 rounded-xl border border-neutral-800 hover:border-white bg-black transition-all text-center flex flex-col group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Poster space */}
            <div className="aspect-[2/3] w-full flex items-center justify-center text-neutral-700 text-xs border border-dashed border-neutral-800 rounded-lg mb-3 relative overflow-hidden">
              {pair2[1].posterUrl ? (
                <img src={pair2[1].posterUrl} alt={pair2[1].title} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <span>[Poster]</span>
              )}
            </div>
            {/* Title area */}
            <div className="h-16 flex flex-col justify-center">
              <p className="text-sm font-bold text-white line-clamp-2">{pair2[1].title}</p>
              <p className="text-xs text-neutral-400 mt-1">{pair2[1].date.split('-')[0]}</p>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
