'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swords } from 'lucide-react';

interface Movie {
  id: string;
  title: string;
  date: string;
}

interface MiniBattleArenaProps {
  movies: Movie[];
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

export function MiniBattleArena({ movies }: MiniBattleArenaProps) {
  const [pair1, setPair1] = useState<[Movie, Movie] | null>(null);
  const [pair2, setPair2] = useState<[Movie, Movie] | null>(null);

  useEffect(() => {
    setPair1(getRandomPair(movies));
    setPair2(getRandomPair(movies));
  }, [movies]);

  const refreshPair1 = () => {
    setPair1(getRandomPair(movies));
  };

  const refreshPair2 = () => {
    setPair2(getRandomPair(movies));
  };

  const refreshAll = () => {
    setPair1(getRandomPair(movies));
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
            className="px-3 py-1 rounded-lg border border-neutral-800 hover:border-white hover:bg-neutral-900 transition-all text-xs text-white"
          >
            Skip
          </button>
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={refreshPair1}
            className="p-4 rounded-xl border border-neutral-800 hover:border-white bg-black transition-all text-center flex flex-col"
          >
            {/* Poster space - fixed height */}
            <div className="aspect-[2/3] w-full flex items-center justify-center text-neutral-700 text-xs border border-dashed border-neutral-800 rounded-lg mb-3">
              [Poster]
            </div>
            {/* Title area - fixed height */}
            <div className="h-16 flex flex-col justify-center">
              <p className="text-sm font-bold text-white line-clamp-2">{pair1[0].title}</p>
              <p className="text-xs text-white mt-1">{pair1[0].date.split('-')[0]}</p>
            </div>
          </motion.button>

          <div className="w-12 h-12 rounded-full bg-black border border-neutral-800 flex items-center justify-center text-sm text-white font-bold">
            VS
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={refreshPair1}
            className="p-4 rounded-xl border border-neutral-800 hover:border-white bg-black transition-all text-center flex flex-col"
          >
            {/* Poster space - fixed height */}
            <div className="aspect-[2/3] w-full flex items-center justify-center text-neutral-700 text-xs border border-dashed border-neutral-800 rounded-lg mb-3">
              [Poster]
            </div>
            {/* Title area - fixed height */}
            <div className="h-16 flex flex-col justify-center">
              <p className="text-sm font-bold text-white line-clamp-2">{pair1[1].title}</p>
              <p className="text-xs text-white mt-1">{pair1[1].date.split('-')[0]}</p>
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
            className="px-3 py-1 rounded-lg border border-neutral-800 hover:border-white hover:bg-neutral-900 transition-all text-xs text-white"
          >
            Skip
          </button>
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={refreshPair2}
            className="p-4 rounded-xl border border-neutral-800 hover:border-white bg-black transition-all text-center flex flex-col"
          >
            {/* Poster space - fixed height */}
            <div className="aspect-[2/3] w-full flex items-center justify-center text-neutral-700 text-xs border border-dashed border-neutral-800 rounded-lg mb-3">
              [Poster]
            </div>
            {/* Title area - fixed height */}
            <div className="h-16 flex flex-col justify-center">
              <p className="text-sm font-bold text-white line-clamp-2">{pair2[0].title}</p>
              <p className="text-xs text-white mt-1">{pair2[0].date.split('-')[0]}</p>
            </div>
          </motion.button>

          <div className="w-12 h-12 rounded-full bg-black border border-neutral-800 flex items-center justify-center text-sm text-white font-bold">
            VS
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={refreshPair2}
            className="p-4 rounded-xl border border-neutral-800 hover:border-white bg-black transition-all text-center flex flex-col"
          >
            {/* Poster space - fixed height */}
            <div className="aspect-[2/3] w-full flex items-center justify-center text-neutral-700 text-xs border border-dashed border-neutral-800 rounded-lg mb-3">
              [Poster]
            </div>
            {/* Title area - fixed height */}
            <div className="h-16 flex flex-col justify-center">
              <p className="text-sm font-bold text-white line-clamp-2">{pair2[1].title}</p>
              <p className="text-xs text-white mt-1">{pair2[1].date.split('-')[0]}</p>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
