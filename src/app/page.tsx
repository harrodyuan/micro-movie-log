'use client';

import { useState, useMemo } from 'react';
import { Search, Star, Calendar, MapPin } from 'lucide-react';
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
      />
    ));
  };

  return (
    <main className="min-h-screen bg-white p-4 md:p-8 max-w-3xl mx-auto">
      <header className="mb-12">
        <h1 className="text-3xl font-bold mb-2">Micro-Movie Log</h1>
        <p className="text-gray-600 mb-6">A minimalist log of films watched</p>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search movies..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
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
              className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0"
            >
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-medium">{movie.title}</h2>
                <div className="flex flex-col items-end space-y-1">
                  <span className="text-sm text-gray-500 font-mono flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    {formatDate(movie.date)}
                  </span>
                  {movie.location && (
                    <span className="text-xs text-gray-400 font-mono flex items-center">
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
                <span className="ml-2 text-sm text-gray-500">
                  {movie.rating}/5
                </span>
              </div>
              
              <p className="text-gray-700 mt-2">{movie.review}</p>
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
