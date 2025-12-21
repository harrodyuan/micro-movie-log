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
        
        <div className="flex items-center space-x-3 mb-8">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h1 className="text-3xl font-bold text-foreground">Top 10 movies in theater 2025</h1>
        </div>
        <div className="text-gray-600 dark:text-gray-400 space-y-6 max-w-2xl text-lg leading-relaxed">
          <p>
            I watched a lot of movies this year. In theaters. I love movies, and I make money with quant. The only way I can show my love is going to the theater and watching movies, or maybe making some movies when I have time.
          </p>
          <p>
            This year my 90% confidence interval of the number of movies that I watched in theaters would be bid 99 ask 120 from Jan. 16th to Dec 20th (as of today). I watched them in Dolby, IMAX, IMAX 3D, IMAX 70mm, and other formats.
          </p>
          <p className="font-medium text-foreground">
            Here are my top 10 movies IN THEATER for 2025:
          </p>
        </div>
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
