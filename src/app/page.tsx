'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { Search, Star, MapPin, Trophy, BarChart3, TrendingUp } from 'lucide-react';
import { movies } from '@/data/movies';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedMonth, setSelectedMonth] = useState<string>('All');

  // Extract available years from data
  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(movies.map(m => new Date(m.date).getFullYear().toString())));
    return ['All', ...uniqueYears.sort((a, b) => b.localeCompare(a))];
  }, []);

  // Extract available months for the selected year
  const months = useMemo(() => {
    if (selectedYear === 'All') return [];
    const uniqueMonths = Array.from(new Set(
      movies
        .filter(m => new Date(m.date).getFullYear().toString() === selectedYear)
        .map(m => new Date(m.date).getMonth())
    ));
    return ['All', ...uniqueMonths.sort((a, b) => a - b).map(m => new Date(2000, m).toLocaleString('default', { month: 'short' }))];
  }, [selectedYear]);

  const filteredMovies = useMemo(() => {
    return movies
      .filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.review.toLowerCase().includes(searchQuery.toLowerCase());
        const movieDate = new Date(movie.date);
        const matchesYear = selectedYear === 'All' || movieDate.getFullYear().toString() === selectedYear;
        const matchesMonth = selectedMonth === 'All' || movieDate.toLocaleString('default', { month: 'short' }) === selectedMonth;
        return matchesSearch && matchesYear && matchesMonth;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [searchQuery, selectedYear, selectedMonth]);

  const stats = useMemo(() => {
    return {
      count: filteredMovies.length,
    };
  }, [filteredMovies]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`w-3.5 h-3.5 ${i < rating ? 'fill-purple-400 text-purple-400' : 'text-gray-800'}`} 
      />
    ));
  };

  return (
    <main className="min-h-screen bg-[#050505] text-gray-100 p-4 md:p-8 font-sans selection:bg-purple-500/30 relative overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none z-0" />
      
      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* Header Section */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 tracking-tight bg-gradient-to-r from-white via-purple-50 to-purple-300 bg-clip-text text-transparent">
                Micro-Movie Log
              </h1>
              <p className="text-gray-400">A minimalist log of films watched</p>
            </div>
          </div>
          
          {/* Lists / Collections Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Link 
              href="/top10"
              className="group relative block overflow-hidden rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-500"
            >
              {/* Glass Background */}
              <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-50" />
              
              <div className="relative p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-purple-300 text-xs font-bold uppercase tracking-widest mb-1">Featured Collection</h3>
                  <h4 className="text-xl text-white font-medium mb-1 group-hover:translate-x-1 transition-transform">Harold's Top 10 Movies 2025</h4>
                  <p className="text-sm text-gray-400">Curated highlights & personal reviews.</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white group-hover:border-purple-400 transition-all duration-300">
                  <Trophy className="w-5 h-5" />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Search and Filters Dashboard */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4 sticky top-4 z-50"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg opacity-0 group-hover:opacity-30 blur transition-opacity duration-500" />
              <div className="relative bg-gray-900/70 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl group-focus-within:border-purple-500/50 transition-colors">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search movies..."
                  className="w-full pl-10 pr-4 py-3 bg-transparent text-sm focus:outline-none placeholder:text-gray-500 text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col space-y-4 p-4 bg-gray-900/40 backdrop-blur-md rounded-xl border border-white/10">
              {/* Stats Row */}
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-gray-200">{stats.count} <span className="text-gray-500 font-normal">Watched</span></span>
                  </div>
                </div>
              </div>

              {/* Filters Row */}
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Year</span>
                  <div className="flex space-x-1">
                    {years.map(year => (
                      <button
                        key={year}
                        onClick={() => {
                          setSelectedYear(year);
                          setSelectedMonth('All');
                        }}
                        className={cn(
                          "px-3 py-1 text-xs rounded-full transition-all duration-300 backdrop-blur-sm",
                          selectedYear === year 
                            ? "bg-purple-600 text-white font-medium shadow-[0_0_15px_rgba(147,51,234,0.3)] border border-purple-400/50" 
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        )}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence>
                  {selectedYear !== 'All' && months.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex items-center space-x-3 overflow-x-auto pb-1 max-w-full no-scrollbar"
                    >
                      <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold shrink-0">Month</span>
                      <div className="flex space-x-1">
                        {months.map(month => (
                          <button
                            key={month}
                            onClick={() => setSelectedMonth(month)}
                            className={cn(
                              "px-3 py-1 text-xs rounded-full transition-all duration-300 whitespace-nowrap backdrop-blur-sm",
                              selectedMonth === month
                                ? "bg-white/10 text-purple-200 font-medium border border-purple-500/30 shadow-[0_0_10px_rgba(147,51,234,0.1)]" 
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                          >
                            {month}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.header>

        {/* Timeline List */}
        <div className="relative pl-4 space-y-8 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[1px] before:bg-gradient-to-b before:from-transparent before:via-gray-800 before:to-transparent">
          <AnimatePresence mode="popLayout">
            {filteredMovies.length > 0 ? (
              filteredMovies.map((movie, index) => (
                <motion.article 
                  key={movie.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative pl-8 group"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-[-4px] top-2 w-[9px] h-[9px] rounded-full bg-[#050505] border-2 border-gray-800 group-hover:border-purple-400 group-hover:scale-125 transition-all duration-300 z-10 shadow-[0_0_0_4px_rgba(5,5,5,1)]" />
                  
                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:border-purple-500/20 hover:bg-white/[0.05] backdrop-blur-sm transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-purple-900/10">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4 mb-3">
                      <h2 className="text-lg font-medium text-white group-hover:text-purple-300 transition-colors">
                        {movie.title}
                      </h2>
                      <div className="flex flex-col items-start sm:items-end shrink-0">
                        <span className="text-xs text-gray-500 font-mono bg-black/20 px-2 py-1 rounded border border-white/5">
                          {formatDate(movie.date)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-4 space-x-4">
                      <div className="flex space-x-0.5">
                        {renderStars(movie.rating)}
                      </div>
                      {movie.location && (
                        <span className="text-xs text-gray-500 flex items-center bg-gray-900/50 px-2 py-0.5 rounded-full">
                          <MapPin className="w-3 h-3 mr-1.5" />
                          {movie.location}
                        </span>
                      )}
                    </div>
                    
                    {movie.review && (
                      <p className="text-sm text-gray-400 leading-relaxed max-w-2xl font-light">
                        {movie.review}
                      </p>
                    )}
                  </div>
                </motion.article>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 pl-4"
              >
                <p className="text-gray-600">No movies found.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <footer className="mt-24 text-center text-xs text-gray-700 pb-8">
          <p>Micro-Movie Log — {new Date().getFullYear()}</p>
        </footer>
      </div>
    </main>
  );
}
