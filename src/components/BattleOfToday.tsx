'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swords, Wallet } from 'lucide-react';
import { ethers } from 'ethers';

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
  const [isConnected, setIsConnected] = useState(false);
  const [showConnectPrompt, setShowConnectPrompt] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    setPair(getTodaysPair(movies));
    
    // Check if user is connected
    const storedUser = localStorage.getItem('movie_log_user');
    if (storedUser) {
      setIsConnected(true);
      const user = JSON.parse(storedUser);
      
      // Check if user already voted today (from database)
      fetch(`/api/vote?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.vote) {
            setVoted(data.vote.winnerId);
          }
        })
        .catch(err => console.error('Error checking vote:', err));
    }
  }, [movies]);

  const handleConnect = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask to vote!');
      return;
    }

    setIsConnecting(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      
      if (accounts.length > 0) {
        const address = accounts[0];
        const response = await fetch('/api/auth/wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address })
        });

        const data = await response.json();
        if (response.ok) {
          localStorage.setItem('movie_log_user', JSON.stringify(data.user));
          setIsConnected(true);
          setShowConnectPrompt(false);
        }
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleVote = async (movieId: string) => {
    if (!isConnected || !pair) {
      setShowConnectPrompt(true);
      return;
    }
    
    const storedUser = localStorage.getItem('movie_log_user');
    if (!storedUser) return;
    
    const user = JSON.parse(storedUser);
    
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
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
      {/* Connect Wallet Prompt Overlay */}
      {showConnectPrompt && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-2xl"
        >
          <div className="text-center p-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Connect to Vote</h3>
            <p className="text-sm text-white mb-6">Connect your wallet to vote in today's battle</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowConnectPrompt(false)}
                className="px-4 py-2 rounded-lg border border-neutral-800 text-white text-sm hover:bg-neutral-900 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-neutral-200 transition-all disabled:opacity-50"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            </div>
          </div>
        </motion.div>
      )}

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
