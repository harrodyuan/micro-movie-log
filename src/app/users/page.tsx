import Link from 'next/link';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

const RANK_STYLES = [
  'text-yellow-400 font-black',
  'text-zinc-300 font-black',
  'text-amber-600 font-black',
];

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    include: {
      _count: { select: { movies: true } }
    },
  });

  // Sort: most movies first, then alphabetically for ties
  const sorted = users
    .filter(u => !u.username.startsWith('testuser') && u.username !== '0xc5c7...4279')
    .sort((a, b) => {
      if (b._count.movies !== a._count.movies) return b._count.movies - a._count.movies;
      return a.username.localeCompare(b.username);
    });

  const activeUsers  = sorted.filter(u => u._count.movies > 0);
  const inactiveUsers = sorted.filter(u => u._count.movies === 0);

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white mb-1">Members</h1>
          <p className="text-zinc-500 text-sm">{sorted.length} cinephiles ranked by collection size</p>
        </header>

        {/* Active users — have movies */}
        <div className="space-y-2 mb-8">
          {activeUsers.map((user, i) => (
            <Link
              key={user.id}
              href={`/users/${user.username}`}
              className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800 hover:border-zinc-500 hover:bg-zinc-900/40 transition-all group"
            >
              {/* Rank */}
              <span className={`w-8 text-center text-sm shrink-0 ${RANK_STYLES[i] ?? 'text-zinc-600 font-semibold'}`}>
                {i < 3 ? ['🥇','🥈','🥉'][i] : `#${i + 1}`}
              </span>

              {/* Avatar placeholder */}
              <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-zinc-400 uppercase">{user.username[0]}</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold group-hover:text-yellow-400 transition-colors truncate">
                  {user.username}
                </p>
                {user.bio && (
                  <p className="text-xs text-zinc-500 truncate mt-0.5">{user.bio}</p>
                )}
              </div>

              {/* Movie count */}
              <div className="text-right shrink-0">
                <p className="text-white font-bold">{user._count.movies.toLocaleString()}</p>
                <p className="text-xs text-zinc-600">movies</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Inactive users — no movies yet */}
        {inactiveUsers.length > 0 && (
          <>
            <p className="text-xs text-zinc-700 uppercase tracking-widest font-semibold mb-3 px-1">
              New members
            </p>
            <div className="space-y-1">
              {inactiveUsers.map(user => (
                <Link
                  key={user.id}
                  href={`/users/${user.username}`}
                  className="flex items-center gap-4 p-3 rounded-xl border border-zinc-900 hover:border-zinc-700 transition-all group"
                >
                  <div className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-zinc-600 uppercase">{user.username[0]}</span>
                  </div>
                  <p className="text-zinc-500 text-sm group-hover:text-zinc-300 transition-colors flex-1 truncate">
                    {user.username}
                  </p>
                  <p className="text-xs text-zinc-700">no movies yet</p>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
