const API_KEYS = [
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_2,
].filter(Boolean) as string[];

const CHANNEL_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;

export interface YouTubeChannel {
  subscriberCount: string;
  viewCount: string;
  videoCount: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: string;
  channelTitle: string;
  error?: string;
}

export interface LiveStream {
  isLive: boolean;
  videoId?: string;
}

const FALLBACK_LIVE_STATUS: LiveStream = {
  isLive: false,
};

export async function getLiveStream(): Promise<LiveStream> {
  if (API_KEYS.length === 0 || !CHANNEL_ID) {
    console.warn(
      "YouTube API credentials not configured, using fallback data for live status"
    );
    return FALLBACK_LIVE_STATUS;
  }

  for (let i = 0; i < API_KEYS.length; i++) {
    const apiKey = API_KEYS[i];
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&key=${apiKey}`;

    try {
      const response = await fetch(url, { next: { revalidate: 60 } }); // Revalidate every minute

      if (response.ok) {
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          console.log(`Successfully fetched live status with key #${i + 1}`);
          return {
            isLive: true,
            videoId: data.items[0].id.videoId,
          };
        }
        console.log(`Successfully checked live status with key #${i + 1}: Not live.`);
        return { isLive: false };
      }

      if (response.status === 403) {
        console.warn(`API key #${i + 1} failed for live status. Trying next key.`);
        continue; // Try the next key
      }

      console.error(
        `Error fetching live stream status with key #${i + 1}:`,
        response.status,
        response.statusText
      );
    } catch (error) {
      console.error(`Network error fetching live stream status with key #${i + 1}:`, error);
    }
  }

  console.error("All API keys failed for live stream status. Returning fallback.");
  return FALLBACK_LIVE_STATUS;
}

export function getVideoUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function getVideoEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

export function formatNumber(num: string): string {
  const n = parseInt(num);
  if (n >= 1000000) {
    return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (n >= 1000) {
    return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return n.toString();
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
