import { cache } from 'react'
import { YouTubeChannel, YouTubeVideo } from "./youtube-service";

const API_KEYS = [
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_2,
].filter(Boolean) as string[];

const CHANNEL_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;

const FALLBACK_STATS: YouTubeChannel = {
  subscriberCount: "245000",
  viewCount: "12500000",
  videoCount: "156",
};

const FALLBACK_VIDEOS: YouTubeVideo[] = [
  {
    id: "dQw4w9WgXcQ",
    title: "Latest MotoGP Race Analysis 2024",
    description: "Análisis técnico profundo de la última carrera",
    thumbnail: "/motogp-race-moment---index-.jpg",
    publishedAt: "2024-11-13",
    viewCount: "125000",
    channelTitle: "PecinoGP",
  },
];

async function getData(
  baseUrl: string,
  cacheKey: string,
  fallbackData: any,
  revalidateTime: number = 3600
) {
  if (API_KEYS.length === 0 || !CHANNEL_ID) {
    console.warn(
      `YouTube API credentials not configured for ${cacheKey}, using fallback data.`
    );
    return fallbackData;
  }

  for (let i = 0; i < API_KEYS.length; i++) {
    const apiKey = API_KEYS[i];
    const url = `${baseUrl}&key=${apiKey}`;

    try {
      const response = await fetch(url, { next: { revalidate: revalidateTime } });

      if (response.ok) {
        console.log(`Successfully fetched ${cacheKey} with key #${i + 1}`);
        return await response.json();
      }

      if (response.status === 403) {
        console.warn(`API key #${i + 1} failed for ${cacheKey}. Trying next key.`);
        continue; // Try the next key
      }

      const errorBody = await response.text();
      console.error(
        `Error fetching ${cacheKey} with key #${i + 1}:`,
        response.status,
        response.statusText,
        errorBody
      );
      // For non-403 errors, we might not want to retry, but for simplicity, we'll continue
    } catch (error) {
      console.error(`Network error fetching ${cacheKey} with key #${i + 1}:`, error);
      // On network error, also try the next key
    }
  }

  console.error(
    `All API keys failed for ${cacheKey}. Returning fallback data.`
  );
  return fallbackData;
}

export const getChannelStats = cache(async (): Promise<YouTubeChannel> => {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}`;
  const data = await getData(url, "channelStats", { items: [FALLBACK_STATS] });

  if (!data.items || data.items.length === 0) {
    console.error("No channel data found in response, serving fallback.");
    return FALLBACK_STATS;
  }

  const channel = data.items[0];
  const stats = {
    subscriberCount: channel.statistics?.subscriberCount || "0",
    viewCount: channel.statistics?.viewCount || "0",
    videoCount: channel.statistics?.videoCount || "0",
  };

  console.log("Successfully fetched YouTube stats:", stats);
  return stats;
});

export const getLatestVideos = cache(async (
  maxResults: number = 6
): Promise<YouTubeVideo[]> => {
  const url = `https://www.googleapis.com/youtube/v3/search?channelId=${CHANNEL_ID}&part=snippet&order=date&maxResults=${maxResults}&type=video`;
  const data = await getData(url, "latestVideos", { items: [] });

  if (!data.items || data.items.length === 0) {
    console.warn("No videos found in response, serving fallback.");
    return FALLBACK_VIDEOS.slice(0, maxResults);
  }

  const videos = data.items.map((item: any) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail:
      item.snippet.thumbnails.high?.url ||
      item.snippet.thumbnails.default?.url ||
      "",
    publishedAt: item.snippet.publishedAt,
    viewCount: "0",
    channelTitle: item.snippet.channelTitle,
  }));

  console.log(`Successfully fetched ${videos.length} videos`);
  return videos;
});
