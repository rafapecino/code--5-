const KEYS = [
  process.env['NEXT_PUBLIC_YOUTUBE_API_KEY'],
  process.env['NEXT_PUBLIC_YOUTUBE_API_KEY_2']
].filter((k): k is string => !!k && k.length > 10);

console.log(`[CONFIG] Número de API Keys detectadas: ${KEYS.length}`);
if (KEYS.length > 1) {
  console.log(`[CONFIG] Key 2 empieza por: ${KEYS[1]?.substring(0, 5)}...`);
}

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

async function fetchWithRotation(baseUrl: string) {
  let lastError: any = new Error("No API keys provided.");

  if (KEYS.length === 0) {
    throw lastError;
  }

  for (let i = 0; i < KEYS.length; i++) {
    const apiKey = KEYS[i];
    const url = `${baseUrl}&key=${apiKey}`;

    try {
      console.log(`[YouTube API] Intentando con Key #${i + 1} (${apiKey.substring(0, 4)}...)`);
      
      const res = await fetch(url, { next: { revalidate: 60 } });

      if (res.ok) {
        return await res.json();
      }
      
      if (res.status === 403) {
        const errorData = await res.json();
        const message = errorData.error?.message || 'Quota Exceeded or Access Denied';
        console.error(`[YouTube API] Key #${i + 1} falló (403):`, message);
        throw new Error('QUOTA_EXCEEDED');
      }
      
      throw new Error(`HTTP error ${res.status}`);

    } catch (err) {
      lastError = err;
      console.warn(`[YouTube API] Error con Key #${i + 1}. Saltando a la siguiente...`);
      continue;
    }
  }

  console.error('[YouTube API] Todas las claves fallaron.');
  throw lastError;
}

export async function getLiveStream(): Promise<LiveStream> {
  if (!CHANNEL_ID) {
    console.warn(
      "YouTube Channel ID not configured, using fallback data for live status"
    );
    return FALLBACK_LIVE_STATUS;
  }
  
  const baseUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video`;

  try {
    const data = await fetchWithRotation(baseUrl);

    if (data.items && data.items.length > 0) {
      return {
        isLive: true,
        videoId: data.items[0].id.videoId,
      };
    }

    return { isLive: false };
  } catch (error) {
    console.error("Error final al obtener el estado en vivo de YouTube:", error);
    return FALLBACK_LIVE_STATUS;
  }
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
