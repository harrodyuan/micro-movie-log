'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getLeaderboard } from '@/app/actions';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type LeaderboardItem = {
  id: string;
  title: string;
  date: string;
  elo: number;
  matches: number;
  posterUrl: string | null;
  rank: number;
};

export default function RankingsPage() {
  const username = 'bigdirectorharold';
  
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const board = await getLeaderboard(username);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-white">Movie Rankings</h1>
          </div>
          <p className="text-zinc-500">Top rated movies based on battle votes</p>
        </header>

        {/* Leaderboard */}
        <div className="space-y-3">
          {leaderboard.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:bg-neutral-900 transition-colors"
            >
              <span className={cn(
                "font-mono text-xl w-10 text-center font-bold",
                index === 0 ? "text-yellow-500" :
                index === 1 ? "text-zinc-300" :
                index === 2 ? "text-amber-600" :
                "text-zinc-600"
              )}>
                {item.rank}
              </span>
              
              {item.posterUrl && (
                <div className="w-12 h-16 rounded overflow-hidden flex-shrink-0">
                  <img src={item.posterUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white truncate">{item.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <div className="h-1.5 flex-1 bg-neutral-800 rounded-full max-w-[150px] overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500/50 rounded-full" 
                      style={{ width: `${Math.min(100, (item.elo / 2000) * 100)}%` }} 
                    />
                  </div>
                  <span className="text-xs text-zinc-500 font-mono">
                    {item.elo} pts
                  </span>
                </div>
              </div>

              <div className="text-xs text-zinc-600 font-mono">
                {item.matches} battles
              </div>
            </motion.div>
          ))}
          
          {leaderboard.length === 0 && (
            <div className="text-center py-20 text-zinc-500 border border-dashed border-neutral-800 rounded-2xl">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-zinc-700" />
              <p>No rankings yet</p>
              <p className="text-sm mt-1">Start battling on the homepage to build rankings!</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
