'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Film, Trash2, Star } from 'lucide-react';
import Link from 'next/link';

interface Movie {
  id: string;
  title: string;
  date: string;
  rating: number;
  posterUrl: string | null;
}

export default function MyMoviesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && session?.user?.id) {
      fetchMyMovies();
    }
  }, [status, session]);

  async function fetchMyMovies() {
    try {
      const res = await fetch(`/api/movies?userId=${session?.user?.id}`);
      const data = await res.json();
      setMovies(data.movies || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  }

  async function searchTMDB(query: string) {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setSearching(true);
    try {
      const res = await fetch(`/api/tmdb/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
  }

  async function addMovie(tmdbMovie: any) {
    setAdding(true);
    try {
      const res = await fetch('/api/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: tmdbMovie.title,
          date: tmdbMovie.release_date || new Date().toISOString().split('T')[0],
          rating: 5,
          posterUrl: tmdbMovie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}` 
            : null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMovies(prev => [data.movie, ...prev]);
        setShowAddModal(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error adding movie:', error);
    } finally {
      setAdding(false);
    }
  }

  async function deleteMovie(id: string) {
    if (!confirm('Remove this movie from your collection?')) return;
    
    try {
      await fetch(`/api/movies/${id}`, { method: 'DELETE' });
      setMovies(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  }

  if (status === 'loading' || loading) {
    return (
      <main className="min-h-screen bg-black text-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto text-center py-20">
          <p className="text-zinc-500">Loading...</p>
        </div>
      </main>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">My Movies</h1>
            <p className="text-zinc-500">{movies.length} movies in your collection</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Movie
          </button>
        </div>

        {/* Movie Grid */}
        {movies.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-neutral-800 rounded-2xl">
            <Film className="w-12 h-12 mx-auto mb-4 text-zinc-700" />
            <p className="text-zinc-500 mb-4">Your collection is empty</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Add Your First Movie
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {movies.map(movie => (
              <div key={movie.id} className="group relative">
                <div className="aspect-[2/3] rounded-lg overflow-hidden bg-neutral-900 mb-2">
                  {movie.posterUrl ? (
                    <img 
                      src={movie.posterUrl} 
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-700">
                      <Film className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium text-white line-clamp-1">{movie.title}</p>
                <p className="text-xs text-zinc-500">{movie.date.split('-')[0]}</p>
                
                {/* Delete button on hover */}
                <button
                  onClick={() => deleteMovie(movie.id)}
                  className="absolute top-2 right-2 p-2 bg-black/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Movie Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Add Movie</h2>
            
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  searchTMDB(e.target.value);
                }}
                placeholder="Search for a movie..."
                className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-500"
                autoFocus
              />
            </div>

            {/* Search Results */}
            <div className="max-h-80 overflow-y-auto space-y-2 mb-4">
              {searching ? (
                <p className="text-center text-zinc-500 py-4">Searching...</p>
              ) : searchResults.length > 0 ? (
                searchResults.map((movie) => (
                  <button
                    key={movie.id}
                    onClick={() => addMovie(movie)}
                    disabled={adding}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800 transition-colors text-left disabled:opacity-50"
                  >
                    <div className="w-12 h-16 rounded overflow-hidden bg-zinc-800 flex-shrink-0">
                      {movie.poster_path ? (
                        <img 
                          src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="w-4 h-4 text-zinc-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{movie.title}</p>
                      <p className="text-sm text-zinc-500">
                        {movie.release_date?.split('-')[0] || 'Unknown year'}
                      </p>
                    </div>
                    <Plus className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  </button>
                ))
              ) : searchQuery ? (
                <p className="text-center text-zinc-500 py-4">No results found</p>
              ) : (
                <p className="text-center text-zinc-500 py-4">Type to search for movies</p>
              )}
            </div>

            <button
              onClick={() => {
                setShowAddModal(false);
                setSearchQuery('');
                setSearchResults([]);
              }}
              className="w-full py-3 border border-zinc-700 rounded-lg text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
