import Link from 'next/link';
import { List, Film, Trophy, Star } from 'lucide-react';

export default function ListsPage() {
  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <List className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-white">Featured Lists</h1>
          </div>
          <p className="text-zinc-500">Curated movie collections</p>
        </header>

        {/* Lists */}
        <div className="space-y-3">
          <Link href="/users/bigdirectorharold" className="block">
            <div className="p-5 border border-neutral-800 rounded-xl hover:border-yellow-500 transition-colors group">
              <div className="flex items-center gap-3 mb-2">
                <Film className="w-5 h-5 text-yellow-500" />
                <p className="text-lg font-semibold text-white group-hover:text-yellow-500 transition-colors">
                  Harold's 2024-2025 Theater Log
                </p>
              </div>
              <p className="text-sm text-zinc-500">All movies seen in theaters</p>
            </div>
          </Link>
          
          <Link href="/top10" className="block">
            <div className="p-5 border border-neutral-800 rounded-xl hover:border-yellow-500 transition-colors group">
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <p className="text-lg font-semibold text-white group-hover:text-yellow-500 transition-colors">
                  Harold's Top 10 Movies 2025
                </p>
              </div>
              <p className="text-sm text-zinc-500">Best of the year picks</p>
            </div>
          </Link>
          
          <Link href="/users/imdb_top250" className="block">
            <div className="p-5 border border-neutral-800 rounded-xl hover:border-yellow-500 transition-colors group">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <p className="text-lg font-semibold text-white group-hover:text-yellow-500 transition-colors">
                  IMDB Top 250
                </p>
              </div>
              <p className="text-sm text-zinc-500">242 classic films from IMDB's top rated list</p>
            </div>
          </Link>
          
          <Link href="/users/douban_top250" className="block">
            <div className="p-5 border border-neutral-800 rounded-xl hover:border-yellow-500 transition-colors group">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <p className="text-lg font-semibold text-white group-hover:text-yellow-500 transition-colors">
                  豆瓣 Top 250
                </p>
              </div>
              <p className="text-sm text-zinc-500">208 films from Douban's top rated list</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
