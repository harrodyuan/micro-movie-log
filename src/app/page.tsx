'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { Search, Star, Calendar, MapPin, Trophy, Filter, BarChart3 } from 'lucide-react';
import { movies } from '@/data/movies';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('All');

  // Extract available years from data
  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(movies.map(m => new Date(m.date).getFullYear().toString())));
    return ['All', ...uniqueYears.sort((a, b) => b.localeCompare(a))];
  }, []);

  const filteredMovies = useMemo(() => {
    return movies
      .filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.review.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesYear = selectedYear === 'All' || new Date(movie.date).getFullYear().toString() === selectedYear;
        return matchesSearch && matchesYear;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [searchQuery, selectedYear]);

  const stats = useMemo(() => {
    return {
      count: filteredMovies.length,
      averageRating: filteredMovies.length > 0 
        ? (filteredMovies.reduce((acc, m) => acc + m.rating, 0) / filteredMovies.length).toFixed(1)
        : '0.0'
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
        className={`w-3.5 h-3.5 ${i < rating ? 'fill-white text-white' : 'text-gray-600'}`} 
      />
    ));
  };

  return (
    <main className="min-h-screen bg-black text-gray-100 p-4 md:p-8 max-w-3xl mx-auto font-sans selection:bg-gray-800">
      <header className="mb-12">
        <h1 className="text-3xl font-bold mb-2 tracking-tight text-white">Micro-Movie Log</h1>
        <p className="text-gray-400 mb-8">A minimalist log of films watched</p>
        
        {/* Search and Filter Section */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search movies..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-all text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-800/50 backdrop-blur-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-200">{stats.count} <span className="text-gray-500 font-normal">Movies</span></span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-200">{stats.averageRating} <span className="text-gray-500 font-normal">Avg</span></span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Year</span>
              <div className="flex space-x-1">
                {years.map(year => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      selectedYear === year 
                        ? 'bg-white text-black font-medium' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Timeline List */}
      <div className="relative pl-4 space-y-8 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[1px] before:bg-gradient-to-b before:from-gray-800 before:via-gray-700 before:to-gray-800">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie, index) => (
            <article 
              key={movie.id} 
              className="relative pl-6 group"
            >
              {/* Timeline Dot */}
              <div className="absolute left-[-4.5px] top-1.5 w-[9px] h-[9px] rounded-full bg-black border border-gray-600 group-hover:border-white group-hover:scale-125 transition-all duration-300 z-10" />
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4 mb-2">
                <h2 className="text-lg font-medium text-white group-hover:text-gray-200 transition-colors">
                  {movie.title}
                </h2>
                <div className="flex flex-col items-start sm:items-end shrink-0">
                  <span className="text-xs text-gray-500 font-mono flex items-center">
                    {formatDate(movie.date)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center mb-3 space-x-3">
                <div className="flex space-x-0.5">
                  {renderStars(movie.rating)}
                </div>
                {movie.location && (
                  <span className="text-xs text-gray-600 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {movie.location}
                  </span>
                )}
              </div>
              
              {movie.review && (
                <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">
                  {movie.review}
                </p>
              )}
            </article>
          ))
        ) : (
          <div className="text-center py-12 pl-4">
            <p className="text-gray-600">No movies found for this filter.</p>
          </div>
        )}
      </div>

      {/* Lists / Blog Section */}
      <section className="mt-24 pt-10 border-t border-gray-900">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Lists & Collections</h3>
        <ul className="space-y-4">
          <li>
            <Link 
              href="/top10"
              className="group block p-4 rounded-xl bg-gray-900/30 hover:bg-gray-900 border border-gray-800 hover:border-gray-700 transition-all duration-300"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-white font-medium mb-1 group-hover:translate-x-1 transition-transform">Harold's Top 10 Movies in Theater (2025)</h4>
                  <p className="text-sm text-gray-500">My curated highlights from a year of cinema.</p>
                </div>
                <Trophy className="w-5 h-5 text-gray-600 group-hover:text-yellow-500 transition-colors" />
              </div>
            </Link>
          </li>
        </ul>
      </section>

      <footer className="mt-16 text-center text-xs text-gray-700 pb-8">
        <p>Micro-Movie Log — {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}
