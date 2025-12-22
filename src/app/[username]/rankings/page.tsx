'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Swords, RefreshCw, ArrowLeft } from 'lucide-react';
import { movies, Movie } from '@/data/movies';
import { RankedItem, calculateNewRatings, initializeRating } from '@/lib/ranking';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ConnectWallet } from '@/components/ConnectWallet';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper to get a random pair
function getRandomPair(allMovies: Movie[]): [Movie, Movie] {
  if (allMovies.length < 2) return [allMovies[0], allMovies[0]];
  
  const idx1 = Math.floor(Math.random() * allMovies.length);
  let idx2 = Math.floor(Math.random() * allMovies.length);
  
  while (idx1 === idx2) {
    idx2 = Math.floor(Math.random() * allMovies.length);
  }
  
  return [allMovies[idx1], allMovies[idx2]];
}

export default function RankingsPage() {
  const params = useParams();
  const username = params.username as string;
  
  const [activeTab, setActiveTab] = useState<'vote' | 'leaderboard'>('vote');
  const [ratings, setRatings] = useState<Record<string, RankedItem>>({});
  const [currentPair, setCurrentPair] = useState<[Movie, Movie] | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load ratings from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('midb_ratings');
      if (saved) {
        setRatings(JSON.parse(saved));
      } else {
        throw new Error('No saved ratings');
      }
    } catch (e) {
      // Initialize all movies with default 1200 if load fails
      const initial: Record<string, RankedItem> = {};
      movies.forEach(m => {
        initial[m.id] = initializeRating(m.id);
      });
      setRatings(initial);
    }
    setIsLoaded(true);
    setCurrentPair(getRandomPair(movies));
  }, []);

  // Save ratings whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('midb_ratings', JSON.stringify(ratings));
    }
  }, [ratings, isLoaded]);

  const handleVote = (winnerId: string) => {
    if (!currentPair) return;

    const winnerMovie = currentPair.find(m => m.id === winnerId)!;
    const loserMovie = currentPair.find(m => m.id !== winnerId)!;

    // Get current rating objects (or init if missing)
    const winnerRating = ratings[winnerMovie.id] || initializeRating(winnerMovie.id);
    const loserRating = ratings[loserMovie.id] || initializeRating(loserMovie.id);

    // Calculate new scores
    const [newWinner, newLoser] = calculateNewRatings(winnerRating, loserRating);

    // Update state
    setRatings(prev => ({
      ...prev,
      [winnerMovie.id]: newWinner,
      [loserMovie.id]: newLoser
    }));

    // Get next pair
    setCurrentPair(getRandomPair(movies));
  };

  const getRankedList = useCallback(() => {
    return Object.values(ratings)
      .sort((a, b) => b.elo - a.elo)
      .map((item, index) => {
        const movie = movies.find(m => m.id === item.id);
        if (!movie) return null;
        return { ...movie, ...item, rank: index + 1 };
      })
      .filter(Boolean) as (Movie & RankedItem & { rank: number })[];
  }, [ratings]);

  if (!isLoaded) return <div className="min-h-screen bg-black" />;

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 font-sans selection:bg-white/30">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="mb-8">
            <h1 className="text-5xl font-bold tracking-tight text-white mb-6">
              Moving Image Data Base
            </h1>

            {/* Navigation Tabs */}
            <div className="flex justify-center items-center space-x-1 p-1 bg-neutral-900/50 backdrop-blur-md rounded-full inline-flex border border-neutral-800">
              <Link 
                href="/" 
                className="p-2 rounded-full text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
                title="Back to Home"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div className="w-px h-4 bg-neutral-800 mx-1" />
              <Link href={`/${username}/log`} className="px-6 py-2 rounded-full text-sm font-medium text-white hover:text-white transition-colors">
                Log
              </Link>
              <Link href={`/${username}/rankings`} className="px-6 py-2 rounded-full text-sm font-medium bg-white text-black shadow-lg">
                Rankings
              </Link>
              <div className="w-px h-4 bg-neutral-800 mx-2" />
              <div className="px-2">
                <ConnectWallet />
              </div>
            </div>
          </div>

          {/* Sub-Navigation for Vote vs Leaderboard */}
          <div className="flex justify-center gap-4">
             <button
              onClick={() => setActiveTab('vote')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors border",
                activeTab === 'vote' 
                  ? "bg-neutral-800 border-neutral-700 text-white" 
                  : "border-transparent text-white hover:text-white"
              )}
            >
              <Swords className="w-4 h-4" />
              <span>Battle Arena</span>
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors border",
                activeTab === 'leaderboard' 
                  ? "bg-neutral-800 border-neutral-700 text-white" 
                  : "border-transparent text-white hover:text-white"
              )}
            >
              <Trophy className="w-4 h-4" />
              <span>Leaderboard</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'vote' && currentPair ? (
            <motion.div
              key="vote"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 items-center justify-center min-h-[400px]"
            >
              {/* Option A */}
              <button 
                onClick={() => handleVote(currentPair[0].id)}
                className="group relative h-[400px] w-full rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-white transition-all duration-300 overflow-hidden text-left flex flex-col"
              >
                <div className="flex-1 p-8 flex flex-col justify-center items-center text-center z-10">
                  <span className="text-white text-sm font-mono mb-4 uppercase tracking-widest">Option A</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white group-hover:scale-105 transition-transform duration-300">
                    {currentPair[0].title}
                  </h2>
                  <p className="mt-4 text-white">{currentPair[0].date.split('-')[0]}</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-50" />
              </button>

              {/* VS Badge */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-black border border-neutral-800 text-white font-bold shadow-2xl">
                VS
              </div>

              {/* Option B */}
              <button 
                onClick={() => handleVote(currentPair[1].id)}
                className="group relative h-[400px] w-full rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-white transition-all duration-300 overflow-hidden text-left flex flex-col"
              >
                <div className="flex-1 p-8 flex flex-col justify-center items-center text-center z-10">
                  <span className="text-white text-sm font-mono mb-4 uppercase tracking-widest">Option B</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white group-hover:scale-105 transition-transform duration-300">
                    {currentPair[1].title}
                  </h2>
                   <p className="mt-4 text-white">{currentPair[1].date.split('-')[0]}</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-50" />
              </button>

              <div className="col-span-1 md:col-span-2 text-center mt-8">
                <button 
                  onClick={() => setCurrentPair(getRandomPair(movies))}
                  className="text-white hover:text-white text-sm flex items-center justify-center gap-2 mx-auto transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Skip Pair
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 max-w-2xl mx-auto"
            >
              {getRankedList().map((item, index) => (
                <div 
                  key={item.id}
                  className="flex items-center gap-6 p-4 rounded-xl bg-neutral-900/30 border border-neutral-800 hover:bg-neutral-900 transition-colors"
                >
                  <span className={cn(
                    "font-mono text-lg w-8 text-center",
                    index === 0 ? "text-yellow-500 font-bold" :
                    index === 1 ? "text-white font-bold" :
                    index === 2 ? "text-amber-700 font-bold" :
                    "text-white"
                  )}>
                    {item.rank}
                  </span>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-white">{item.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="h-1.5 w-full bg-neutral-800 rounded-full max-w-[200px] overflow-hidden">
                        <div 
                          className="h-full bg-white/20 rounded-full" 
                          style={{ width: `${Math.min(100, (item.elo / 2000) * 100)}%` }} 
                        />
                      </div>
                      <span className="text-xs text-white font-mono">
                        {item.elo} pts
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-white font-mono">
                    {item.matches} matches
                  </div>
                </div>
              ))}
              
              {Object.keys(ratings).length === 0 && (
                <div className="text-center py-20 text-white">
                  Start battling to see rankings!
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
