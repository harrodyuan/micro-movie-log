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
      className="border border-neutral-800 rounded-xl overflow-hidden hover:border-white transition-colors"
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
          <p className="text-white font-medium">{displayName}</p>
          <p className="text-sm text-white">@{username}</p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Full List - Always visible */}
          <Link 
            href={`/${username}/${activeTab}`}
            className="px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-white hover:bg-neutral-900 transition-all text-xs text-white font-medium"
          >
            Full List
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
              <div className="flex justify-center items-center space-x-1 p-1 bg-neutral-900/50 backdrop-blur-md rounded-full border border-neutral-800 mb-4">
                <button 
                  onClick={() => setActiveTab('log')}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === 'log' 
                      ? 'bg-white text-black shadow-lg' 
                      : 'text-white hover:text-white'
                  }`}
                >
                  Log
                </button>
                <button 
                  onClick={() => setActiveTab('rankings')}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === 'rankings' 
                      ? 'bg-white text-black shadow-lg' 
                      : 'text-white hover:text-white'
                  }`}
                >
                  Rankings
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
                    <div className="text-xs text-white uppercase tracking-wider font-semibold mb-2">
                      Recent Entries • {movies.length} Total
                    </div>
                    {previewMovies.map((movie, index) => (
                      <motion.div
                        key={movie.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-3 rounded-xl bg-black border border-neutral-900"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-sm font-medium text-white">{movie.title}</h3>
                          <span className="text-xs text-white bg-black px-2 py-0.5 rounded border border-neutral-900">
                            {formatDate(movie.date)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex space-x-0.5">
                            {renderStars(movie.rating)}
                          </div>
                          {movie.location && (
                            <span className="text-xs text-white flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {movie.location}
                            </span>
                          )}
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
                    <div className="text-xs text-white uppercase tracking-wider font-semibold mb-2">
                      Top Rated • {movies.length} Total
                    </div>
                    {rankingsPreview.map((movie, index) => (
                      <motion.div
                        key={movie.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-3 rounded-xl bg-black border border-neutral-900 flex items-center gap-4"
                      >
                        {/* Rank Number */}
                        <span className={`font-mono text-lg w-6 text-center ${
                          index === 0 ? 'text-yellow-500 font-bold' :
                          index === 1 ? 'text-white font-bold' :
                          index === 2 ? 'text-amber-700 font-bold' :
                          'text-white'
                        }`}>
                          {index + 1}
                        </span>
                        
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-white">{movie.title}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex space-x-0.5">
                              {renderStars(movie.rating)}
                            </div>
                            <span className="text-xs text-white">
                              {movie.rating}/5
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
