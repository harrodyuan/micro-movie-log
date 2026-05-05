import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

function parseUrl(url: string): { platform: 'youtube' | 'instagram'; videoId: string } | null {
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
      const id = u.pathname.slice(1);
      if (id) return { platform: 'youtube', videoId: id };
    }

    // Instagram Reel: instagram.com/reel/CODE or instagram.com/p/CODE
    const igMatch = u.pathname.match(/\/(reel|p)\/([A-Za-z0-9_-]+)/);
    if ((u.hostname.includes('instagram.com')) && igMatch) {
      return { platform: 'instagram', videoId: igMatch[2] };
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
    if (res.ok) {
      const data = await res.json();
      return data.title || 'YouTube Short';
    }
  } catch {}
  return 'YouTube Short';
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
  } else {
    title = 'Instagram Reel';
    channelTitle = 'Instagram';
    thumbnailUrl = `https://www.instagram.com/p/${parsed.videoId}/media/?size=l`;
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

  return NextResponse.json({ video });
}
