'use client';

import Link from 'next/link';
import { ArrowLeft, Trophy } from 'lucide-react';
import { top10Movies } from '@/data/top10';

export default function Top10() {
  return (
    <main className="min-h-screen bg-background p-4 md:p-8 max-w-3xl mx-auto transition-colors duration-300">
      <header className="mb-12">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm text-gray-500 hover:text-black dark:hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Log
        </Link>
        
        <div className="flex items-center space-x-3 mb-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h1 className="text-3xl font-bold text-foreground">Harold's Top 10</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          The cinematic highlights of 2025 that defined the year.
        </p>
      </header>

      <div className="space-y-12">
        {top10Movies.map((movie) => (
          <article 
            key={movie.rank} 
            className="flex flex-col md:flex-row gap-6 border-b border-gray-100 dark:border-gray-800 pb-12 last:border-b-0 last:pb-0"
          >
            <div className="relative shrink-0 w-full md:w-48 aspect-[2/3] rounded-lg overflow-hidden shadow-md bg-gray-100 dark:bg-gray-800">
              {movie.posterUrl ? (
                <img 
                  src={movie.posterUrl} 
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Poster
                </div>
              )}
              <div className="absolute top-0 left-0 w-10 h-10 bg-black text-white flex items-center justify-center font-bold text-lg rounded-br-lg shadow-sm">
                #{movie.rank}
              </div>
            </div>
            
            <div className="flex-1 py-2">
              <div className="flex justify-between items-baseline mb-2">
                <h2 className="text-2xl font-bold text-foreground">{movie.title}</h2>
                <span className="text-sm font-mono text-gray-500">{movie.year}</span>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                {movie.description}
              </p>
            </div>
          </article>
        ))}
      </div>

      <footer className="mt-16 text-center text-sm text-gray-500">
        <p>Micro-Movie Log — {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}
