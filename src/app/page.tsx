'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { Search, Star, Calendar, MapPin, Trophy } from 'lucide-react';
import { movies } from '@/data/movies';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMovies = useMemo(() => {
    return movies
      .filter(movie => 
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.review.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [searchQuery]);

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
        className={`w-4 h-4 ${i < rating ? 'fill-current' : 'text-gray-300'}`} 
        fill={i < rating ? "currentColor" : "none"}
      />
    ));
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-8 max-w-3xl mx-auto transition-colors duration-300">
      <header className="mb-12">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">Micro-Movie Log</h1>
            <p className="text-gray-600 dark:text-gray-400">A minimalist log of films watched</p>
          </div>
          <Link 
            href="/top10"
            className="flex items-center space-x-2 px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-full text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
          >
            <Trophy className="w-4 h-4" />
            <span>Harold's Top 10</span>
          </Link>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search movies..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <div className="space-y-8">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <article 
              key={movie.id} 
              className="border-b border-gray-100 dark:border-gray-800 pb-6 last:border-b-0 last:pb-0"
            >
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-medium text-foreground">{movie.title}</h2>
                <div className="flex flex-col items-end space-y-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-mono flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    {formatDate(movie.date)}
                  </span>
                  {movie.location && (
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-mono flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {movie.location}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center my-2">
                <div className="flex">
                  {renderStars(movie.rating)}
                </div>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  {movie.rating}/5
                </span>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mt-2">{movie.review}</p>
            </article>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No movies found. Try a different search term.</p>
          </div>
        )}
      </div>

      <footer className="mt-16 text-center text-sm text-gray-500">
        <p>Micro-Movie Log — {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}
