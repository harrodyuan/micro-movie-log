'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Swords, ArrowLeft, RefreshCw } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ConnectWallet } from '@/components/ConnectWallet';
import { getVotingPair, submitVote, getLeaderboard } from '@/app/actions';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Define types based on our server actions
type Movie = {
  id: string;
  title: string;
  date: string;
  elo: number;
  matches: number;
  posterUrl: string | null;
};

type LeaderboardItem = Movie & { rank: number };

export default function RankingsPage() {
  // Default to the main user for the global rankings page
  const username = 'bigdirectorharold';
  
  const [activeTab, setActiveTab] = useState<'vote' | 'leaderboard'>('vote');
  const [currentPair, setCurrentPair] = useState<[Movie, Movie] | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      const [pair, board] = await Promise.all([
        getVotingPair(username),
        getLeaderboard(username)
      ]);
      
      setCurrentPair(pair as [Movie, Movie] | null);
      setLeaderboard(board as LeaderboardItem[]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Refresh just the pair
  const refreshPair = async () => {
    setIsVoting(true);
    try {
      const pair = await getVotingPair(username);
      setCurrentPair(pair as [Movie, Movie] | null);
    } catch (error) {
      console.error('Error refreshing pair:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const handleVote = async (winnerId: string) => {
    if (!currentPair || isVoting) return;

    const winner = currentPair.find(m => m.id === winnerId);
    const loser = currentPair.find(m => m.id !== winnerId);

    if (!winner || !loser) return;

    setIsVoting(true);
    try {
      const result = await submitVote(winner.id, loser.id, username);
      if (result.success) {
        // Refresh data
        const [newPair, newLeaderboard] = await Promise.all([
          getVotingPair(username),
          getLeaderboard(username)
        ]);
        setCurrentPair(newPair as [Movie, Movie] | null);
        setLeaderboard(newLeaderboard as LeaderboardItem[]);
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
    } finally {
      setIsVoting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 font-sans selection:bg-white/30">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-6 tracking-tight text-white">
              Moving Image Data Base
            </h1>

            {/* Navigation Tabs */}
            <div className="flex justify-center items-center space-x-1 p-1 bg-neutral-900/50 backdrop-blur-md rounded-full inline-flex border border-neutral-800">
              <Link href="/" className="px-6 py-2 rounded-full text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                Log
              </Link>
              <Link href="/rankings" className="px-6 py-2 rounded-full text-sm font-medium bg-white text-black shadow-lg">
                Rankings
              </Link>
              <button className="px-6 py-2 rounded-full text-sm font-medium text-neutral-400 hover:text-white transition-colors cursor-not-allowed opacity-50">
                Reviews
              </button>
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
                  : "border-transparent text-neutral-500 hover:text-white"
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
                  : "border-transparent text-neutral-500 hover:text-white"
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
                disabled={isVoting}
                className="group relative h-[400px] w-full rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-white transition-all duration-300 overflow-hidden text-left flex flex-col disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex-1 p-8 flex flex-col justify-center items-center text-center z-10">
                  <span className="text-neutral-500 text-sm font-mono mb-4 uppercase tracking-widest">Option A</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white group-hover:scale-105 transition-transform duration-300">
                    {currentPair[0].title}
                  </h2>
                  <p className="mt-4 text-neutral-400">{currentPair[0].date.split('-')[0]}</p>
                </div>
                {currentPair[0].posterUrl && (
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                    <img 
                      src={currentPair[0].posterUrl} 
                      alt={currentPair[0].title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-50" />
              </button>

              {/* VS Badge */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-black border border-neutral-800 text-neutral-500 font-bold shadow-2xl">
                VS
              </div>

              {/* Option B */}
              <button 
                onClick={() => handleVote(currentPair[1].id)}
                disabled={isVoting}
                className="group relative h-[400px] w-full rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-white transition-all duration-300 overflow-hidden text-left flex flex-col disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex-1 p-8 flex flex-col justify-center items-center text-center z-10">
                  <span className="text-neutral-500 text-sm font-mono mb-4 uppercase tracking-widest">Option B</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white group-hover:scale-105 transition-transform duration-300">
                    {currentPair[1].title}
                  </h2>
                   <p className="mt-4 text-neutral-400">{currentPair[1].date.split('-')[0]}</p>
                </div>
                {currentPair[1].posterUrl && (
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                    <img 
                      src={currentPair[1].posterUrl} 
                      alt={currentPair[1].title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-50" />
              </button>

              <div className="col-span-1 md:col-span-2 text-center mt-8">
                <button 
                  onClick={refreshPair}
                  disabled={isVoting}
                  className="text-neutral-500 hover:text-white text-sm flex items-center justify-center gap-2 mx-auto transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={cn("w-4 h-4", isVoting && "animate-spin")} />
                  {isVoting ? 'Loading...' : 'Skip Pair'}
                </button>
              </div>
            </motion.div>
          ) : activeTab === 'vote' ? (
            <div className="text-center py-20 text-neutral-500">
              No movies found to battle.
            </div>
          ) : (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 max-w-2xl mx-auto"
            >
              {leaderboard.map((item, index) => (
                <div 
                  key={item.id}
                  className="flex items-center gap-6 p-4 rounded-xl bg-neutral-900/30 border border-neutral-800 hover:bg-neutral-900 transition-colors"
                >
                  <span className={cn(
                    "font-mono text-lg w-8 text-center",
                    index === 0 ? "text-yellow-500 font-bold" :
                    index === 1 ? "text-neutral-300 font-bold" :
                    index === 2 ? "text-amber-700 font-bold" :
                    "text-neutral-600"
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
                      <span className="text-xs text-neutral-500 font-mono">
                        {item.elo} pts
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-neutral-600 font-mono">
                    {item.matches} matches
                  </div>
                </div>
              ))}
              
              {leaderboard.length === 0 && (
                <div className="text-center py-20 text-neutral-500">
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
