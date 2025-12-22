'use client';

import { ConnectWallet } from './ConnectWallet';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { Search, Star, MapPin, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Define the shape of our Movie data (matching Prisma)
interface Movie {
  id: string;
  title: string;
  date: string; // ISO string
  rating: number;
  review: string | null;
  posterUrl: string | null;
  location: string | null;
  elo: number;
  matches: number;
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function MovieDashboard({ initialMovies, username }: { initialMovies: Movie[], username: string }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedMonth, setSelectedMonth] = useState<string>('All');

  // Extract available years from data
  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(initialMovies.map(m => new Date(m.date).getFullYear().toString())));
    return ['All', ...uniqueYears.sort((a, b) => b.localeCompare(a))];
  }, [initialMovies]);

  // Extract available months for the selected year
  const months = useMemo(() => {
    if (selectedYear === 'All') return [];
    const uniqueMonths = Array.from(new Set(
      initialMovies
        .filter(m => new Date(m.date).getFullYear().toString() === selectedYear)
        .map(m => new Date(m.date).getMonth())
    ));
    return ['All', ...uniqueMonths.sort((a, b) => a - b).map(m => new Date(2000, m).toLocaleString('default', { month: 'short' }))];
  }, [selectedYear, initialMovies]);

  const filteredMovies = useMemo(() => {
    return initialMovies
      .filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (movie.review || '').toLowerCase().includes(searchQuery.toLowerCase());
        const movieDate = new Date(movie.date);
        const matchesYear = selectedYear === 'All' || movieDate.getFullYear().toString() === selectedYear;
        const matchesMonth = selectedMonth === 'All' || movieDate.toLocaleString('default', { month: 'short' }) === selectedMonth;
        return matchesSearch && matchesYear && matchesMonth;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [searchQuery, selectedYear, selectedMonth, initialMovies]);

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
        className={`w-3.5 h-3.5 ${i < rating ? 'fill-white text-white' : 'text-neutral-800'}`} 
      />
    ));
  };

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 font-sans selection:bg-white/30">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Section */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="mb-8 relative">
            <h1 className="text-5xl font-bold tracking-tight text-white mb-6">
              Moving Image Data Base
            </h1>

            {/* Main Navigation Tabs */}
            <div className="flex justify-center items-center space-x-1 p-1 bg-neutral-900/50 backdrop-blur-md rounded-full inline-flex border border-neutral-800">
              <Link 
                href="/" 
                className="p-2 rounded-full text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
                title="Back to Home"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div className="w-px h-4 bg-neutral-800 mx-1" />
              <Link href={`/${username}/log`} className="px-6 py-2 rounded-full text-sm font-medium bg-white text-black shadow-lg">
                Log
              </Link>
              <Link href={`/${username}/rankings`} className="px-6 py-2 rounded-full text-sm font-medium text-white hover:text-white transition-colors">
                Rankings
              </Link>
              <div className="w-px h-4 bg-neutral-800 mx-2" />
              <div className="px-2">
                <ConnectWallet />
              </div>
            </div>
          </div>
          
          {/* Search and Filters Dashboard */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4 sticky top-4 z-50"
          >
            <div className="relative group">
              <div className="relative bg-black border border-neutral-800 rounded-lg shadow-xl group-focus-within:border-white transition-colors">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500 group-focus-within:text-white transition-colors" />
                <input
                  type="text"
                  placeholder="Search database..."
                  className="w-full pl-10 pr-4 py-3 bg-transparent text-sm focus:outline-none placeholder:text-neutral-600 text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col space-y-4 p-4 bg-black rounded-xl border border-neutral-800">
              {/* Stats Row */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-900">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-white">Chronological Log</span>
                    <span className="text-sm text-white">•</span>
                    <span className="text-sm font-medium text-white">{stats.count} <span className="text-white font-normal">Entries</span></span>
                  </div>
                </div>
              </div>

              {/* Filters Row */}
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-white uppercase tracking-wider font-semibold">Year</span>
                  <div className="flex space-x-1">
                    {years.map(year => (
                      <button
                        key={year}
                        onClick={() => {
                          setSelectedYear(year);
                          setSelectedMonth('All');
                        }}
                        className={cn(
                          "px-3 py-1 text-xs rounded-full transition-all duration-300 font-medium",
                          selectedYear === year 
                            ? "bg-white text-black" 
                            : "text-white hover:text-white"
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
                      <span className="text-xs text-white uppercase tracking-wider font-semibold shrink-0">Month</span>
                      <div className="flex space-x-1">
                        {months.map(month => (
                          <button
                            key={month}
                            onClick={() => setSelectedMonth(month)}
                            className={cn(
                              "px-3 py-1 text-xs rounded-full transition-all duration-300 whitespace-nowrap font-medium",
                              selectedMonth === month
                                ? "bg-white text-black" 
                                : "text-white hover:text-white"
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
        <div className="relative pl-4 space-y-8 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[1px] before:bg-gradient-to-b before:from-transparent before:via-neutral-900 before:to-transparent">
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
                  <div className="absolute left-[-4px] top-2 w-[9px] h-[9px] rounded-full bg-black border-2 border-neutral-800 group-hover:border-white group-hover:scale-125 transition-all duration-300 z-10" />
                  
                  <div className="p-5 rounded-2xl bg-black border border-neutral-900 hover:border-white transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4 mb-3">
                      <h2 className="text-lg font-medium text-white group-hover:text-white transition-colors">
                        {movie.title}
                      </h2>
                      <div className="flex flex-col items-start sm:items-end shrink-0">
                        <span className="text-xs text-white bg-black px-2 py-1 rounded border border-neutral-900 group-hover:border-white group-hover:text-white transition-colors duration-300">
                          {formatDate(movie.date)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-4 space-x-4">
                      <div className="flex space-x-0.5">
                        {renderStars(movie.rating)}
                      </div>
                      {movie.location && (
                        <span className="text-xs text-white flex items-center">
                          <MapPin className="w-3 h-3 mr-1.5" />
                          {movie.location}
                        </span>
                      )}
                    </div>
                    
                    {movie.review && (
                      <p className="text-sm text-white leading-relaxed max-w-2xl font-light">
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
                <p className="text-white">No movies found.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <footer className="mt-24 text-center text-xs text-white pb-8">
          <p>Micro-Movie Log — {new Date().getFullYear()}</p>
        </footer>
      </div>
    </main>
  );
}
