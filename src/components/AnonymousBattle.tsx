'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Trophy, LogIn } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Movie {
  id: string;
  title: string;
  date: string;
  posterUrl: string | null;
}

interface AnonymousBattleProps {
  movies: Movie[];
}

function getRandomPair(movies: Movie[], exclude?: string[]): [Movie, Movie] | null {
  if (movies.length < 2) return null;
  
  const available = exclude 
    ? movies.filter(m => !exclude.includes(m.id))
    : movies;
  
  if (available.length < 2) {
    // Reset if we've shown all movies
    const shuffled = [...movies].sort(() => Math.random() - 0.5);
    return [shuffled[0], shuffled[1]];
  }
  
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return [shuffled[0], shuffled[1]];
}

const FREE_BATTLES = 5;

export function AnonymousBattle({ movies }: AnonymousBattleProps) {
  const { data: session } = useSession();
  const [pair, setPair] = useState<[Movie, Movie] | null>(null);
  const [battleCount, setBattleCount] = useState(0);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [seenMovies, setSeenMovies] = useState<string[]>([]);
  const [isVoting, setIsVoting] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const isLoggedIn = !!session?.user;

  useEffect(() => {
    // Load battle count from localStorage for anonymous users
    if (!isLoggedIn) {
      const stored = localStorage.getItem('battleCount');
      if (stored) {
        setBattleCount(parseInt(stored, 10));
      }
    }
    setPair(getRandomPair(movies));
  }, [movies, isLoggedIn]);

  const handleVote = async (winnerId: string) => {
    if (!pair) return;
    
    setIsVoting(true);
    setWinner(winnerId);
    
    // Animate the winner
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const newCount = battleCount + 1;
    setBattleCount(newCount);
    
    if (!isLoggedIn) {
      localStorage.setItem('battleCount', newCount.toString());
      
      // Show signup prompt after FREE_BATTLES
      if (newCount >= FREE_BATTLES) {
        setShowSignupPrompt(true);
        setIsVoting(false);
        return;
      }
    }
    
    // Track seen movies
    setSeenMovies(prev => [...prev, pair[0].id, pair[1].id]);
    
    // Get next pair
    setWinner(null);
    setPair(getRandomPair(movies, seenMovies));
    setIsVoting(false);
  };

  const handleContinue = () => {
    setShowSignupPrompt(false);
    setWinner(null);
    setPair(getRandomPair(movies, seenMovies));
  };

  if (!pair) return null;

  return (
    <div className="relative">
      {/* Signup Prompt Overlay */}
      <AnimatePresence>
        {showSignupPrompt && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/90 backdrop-blur-sm rounded-2xl"
          >
            <div className="text-center p-8 max-w-sm">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">You're on a roll! 🎬</h3>
              <p className="text-zinc-400 mb-6">
                Sign up to save your votes, build your rankings, and add your own movies!
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/auth/signin"
                  className="px-6 py-3 rounded-lg bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition-all flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Sign Up Free
                </Link>
                <button
                  onClick={handleContinue}
                  className="px-6 py-3 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-all"
                >
                  Keep playing as guest
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6 rounded-2xl border border-neutral-800 bg-gradient-to-b from-neutral-900/50 to-black">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/20">
              <Swords className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Which movie wins?</p>
              <p className="text-xs text-zinc-500">Click to vote</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500">Battles</p>
            <p className="text-lg font-bold text-white">{battleCount}</p>
          </div>
        </div>

        {/* Battle Arena */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
          {/* Movie A */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => !isVoting && handleVote(pair[0].id)}
            disabled={isVoting}
            className={`relative p-3 rounded-xl border-2 transition-all ${
              winner === pair[0].id 
                ? 'border-green-500 bg-green-500/10' 
                : winner === pair[1].id
                  ? 'border-neutral-800 opacity-40'
                  : 'border-neutral-800 hover:border-yellow-500 bg-black'
            }`}
          >
            <div className="aspect-[2/3] w-full rounded-lg overflow-hidden bg-neutral-900 mb-2">
              {pair[0].posterUrl ? (
                <img 
                  src={pair[0].posterUrl} 
                  alt={pair[0].title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-700">
                  No Poster
                </div>
              )}
            </div>
            <p className="text-sm font-semibold text-white line-clamp-2">{pair[0].title}</p>
            <p className="text-xs text-zinc-500">{pair[0].date.split('-')[0]}</p>
            {winner === pair[0].id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
              >
                <Trophy className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </motion.button>

          {/* VS */}
          <div className="w-12 h-12 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-sm font-bold text-white">
            VS
          </div>

          {/* Movie B */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => !isVoting && handleVote(pair[1].id)}
            disabled={isVoting}
            className={`relative p-3 rounded-xl border-2 transition-all ${
              winner === pair[1].id 
                ? 'border-green-500 bg-green-500/10' 
                : winner === pair[0].id
                  ? 'border-neutral-800 opacity-40'
                  : 'border-neutral-800 hover:border-yellow-500 bg-black'
            }`}
          >
            <div className="aspect-[2/3] w-full rounded-lg overflow-hidden bg-neutral-900 mb-2">
              {pair[1].posterUrl ? (
                <img 
                  src={pair[1].posterUrl} 
                  alt={pair[1].title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-700">
                  No Poster
                </div>
              )}
            </div>
            <p className="text-sm font-semibold text-white line-clamp-2">{pair[1].title}</p>
            <p className="text-xs text-zinc-500">{pair[1].date.split('-')[0]}</p>
            {winner === pair[1].id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
              >
                <Trophy className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </motion.button>
        </div>

        {/* Progress indicator for anonymous users */}
        {!isLoggedIn && battleCount < FREE_BATTLES && (
          <div className="mt-4 pt-4 border-t border-neutral-800">
            <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
              <span>Free battles remaining</span>
              <span>{FREE_BATTLES - battleCount} left</span>
            </div>
            <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-yellow-500"
                initial={{ width: 0 }}
                animate={{ width: `${(battleCount / FREE_BATTLES) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
