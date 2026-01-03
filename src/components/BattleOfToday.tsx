'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swords, LogIn } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Movie {
  id: string;
  title: string;
  date: string;
  posterUrl: string | null;
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
  const { data: session, status } = useSession();
  const [pair, setPair] = useState<[Movie, Movie] | null>(null);
  const [voted, setVoted] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [legacyUser, setLegacyUser] = useState<{ id: string } | null>(null);

  // Check for legacy localStorage user or NextAuth session
  const userId = session?.user?.id || legacyUser?.id;
  const isLoggedIn = !!userId;

  useEffect(() => {
    setPair(getTodaysPair(movies));
    
    // Check for legacy localStorage user (MetaMask)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setLegacyUser(JSON.parse(storedUser));
      } catch {}
    }
  }, [movies]);

  useEffect(() => {
    // Check if user already voted today
    if (userId) {
      fetch(`/api/vote?userId=${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.vote) {
            setVoted(data.vote.winnerId);
          }
        })
        .catch(err => console.error('Error checking vote:', err));
    }
  }, [userId]);

  const handleVote = async (movieId: string) => {
    if (!isLoggedIn || !pair) {
      setShowLoginPrompt(true);
      return;
    }
    
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          movieAId: pair[0].id,
          movieBId: pair[1].id,
          winnerId: movieId
        })
      });
      
      if (response.ok) {
        setVoted(movieId);
      } else {
        const data = await response.json();
        if (data.vote) {
          // Already voted
          setVoted(data.vote.winnerId);
        }
      }
    } catch (error) {
      console.error('Error saving vote:', error);
    }
  };

  if (!pair) return null;

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="relative p-6 rounded-2xl border border-neutral-800 bg-gradient-to-b from-neutral-900/50 to-black">
      {/* Login Prompt Overlay */}
      {showLoginPrompt && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-2xl"
        >
          <div className="text-center p-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Sign In to Vote</h3>
            <p className="text-sm text-white mb-6">Sign in to vote in today's battle</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="px-4 py-2 rounded-lg border border-neutral-800 text-white text-sm hover:bg-neutral-900 transition-all"
              >
                Cancel
              </button>
              <Link
                href="/auth/signin"
                className="px-4 py-2 rounded-lg bg-yellow-500 text-black text-sm font-medium hover:bg-yellow-400 transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-yellow-500/20">
            <Swords className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Daily Battle</p>
            <p className="text-xs text-zinc-500">{dateStr}</p>
          </div>
        </div>
        {voted && (
          <span className="text-xs text-green-500 font-medium">✓ Voted</span>
        )}
      </div>

      {/* Battle Arena */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
        {/* Movie A */}
        <motion.button
          whileHover={!voted ? { scale: 1.02 } : {}}
          whileTap={!voted ? { scale: 0.98 } : {}}
          onClick={() => !voted && handleVote(pair[0].id)}
          disabled={!!voted}
          className={`relative p-3 rounded-xl border-2 transition-all ${
            voted === pair[0].id 
              ? 'border-green-500 bg-green-500/10' 
              : voted 
                ? 'border-neutral-800 opacity-40' 
                : 'border-neutral-800 hover:border-yellow-500 bg-black'
          }`}
        >
          <div className="aspect-[2/3] w-full rounded-lg overflow-hidden bg-neutral-900 mb-2">
            {pair[0].posterUrl ? (
              <img src={pair[0].posterUrl} alt={pair[0].title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-700">No Poster</div>
            )}
          </div>
          <p className="text-sm font-semibold text-white line-clamp-2">{pair[0].title}</p>
          <p className="text-xs text-zinc-500">{pair[0].date.split('-')[0]}</p>
        </motion.button>

        {/* VS */}
        <div className="w-12 h-12 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-sm font-bold text-white">
          VS
        </div>

        {/* Movie B */}
        <motion.button
          whileHover={!voted ? { scale: 1.02 } : {}}
          whileTap={!voted ? { scale: 0.98 } : {}}
          onClick={() => !voted && handleVote(pair[1].id)}
          disabled={!!voted}
          className={`relative p-3 rounded-xl border-2 transition-all ${
            voted === pair[1].id 
              ? 'border-green-500 bg-green-500/10' 
              : voted 
                ? 'border-neutral-800 opacity-40' 
                : 'border-neutral-800 hover:border-yellow-500 bg-black'
          }`}
        >
          <div className="aspect-[2/3] w-full rounded-lg overflow-hidden bg-neutral-900 mb-2">
            {pair[1].posterUrl ? (
              <img src={pair[1].posterUrl} alt={pair[1].title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-700">No Poster</div>
            )}
          </div>
          <p className="text-sm font-semibold text-white line-clamp-2">{pair[1].title}</p>
          <p className="text-xs text-zinc-500">{pair[1].date.split('-')[0]}</p>
        </motion.button>
      </div>
    </div>
  );
}
