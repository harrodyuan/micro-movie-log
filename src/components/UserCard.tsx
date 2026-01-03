'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Star, MapPin } from 'lucide-react';

interface Movie {
  id: string;
  title: string;
  date: string;
  rating: number;
  location: string | null;
  posterUrl: string | null;
}

interface UserCardProps {
  username: string;
  displayName: string;
  movies: Movie[];
}

export function UserCard({ username, displayName, movies }: UserCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'log' | 'rankings'>('log');

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
        className={`w-3 h-3 ${i < rating ? 'fill-white text-white' : 'text-neutral-800'}`} 
      />
    ));
  };

  // Show first 5 movies as preview
  const previewMovies = movies.slice(0, 5);
  
  // Sort by rating for rankings preview (top 5)
  const rankingsPreview = [...movies]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  return (
    <motion.div 
      layout
      className="border border-neutral-800 rounded-xl overflow-hidden hover:border-white transition-colors bg-black"
    >
      {/* User Header */}
      <motion.div
        layout="position"
        className="p-4 flex items-center justify-between"
      >
        <div 
          className="cursor-pointer flex-1"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <p className="text-white font-medium text-lg">{displayName}</p>
          <p className="text-sm text-neutral-400">@{username}</p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Full List - Always visible */}
          <Link 
            href={`/${username}/log`}
            className="px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-white hover:bg-neutral-900 transition-all text-xs text-white font-medium"
          >
            Full Log
          </Link>
          
          {/* Expand/Collapse Toggle */}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg border border-neutral-800 hover:border-white hover:bg-neutral-900 transition-all"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-white" />
            </motion.div>
          </button>
        </div>
      </motion.div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {/* Tab Switcher */}
              <div className="flex justify-center items-center space-x-1 p-1 bg-neutral-900/50 backdrop-blur-md rounded-full border border-neutral-800 mb-6">
                <button 
                  onClick={() => setActiveTab('log')}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === 'log' 
                      ? 'bg-white text-black shadow-lg' 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Recent Log
                </button>
                <button 
                  onClick={() => setActiveTab('rankings')}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === 'rankings' 
                      ? 'bg-white text-black shadow-lg' 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Top Rated
                </button>
              </div>

              {/* Content based on active tab */}
              <AnimatePresence mode="wait">
                {activeTab === 'log' ? (
                  <motion.div
                    key="log-content"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-3"
                  >
                    {previewMovies.map((movie, index) => (
                      <motion.div
                        key={movie.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex gap-4 p-3 rounded-xl bg-neutral-900/30 border border-neutral-900 hover:border-neutral-700 transition-colors"
                      >
                        {/* Poster */}
                        <div className="shrink-0 w-12 aspect-[2/3] rounded bg-neutral-800 overflow-hidden border border-neutral-800">
                          {movie.posterUrl ? (
                            <img 
                              src={movie.posterUrl} 
                              alt={movie.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-600">
                              No Poster
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="text-sm font-medium text-white truncate pr-2">{movie.title}</h3>
                            <span className="text-[10px] text-neutral-400 whitespace-nowrap bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">
                              {formatDate(movie.date)}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-3 mt-2">
                            <div className="flex space-x-0.5">
                              {renderStars(movie.rating)}
                            </div>
                            {movie.location && (
                              <span className="text-[10px] text-neutral-500 flex items-center truncate">
                                <MapPin className="w-3 h-3 mr-1" />
                                {movie.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="rankings-content"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    {rankingsPreview.map((movie, index) => (
                      <motion.div
                        key={movie.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex gap-4 p-3 rounded-xl bg-neutral-900/30 border border-neutral-900 hover:border-neutral-700 transition-colors"
                      >
                         {/* Rank Number */}
                         <div className={`flex flex-col justify-center items-center w-8 shrink-0 ${
                          index === 0 ? 'text-yellow-500' :
                          index === 1 ? 'text-neutral-300' :
                          index === 2 ? 'text-amber-700' :
                          'text-neutral-600'
                        }`}>
                          <span className="text-lg font-bold font-mono">#{index + 1}</span>
                        </div>

                        {/* Poster */}
                        <div className="shrink-0 w-12 aspect-[2/3] rounded bg-neutral-800 overflow-hidden border border-neutral-800">
                          {movie.posterUrl ? (
                            <img 
                              src={movie.posterUrl} 
                              alt={movie.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-600">
                              No Poster
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h3 className="text-sm font-medium text-white truncate">{movie.title}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex space-x-0.5">
                              {renderStars(movie.rating)}
                            </div>
                            <span className="text-xs text-neutral-400">
                              {movie.rating}/5
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="mt-4 text-center">
                <Link 
                  href={`/${username}/${activeTab}`}
                  className="text-xs text-neutral-500 hover:text-white transition-colors"
                >
                  View All {movies.length} Movies →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
