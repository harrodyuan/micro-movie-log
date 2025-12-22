import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  // Fetch all users
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: { movies: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 text-white hover:text-neutral-300 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Users
          </h1>
          <p className="text-neutral-500 mt-2">{users.length} registered users</p>
        </header>

        {/* Users List */}
        <div className="space-y-4">
          {users.map(user => (
            <Link 
              key={user.id}
              href={`/${user.username}/log`}
              className="block p-4 border border-neutral-800 rounded-xl hover:border-white transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{user.username}</p>
                  {user.bio && (
                    <p className="text-sm text-neutral-500 mt-1">{user.bio}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-white">{user._count.movies} movies</p>
                  {user.walletAddress && (
                    <p className="text-xs text-neutral-600 mt-1">
                      {user.walletAddress.substring(0, 6)}...{user.walletAddress.substring(user.walletAddress.length - 4)}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}

          {users.length === 0 && (
            <div className="text-center py-12 text-neutral-500">
              No users yet. Be the first to connect your wallet!
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
