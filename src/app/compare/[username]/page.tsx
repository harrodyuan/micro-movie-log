import { prisma } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ArrowLeft, Heart, Zap } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Props { params: Promise<{ username: string }> }

export default async function ComparePage({ params }: Props) {
  const { username } = await params;
  const session = await getServerSession(authOptions);

  const them = await prisma.user.findUnique({
    where: { username },
    include: { movies: { orderBy: { elo: 'desc' }, take: 20 } },
  });
  if (!them) notFound();

  // If logged in, compare with self — else use global top user
  let myUsername = session?.user?.username || session?.user?.name || null;
  let me = myUsername ? await prisma.user.findUnique({
    where: { username: myUsername },
    include: { movies: { orderBy: { elo: 'desc' }, take: 20 } },
  }) : null;

  const myTitles   = new Set((me?.movies || []).map(m => m.title.toLowerCase()));
  const theirTitles = new Set(them.movies.map(m => m.title.toLowerCase()));

  const both = them.movies.filter(m => myTitles.has(m.title.toLowerCase()));
  const onlyThem = them.movies.filter(m => !myTitles.has(m.title.toLowerCase()));
  const onlyMe  = (me?.movies || []).filter(m => !theirTitles.has(m.title.toLowerCase())).slice(0, 10);

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 font-sans pt-20">
      <div className="max-w-2xl mx-auto">
        <Link href={`/users/${username}`} className="flex items-center gap-1.5 text-zinc-500 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> @{username}'s profile
        </Link>

        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold mb-1">
            {me ? `@${myUsername}` : 'You'} vs @{username}
          </h1>
          <p className="text-zinc-500 text-sm">
            {both.length} movies in common · {onlyThem.length} only they've ranked
          </p>
        </header>

        {/* Both love */}
        {both.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-4 h-4 text-pink-400" />
              <h2 className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">You both ranked these</h2>
            </div>
            <div className="space-y-2">
              {both.map(m => {
                const mine = me?.movies.find(x => x.title.toLowerCase() === m.title.toLowerCase());
                return (
                  <div key={m.title} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/40 border border-zinc-800">
                    {m.posterUrl && <img src={m.posterUrl} alt={m.title} className="w-8 h-11 rounded object-cover shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <Link href={`/movies/${encodeURIComponent(m.title)}`} className="text-white text-sm font-semibold hover:text-yellow-400 truncate block">{m.title}</Link>
                    </div>
                    <div className="flex gap-3 text-xs shrink-0">
                      {mine && <span className="text-yellow-400 font-mono">{mine.elo}</span>}
                      <span className="text-zinc-500">vs</span>
                      <span className="text-blue-400 font-mono">{m.elo}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Only them */}
        {onlyThem.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-blue-400" />
              <h2 className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">@{username} has ranked — you haven't</h2>
              <Link href="/add-movies" className="ml-auto text-xs text-yellow-400 hover:underline">+ Add some</Link>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {onlyThem.slice(0, 8).map(m => (
                <Link key={m.title} href={`/movies/${encodeURIComponent(m.title)}`} className="group">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 group-hover:border-yellow-400/50 transition-colors">
                    {m.posterUrl
                      ? <img src={m.posterUrl} alt={m.title} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs text-center p-1">{m.title}</div>}
                  </div>
                  <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{m.title}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {!me && (
          <div className="text-center py-8 border border-dashed border-zinc-800 rounded-xl">
            <p className="text-zinc-500 text-sm mb-3">Sign in to see how your rankings compare</p>
            <Link href="/auth/signin" className="px-4 py-2 bg-yellow-500 text-black text-sm font-semibold rounded-lg hover:bg-yellow-400">
              Sign in
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
