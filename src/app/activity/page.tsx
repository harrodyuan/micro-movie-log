import { prisma } from '@/lib/db';
import Link from 'next/link';
import { Activity, Film } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function ActivityPage() {
  const recent = await prisma.movie.findMany({
    orderBy: { createdAt: 'desc' },
    take: 60,
    select: {
      id: true, title: true, posterUrl: true, date: true, elo: true,
      createdAt: true,
      user: { select: { username: true } },
    },
  });


  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 font-sans pt-20">
      <div className="max-w-xl mx-auto">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Activity className="w-6 h-6 text-yellow-400" />
            <h1 className="text-2xl font-bold">Activity Feed</h1>
          </div>
          <p className="text-zinc-500 text-sm">What everyone is watching and ranking</p>
        </header>

        <div className="space-y-2">
          {recent.map(m => (
            <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/40 border border-zinc-800">
              <div className="w-8 h-11 rounded overflow-hidden bg-zinc-800 shrink-0">
                {m.posterUrl
                  ? <img src={m.posterUrl} alt={m.title} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center"><Film className="w-3 h-3 text-zinc-600" /></div>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm">
                  <Link href={`/users/${m.user.username}`} className="text-yellow-400 hover:underline font-semibold">@{m.user.username}</Link>
                  {' '}added{' '}
                  <Link href={`/movies/${encodeURIComponent(m.title)}`} className="text-white hover:text-yellow-400 font-semibold">{m.title}</Link>
                </p>
                <p className="text-zinc-600 text-xs mt-0.5">{formatDistanceToNow(new Date(m.createdAt), { addSuffix: true })}</p>
              </div>
            </div>
          ))}

          {recent.length === 0 && (
            <div className="text-center py-20 text-zinc-600 border border-dashed border-zinc-800 rounded-2xl">
              <Activity className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No activity yet</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
