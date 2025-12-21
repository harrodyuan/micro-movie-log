'use client';

import Link from 'next/link';
import { ArrowLeft, Trophy, Star } from 'lucide-react';
import { top10Movies } from '@/data/top10';
import { motion } from 'framer-motion';

export default function Top10() {
  return (
    <main className="min-h-screen bg-[#050505] text-gray-100 p-4 md:p-8 font-sans selection:bg-yellow-500/30">
      <div className="max-w-4xl mx-auto">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 pt-8"
        >
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-gray-500 hover:text-yellow-500 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Log
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-yellow-500/10 rounded-full">
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Top 10 movies in theater 2025</h1>
          </div>
          
          <div className="text-gray-400 space-y-6 max-w-2xl text-lg leading-relaxed font-light border-l-2 border-gray-800 pl-6">
            <p>
              I watched a lot of movies this year. In theaters. I love movies, and I make money with quant. The only way I can show my love is going to the theater and watching movies, or maybe making some movies when I have time.
            </p>
            <p>
              This year my 90% confidence interval of the number of movies that I watched in theaters would be bid 99 ask 120 from Jan. 16th to Dec 20th (as of today). I watched them in Dolby, IMAX, IMAX 3D, IMAX 70mm, and other formats.
            </p>
            <p className="font-medium text-white pt-2">
              Here are my top 10 movies IN THEATER for 2025:
            </p>
          </div>
        </motion.header>

        <div className="space-y-12">
          {top10Movies.map((movie, index) => (
            <motion.article 
              key={movie.rank} 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group flex flex-col md:flex-row gap-8 pb-12 last:pb-0"
            >
              {/* Poster Card */}
              <div className="relative shrink-0 w-full md:w-56 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl bg-gray-900 group-hover:scale-[1.02] transition-transform duration-500 ring-1 ring-white/10">
                {movie.posterUrl ? (
                  <img 
                    src={movie.posterUrl} 
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 bg-gray-900">
                    No Poster
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              
              {/* Content */}
              <div className="flex-1 py-2 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-700 text-gray-400 font-mono text-sm group-hover:border-yellow-500 group-hover:text-yellow-500 transition-colors">
                    {movie.rank}
                  </span>
                  <span className="text-sm font-mono text-gray-600">{movie.year}</span>
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-yellow-500 transition-colors">
                  {movie.title}
                </h2>
                
                <p className="text-gray-400 leading-relaxed text-lg font-light border-l border-gray-800 pl-6 group-hover:border-yellow-500/50 transition-colors">
                  {movie.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        <footer className="mt-24 pt-12 border-t border-gray-900 text-center text-sm text-gray-600">
          <p>Micro-Movie Log — {new Date().getFullYear()}</p>
        </footer>
      </div>
    </main>
  );
}
