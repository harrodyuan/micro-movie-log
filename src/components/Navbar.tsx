'use client';

import Link from 'next/link';
import { ConnectWallet } from './ConnectWallet';

export function Navbar() {
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
            Home
          </Link>
          <Link href="/editors" className="text-sm text-white hover:text-neutral-300 transition-colors">
            Editors
          </Link>
          <Link href="/users" className="text-sm text-white hover:text-neutral-300 transition-colors">
            Users
          </Link>
        </div>

        {/* Right - Auth */}
        <div className="flex items-center gap-3">
          <ConnectWallet />
        </div>
      </div>
    </nav>
  );
}
