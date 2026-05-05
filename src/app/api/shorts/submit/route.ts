import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

type Platform = 'youtube' | 'instagram' | 'tiktok';

function parseUrl(url: string): { platform: Platform; videoId: string } | null {
  try {
    const u = new URL(url.trim());

    // YouTube Shorts: youtube.com/shorts/ID
    const shortsMatch = u.pathname.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
    if (shortsMatch) return { platform: 'youtube', videoId: shortsMatch[1] };

    // YouTube watch: youtube.com/watch?v=ID or youtu.be/ID
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v');
      if (v) return { platform: 'youtube', videoId: v };
    }
    if (u.hostname === 'youtu.be') {
      const id = u.pathname.slice(1).split('?')[0];
      if (id) return { platform: 'youtube', videoId: id };
    }

    // Instagram Reel: instagram.com/reel/CODE or instagram.com/p/CODE
    const igMatch = u.pathname.match(/\/(reel|p)\/([A-Za-z0-9_-]+)/);
    if (u.hostname.includes('instagram.com') && igMatch) {
      return { platform: 'instagram', videoId: igMatch[2] };
    }

    // TikTok: tiktok.com/@user/video/VIDEO_ID or vm.tiktok.com/CODE
    if (u.hostname.includes('tiktok.com')) {
      const ttMatch = u.pathname.match(/\/video\/(\d+)/);
      if (ttMatch) return { platform: 'tiktok', videoId: ttMatch[1] };
      // vm.tiktok.com short link — use the path code as ID
      if (u.hostname === 'vm.tiktok.com') {
        const code = u.pathname.slice(1).replace(/\/$/, '');
        if (code) return { platform: 'tiktok', videoId: code };
      }
    }

    return null;
  } catch {
    return null;
  }
}

async function fetchYouTubeTitle(videoId: string): Promise<string> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
    if (res.ok) return (await res.json()).title || 'YouTube Short';
  } catch {}
  return 'YouTube Short';
}

async function fetchTikTokTitle(videoUrl: string): Promise<{ title: string; author: string }> {
  try {
    const res = await fetch(
      `https://www.tiktok.com/oembed?url=${encodeURIComponent(videoUrl)}`
    );
    if (res.ok) {
      const d = await res.json();
      return { title: d.title || 'TikTok Video', author: d.author_name || 'TikTok' };
    }
  } catch {}
  return { title: 'TikTok Video', author: 'TikTok' };
}

export async function POST(request: NextRequest) {
  const { url, submittedBy } = await request.json();
  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });

  const parsed = parseUrl(url);
  if (!parsed) {
    return NextResponse.json(
      { error: 'Paste a YouTube Shorts or Instagram Reel URL' },
      { status: 400 }
    );
  }

  // Check duplicate
  const existing = await prisma.video.findUnique({ where: { youtubeId: parsed.videoId } });
  if (existing) return NextResponse.json({ error: 'Already in the battle pool!', video: existing }, { status: 409 });

  let title = 'Short';
  let channelTitle = 'Unknown';
  let thumbnailUrl = '';

  if (parsed.platform === 'youtube') {
    title = await fetchYouTubeTitle(parsed.videoId);
    channelTitle = 'YouTube';
    thumbnailUrl = `https://i.ytimg.com/vi/${parsed.videoId}/hqdefault.jpg`;
  } else if (parsed.platform === 'instagram') {
    title = 'Instagram Reel';
    channelTitle = 'Instagram';
    thumbnailUrl = `https://www.instagram.com/p/${parsed.videoId}/media/?size=l`;
  } else {
    // TikTok
    const fullUrl = `https://www.tiktok.com/video/${parsed.videoId}`;
    const tt = await fetchTikTokTitle(url.trim());
    title = tt.title;
    channelTitle = tt.author;
    thumbnailUrl = `https://www.tiktok.com/api/img/?itemId=${parsed.videoId}&location=1`;
  }

  const video = await prisma.video.create({
    data: {
      youtubeId: parsed.videoId,
      title,
      channelTitle,
      thumbnailUrl,
      platform: parsed.platform,
      sourceUrl: url.trim(),
      submittedBy: submittedBy || null,
    },
  });

  return NextResponse.json({ video, platform: parsed.platform });
}
