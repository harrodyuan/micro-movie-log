const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideo {
  id: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  duration?: string;
}

export async function searchShorts(query: string = 'shorts', maxResults: number = 20): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY) {
    throw new Error('YOUTUBE_API_KEY is not configured');
  }

  const searchParams = new URLSearchParams({
    part: 'snippet',
    q: query + ' #shorts',
    type: 'video',
    videoDuration: 'short',
    maxResults: maxResults.toString(),
    key: YOUTUBE_API_KEY,
  });

  const response = await fetch(`${YOUTUBE_API_BASE}/search?${searchParams}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`YouTube API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  
  return data.items.map((item: any) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    channelTitle: item.snippet.channelTitle,
    thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
  }));
}

export async function getPopularShorts(maxResults: number = 20): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY) {
    throw new Error('YOUTUBE_API_KEY is not configured');
  }

  const searchParams = new URLSearchParams({
    part: 'snippet',
    chart: 'mostPopular',
    videoCategoryId: '0',
    maxResults: maxResults.toString(),
    key: YOUTUBE_API_KEY,
  });

  const response = await fetch(`${YOUTUBE_API_BASE}/videos?${searchParams}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`YouTube API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  
  return data.items
    .filter((item: any) => {
      // Filter for shorts (typically under 60 seconds, vertical format)
      return true; // We'll filter by duration if needed
    })
    .map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
    }));
}

export function getEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

export function getShortsUrl(videoId: string): string {
  return `https://www.youtube.com/shorts/${videoId}`;
}
