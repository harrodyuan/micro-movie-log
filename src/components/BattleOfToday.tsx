'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swords } from 'lucide-react';

interface Movie {
  id: string;
  title: string;
  date: string;
}

interface BattleOfTodayProps {
  movies: Movie[];
}

// Get a seeded random pair based on today's date
function getTodaysPair(allMovies: Movie[]): [Movie, Movie] | null {
  if (allMovies.length < 2) return null;
  
  // Use today's date as seed for consistent daily battle
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  
  // Simple seeded random
  const idx1 = seed % allMovies.length;
  const idx2 = (seed * 7 + 13) % allMovies.length;
  
  // Make sure they're different
  const finalIdx2 = idx1 === idx2 ? (idx2 + 1) % allMovies.length : idx2;
  
  return [allMovies[idx1], allMovies[finalIdx2]];
}

export function BattleOfToday({ movies }: BattleOfTodayProps) {
  const [pair, setPair] = useState<[Movie, Movie] | null>(null);
  const [voted, setVoted] = useState<string | null>(null);

  useEffect(() => {
    setPair(getTodaysPair(movies));
    // Check if user already voted today
    const savedVote = localStorage.getItem('battle_of_today_vote');
    const savedDate = localStorage.getItem('battle_of_today_date');
    const today = new Date().toDateString();
    if (savedDate === today && savedVote) {
      setVoted(savedVote);
    }
  }, [movies]);

  const handleVote = (movieId: string) => {
    setVoted(movieId);
    localStorage.setItem('battle_of_today_vote', movieId);
    localStorage.setItem('battle_of_today_date', new Date().toDateString());
  };

  if (!pair) return null;

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="p-6 rounded-2xl border border-neutral-800 bg-gradient-to-b from-neutral-900/50 to-black">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/10">
            <Swords className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-white uppercase tracking-wider font-semibold">Featured Battle</p>
            <p className="text-xs text-neutral-500">{dateStr}</p>
          </div>
        </div>
        {voted && (
          <span className="text-xs text-green-500 font-medium">✓ Voted</span>
        )}
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-center">
        {/* Option A */}
        <motion.button
          whileHover={!voted ? { scale: 1.02 } : {}}
          whileTap={!voted ? { scale: 0.98 } : {}}
          onClick={() => !voted && handleVote(pair[0].id)}
          disabled={!!voted}
          className={`p-4 rounded-xl border transition-all text-center flex flex-col ${
            voted === pair[0].id 
              ? 'border-white bg-white/10' 
              : voted 
                ? 'border-neutral-800 opacity-50' 
                : 'border-neutral-800 hover:border-white bg-black'
          }`}
        >
          {/* Poster space */}
          <div className="aspect-[2/3] w-full flex items-center justify-center text-neutral-700 text-xs border border-dashed border-neutral-800 rounded-lg mb-3">
            [Poster]
          </div>
          {/* Title */}
          <div className="h-16 flex flex-col justify-center">
            <p className="text-sm font-bold text-white line-clamp-2">{pair[0].title}</p>
            <p className="text-xs text-white mt-1">{pair[0].date.split('-')[0]}</p>
          </div>
        </motion.button>

        {/* VS */}
        <div className="w-14 h-14 rounded-full bg-white/10 border border-neutral-700 flex items-center justify-center text-sm text-white font-bold">
          VS
        </div>

        {/* Option B */}
        <motion.button
          whileHover={!voted ? { scale: 1.02 } : {}}
          whileTap={!voted ? { scale: 0.98 } : {}}
          onClick={() => !voted && handleVote(pair[1].id)}
          disabled={!!voted}
          className={`p-4 rounded-xl border transition-all text-center flex flex-col ${
            voted === pair[1].id 
              ? 'border-white bg-white/10' 
              : voted 
                ? 'border-neutral-800 opacity-50' 
                : 'border-neutral-800 hover:border-white bg-black'
          }`}
        >
          {/* Poster space */}
          <div className="aspect-[2/3] w-full flex items-center justify-center text-neutral-700 text-xs border border-dashed border-neutral-800 rounded-lg mb-3">
            [Poster]
          </div>
          {/* Title */}
          <div className="h-16 flex flex-col justify-center">
            <p className="text-sm font-bold text-white line-clamp-2">{pair[1].title}</p>
            <p className="text-xs text-white mt-1">{pair[1].date.split('-')[0]}</p>
          </div>
        </motion.button>
      </div>
    </div>
  );
}
