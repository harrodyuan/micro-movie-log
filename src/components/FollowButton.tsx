'use client';

import { useState, useEffect } from 'react';
import { UserPlus, UserCheck, Loader2 } from 'lucide-react';

interface Props {
  username: string;
  initialFollowers?: number;
}

export function FollowButton({ username, initialFollowers = 0 }: Props) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(initialFollowers);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [notAuthed, setNotAuthed] = useState(false);

  useEffect(() => {
    fetch(`/api/follow?username=${username}`)
      .then(r => r.json())
      .then(data => {
        setIsFollowing(data.isFollowing);
        setFollowers(data.followers);
      })
      .finally(() => setLoading(false));
  }, [username]);

  async function toggle() {
    if (toggling) return;
    setToggling(true);
    const method = isFollowing ? 'DELETE' : 'POST';
    const res = await fetch('/api/follow', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });
    if (res.status === 401) { setNotAuthed(true); setToggling(false); return; }
    if (res.ok) {
      setIsFollowing(f => !f);
      setFollowers(n => isFollowing ? n - 1 : n + 1);
    }
    setToggling(false);
  }

  if (loading) return <div className="w-24 h-8 rounded-lg bg-zinc-800 animate-pulse" />;

  if (notAuthed) return (
    <a href="/auth/signin" className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 text-black text-xs font-semibold rounded-lg hover:bg-yellow-400">
      Sign in to follow
    </a>
  );

  return (
    <button onClick={toggle} disabled={toggling}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
        isFollowing
          ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-red-950 hover:border-red-800 hover:text-red-400'
          : 'bg-yellow-400 border-yellow-400 text-black hover:bg-yellow-300'
      }`}>
      {toggling
        ? <Loader2 className="w-3 h-3 animate-spin" />
        : isFollowing
          ? <><UserCheck className="w-3 h-3" />Following ({followers})</>
          : <><UserPlus className="w-3 h-3" />Follow ({followers})</>
      }
    </button>
  );
}
