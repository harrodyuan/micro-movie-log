import { prisma } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Film, Star, UserPlus } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Props { params: Promise<{ username: string }> }

export default async function InvitePage({ params }: Props) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      movies: { orderBy: { elo: 'desc' }, take: 5, select: { title: true, posterUrl: true, elo: true } },
      _count: { select: { movies: true } },
    },
  });

  if (!user) notFound();

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-sm w-full text-center">
        {/* MIDB brand */}
        <div className="mb-6">
          <div className="text-yellow-400 font-black text-3xl tracking-tight mb-1">MIDB</div>
          <p className="text-zinc-500 text-sm">Movie Intelligence Database</p>
        </div>

        {/* Inviter */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
          <div className="w-14 h-14 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl font-black text-zinc-300 uppercase">{username[0]}</span>
          </div>
          <h2 className="text-lg font-bold text-white mb-1">@{username} invited you</h2>
          <p className="text-zinc-500 text-sm mb-4">
            They've ranked <span className="text-yellow-400 font-semibold">{user._count.movies} movies</span> — here's their top 5:
          </p>

          {/* Top 5 preview */}
          <div className="space-y-2 text-left">
            {user.movies.map((m, i) => (
              <div key={m.title} className="flex items-center gap-3">
                <span className="text-zinc-600 text-sm w-5">{i + 1}.</span>
                {m.posterUrl && (
                  <img src={m.posterUrl} alt={m.title} className="w-7 h-10 rounded object-cover" />
                )}
                <span className="text-zinc-300 text-sm flex-1 truncate">{m.title}</span>
                <span className="text-zinc-600 text-xs">{m.elo}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-zinc-400 text-sm mb-6">
          Battle movies head-to-head to build <em>your</em> personal ranked list. No stars, no reviews — just which one wins.
        </p>

        {/* CTA */}
        <Link
          href={`/auth/signin?callbackUrl=/add-movies&ref=${username}`}
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-yellow-400 text-black font-bold rounded-xl text-base hover:bg-yellow-300 transition-colors mb-3"
        >
          <UserPlus className="w-5 h-5" />
          Create your ranking
        </Link>

        <Link href="/" className="text-zinc-600 text-sm hover:text-white transition-colors">
          Browse without signing in →
        </Link>
      </div>
    </main>
  );
}
