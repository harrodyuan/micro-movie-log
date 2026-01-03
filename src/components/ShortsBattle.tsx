'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getVideoBattlePair, submitVideoVote, getVideoLeaderboard } from '@/app/shorts-battle/actions';

interface Video {
  id: string;
  youtubeId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  elo: number;
  matches: number;
}

type PlayState = 'loading' | 'playing-left' | 'playing-right' | 'ready-to-vote';

export default function ShortsBattle() {
  const [videoA, setVideoA] = useState<Video | null>(null);
  const [videoB, setVideoB] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [leaderboard, setLeaderboard] = useState<Video[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [visitorId, setVisitorId] = useState<string>('');
  const [playState, setPlayState] = useState<PlayState>('loading');
  const playerARef = useRef<YT.Player | null>(null);
  const playerBRef = useRef<YT.Player | null>(null);
  const [apiReady, setApiReady] = useState(false);

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setApiReady(true);
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    (window as any).onYouTubeIframeAPIReady = () => {
      setApiReady(true);
    };
  }, []);

  useEffect(() => {
    let id = localStorage.getItem('video_battle_visitor_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('video_battle_visitor_id', id);
    }
    setVisitorId(id);
    loadBattlePair();
  }, []);

  // Initialize players when videos change and API is ready
  useEffect(() => {
    if (!apiReady || !videoA || !videoB) return;

    // Clean up old players
    playerARef.current?.destroy();
    playerBRef.current?.destroy();

    setPlayState('playing-left');

    // Create player A (auto-plays first)
    playerARef.current = new YT.Player('player-a', {
      videoId: videoA.youtubeId,
      playerVars: {
        autoplay: 1,
        controls: 1,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
      },
      events: {
        onStateChange: (event: YT.OnStateChangeEvent) => {
          if (event.data === YT.PlayerState.ENDED) {
            setPlayState('playing-right');
            playerBRef.current?.playVideo();
          }
        },
      },
    });

    // Create player B (plays after A ends)
    playerBRef.current = new YT.Player('player-b', {
      videoId: videoB.youtubeId,
      playerVars: {
        autoplay: 0,
        controls: 1,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
      },
      events: {
        onStateChange: (event: YT.OnStateChangeEvent) => {
          if (event.data === YT.PlayerState.ENDED) {
            setPlayState('ready-to-vote');
          }
        },
      },
    });

    return () => {
      playerARef.current?.destroy();
      playerBRef.current?.destroy();
    };
  }, [apiReady, videoA?.youtubeId, videoB?.youtubeId]);

  async function loadBattlePair() {
    setLoading(true);
    setPlayState('loading');
    try {
      const pair = await getVideoBattlePair();
      if (pair) {
        setVideoA(pair.videoA);
        setVideoB(pair.videoB);
      }
    } catch (error) {
      console.error('Failed to load battle pair:', error);
    }
    setLoading(false);
  }

  async function handleVote(winnerId: string) {
    if (!videoA || !videoB || voting) return;
    
    setVoting(true);
    try {
      await submitVideoVote(visitorId, videoA.id, videoB.id, winnerId);
      await loadBattlePair();
    } catch (error) {
      console.error('Failed to submit vote:', error);
    }
    setVoting(false);
  }

  async function loadLeaderboard() {
    const lb = await getVideoLeaderboard(10);
    setLeaderboard(lb);
    setShowLeaderboard(true);
  }

  function getStatusText() {
    switch (playState) {
      case 'loading': return 'Loading...';
      case 'playing-left': return '▶ Now Playing: LEFT';
      case 'playing-right': return '▶ Now Playing: RIGHT';
      case 'ready-to-vote': return '✓ Both watched! Click your favorite';
      default: return '';
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-white text-xl">Loading videos...</div>
      </div>
    );
  }

  if (!videoA || !videoB) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-white text-xl">No videos available. Add some shorts first!</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Status indicator */}
      <div className={`text-center mb-4 py-2 px-4 rounded-full inline-block mx-auto w-full ${
        playState === 'ready-to-vote' ? 'bg-green-600/20 text-green-400' : 'bg-yellow-600/20 text-yellow-400'
      }`}>
        <span className="font-semibold">{getStatusText()}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Video A */}
        <div 
          onClick={() => handleVote(videoA.id)}
          className={`bg-zinc-900 rounded-xl overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-yellow-400 ${
            voting ? 'opacity-50 pointer-events-none' : ''
          } ${playState === 'playing-left' ? 'ring-2 ring-yellow-400' : ''}`}
        >
          <div className="aspect-[9/16] relative bg-black">
            <div id="player-a" className="w-full h-full" />
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-1">
              {playState === 'playing-left' && <span className="text-yellow-400 animate-pulse">▶</span>}
              <h3 className="text-white font-semibold line-clamp-2">{videoA.title}</h3>
            </div>
            <p className="text-zinc-400 text-sm">{videoA.channelTitle}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
              <span>Elo: {videoA.elo}</span>
              <span>Matches: {videoA.matches}</span>
            </div>
          </div>
        </div>

        {/* Video B */}
        <div 
          onClick={() => handleVote(videoB.id)}
          className={`bg-zinc-900 rounded-xl overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-yellow-400 ${
            voting ? 'opacity-50 pointer-events-none' : ''
          } ${playState === 'playing-right' ? 'ring-2 ring-yellow-400' : ''}`}
        >
          <div className="aspect-[9/16] relative bg-black">
            <div id="player-b" className="w-full h-full" />
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-1">
              {playState === 'playing-right' && <span className="text-yellow-400 animate-pulse">▶</span>}
              <h3 className="text-white font-semibold line-clamp-2">{videoB.title}</h3>
            </div>
            <p className="text-zinc-400 text-sm">{videoB.channelTitle}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
              <span>Elo: {videoB.elo}</span>
              <span>Matches: {videoB.matches}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <button
          onClick={loadBattlePair}
          disabled={voting}
          className="px-6 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-50"
        >
          Skip
        </button>
        <button
          onClick={loadLeaderboard}
          className="px-6 py-2 bg-yellow-600 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
        >
          View Leaderboard
        </button>
      </div>

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Video Leaderboard</h3>
              <button 
                onClick={() => setShowLeaderboard(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {leaderboard.map((video, index) => (
                <div 
                  key={video.id}
                  className="flex items-center gap-3 py-3 border-b border-zinc-800 last:border-0"
                >
                  <span className={`text-lg font-bold w-8 ${index < 3 ? 'text-yellow-400' : 'text-zinc-500'}`}>
                    #{index + 1}
                  </span>
                  <img 
                    src={video.thumbnailUrl} 
                    alt={video.title}
                    className="w-16 h-9 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm line-clamp-1">{video.title}</p>
                    <p className="text-zinc-500 text-xs">{video.channelTitle}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-400 font-semibold">{video.elo}</p>
                    <p className="text-zinc-500 text-xs">{video.matches} matches</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
