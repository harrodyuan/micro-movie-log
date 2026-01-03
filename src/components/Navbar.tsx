'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';

export function Navbar() {
  const { data: session, status } = useSession();
  const [legacyUser, setLegacyUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    // Check for legacy localStorage user (MetaMask)
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setLegacyUser(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const user = session?.user || legacyUser;
  const isLoading = status === 'loading';

  function handleSignOut() {
    signOut({ callbackUrl: '/' });
    localStorage.removeItem('user');
    setLegacyUser(null);
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-neutral-900">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left - Logo */}
        <Link href="/" className="text-lg font-bold text-white hover:text-neutral-300 transition-colors">
          MIDB
        </Link>

        {/* Center - Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm text-white hover:text-neutral-300 transition-colors">
            Battle
          </Link>
          <Link href="/rankings" className="text-sm text-white hover:text-neutral-300 transition-colors">
            Rankings
          </Link>
          <Link href="/lists" className="text-sm text-white hover:text-neutral-300 transition-colors">
            Lists
          </Link>
          <Link href="/users" className="text-sm text-white hover:text-neutral-300 transition-colors">
            Users
          </Link>
          <Link href="/shorts-battle" className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors">
            Shorts
          </Link>
        </div>

        {/* Right - Auth */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="text-sm text-zinc-500">Loading...</div>
          ) : user ? (
            <div className="flex items-center gap-3">
              {session?.user?.image && (
                <img 
                  src={session.user.image} 
                  alt="" 
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-sm text-white">
                {session?.user?.username || session?.user?.name || legacyUser?.username}
              </span>
              <button
                onClick={handleSignOut}
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="px-4 py-2 bg-yellow-500 text-black text-sm font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
