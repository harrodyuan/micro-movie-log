'use client';

import { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';

export function ShareCardButton({ username }: { username: string }) {
  const [state, setState] = useState<'idle' | 'copied'>('idle');

  const cardUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://micro-movie-log.vercel.app'}/api/og/${username}`;
  const profileUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://micro-movie-log.vercel.app'}/users/${username}`;

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `@${username}'s Top 10 Movies`,
          text: `Check out @${username}'s personal movie rankings on MIDB`,
          url: profileUrl,
        });
        return;
      } catch {}
    }
    // Fallback: copy card image URL
    await navigator.clipboard.writeText(cardUrl);
    setState('copied');
    setTimeout(() => setState('idle'), 2000);
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-xs font-semibold text-white transition-all"
    >
      {state === 'copied'
        ? <><Check className="w-3 h-3 text-green-400" /><span className="text-green-400">Copied!</span></>
        : <><Share2 className="w-3 h-3" />Share Top 10</>
      }
    </button>
  );
}
