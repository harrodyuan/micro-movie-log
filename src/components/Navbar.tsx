'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/',              label: 'Battle' },
  { href: '/rankings',      label: 'Rankings' },
  { href: '/lists',         label: 'Lists' },
  { href: '/users',         label: 'Users' },
  { href: '/shorts-battle', label: 'Shorts', yellow: true },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const [legacyUser, setLegacyUser] = useState<{ username: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) { try { setLegacyUser(JSON.parse(stored)); } catch {} }
  }, []);

  const user = session?.user || legacyUser;
  const username = session?.user?.username || session?.user?.name || legacyUser?.username;
  const isLoading = status === 'loading';

  function handleSignOut() {
    signOut({ callbackUrl: '/' });
    localStorage.removeItem('user');
    setLegacyUser(null);
    setMenuOpen(false);
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-neutral-900">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-lg font-bold text-white hover:text-neutral-300 transition-colors">
            MIDB
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href}
                className={`text-sm transition-colors ${l.yellow ? 'text-yellow-400 hover:text-yellow-300' : 'text-white hover:text-neutral-300'}`}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {isLoading ? null : user ? (
              <>
                <Link href="/add-movies" className="flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-lg transition-colors">
                  + Add Movies
                </Link>
                <Link href={`/users/${username}`} className="text-sm text-white hover:text-yellow-400 transition-colors">{username}</Link>
                <button onClick={handleSignOut} className="text-sm text-zinc-500 hover:text-white transition-colors">Sign Out</button>
              </>
            ) : (
              <Link href="/auth/signin" className="px-4 py-2 bg-yellow-500 text-black text-sm font-semibold rounded-lg hover:bg-yellow-400 transition-colors">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile: auth shortcut + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            {!isLoading && !user && (
              <Link href="/auth/signin" className="px-3 py-1.5 bg-yellow-500 text-black text-xs font-semibold rounded-lg">
                Sign In
              </Link>
            )}
            {!isLoading && user && (
              <Link href="/add-movies" className="px-3 py-1.5 bg-zinc-800 text-white text-xs font-semibold rounded-lg">
                + Add
              </Link>
            )}
            <button onClick={() => setMenuOpen(o => !o)} className="p-2 text-white">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile slide-down menu */}
      {menuOpen && (
        <div className="fixed top-14 left-0 right-0 z-40 bg-black border-b border-zinc-800 md:hidden">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                className={`block py-3 text-base font-medium border-b border-zinc-900 ${l.yellow ? 'text-yellow-400' : 'text-white'}`}>
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href={`/users/${username}`} onClick={() => setMenuOpen(false)}
                  className="block py-3 text-base text-zinc-300 border-b border-zinc-900">
                  My Profile (@{username})
                </Link>
                <button onClick={handleSignOut} className="block w-full text-left py-3 text-base text-zinc-500">
                  Sign Out
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
