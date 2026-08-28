import "server-only";
import { cache } from "react";
export type {
  YouTubeChannel,
  YouTubeVideo,
  LiveStream,
} from "./youtube-service";
import {
  YouTubeChannel,
  YouTubeVideo,
  LiveStream,
  getLiveStream as getLiveStreamService,
} from "./youtube-service";

const KEYS = [
  process.env["YOUTUBE_API_KEY"] ?? process.env["NEXT_PUBLIC_YOUTUBE_API_KEY"],
  process.env["YOUTUBE_API_KEY_2"] ?? process.env["NEXT_PUBLIC_YOUTUBE_API_KEY_2"],
].filter((k): k is string => !!k && k.length > 10);

console.log(`[CONFIG] Número de API Keys detectadas: ${KEYS.length}`);
if (KEYS.length > 1) {
  console.log(`[CONFIG] Key 2 empieza por: ${KEYS[1]?.substring(0, 5)}...`);
}

const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID ?? process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;

const FALLBACK_STATS: YouTubeChannel = {
  subscriberCount: "67900",
  viewCount: "18458740",
  videoCount: "1204",
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

async function fetchWithRotation(
  baseUrl: string,
  cacheKey: string,
  revalidateTime: number,
) {
  let lastError: any = new Error(`No API keys available for ${cacheKey}`);

  if (KEYS.length === 0) {
    throw lastError;
  }

  for (let i = 0; i < KEYS.length; i++) {
    const apiKey = KEYS[i];
    const url = `${baseUrl}&key=${apiKey}`;

    try {
      console.log(
        `[YouTube API] Intentando con Key #${i + 1} (${apiKey.substring(0, 4)}...) para ${cacheKey}`,
      );

      const res = await fetch(url, { next: { revalidate: revalidateTime } });

      if (res.ok) {
        return await res.json();
      }

      if (res.status === 403) {
        const errorData = await res.json();
        const message =
          errorData.error?.message || "Quota Exceeded or Access Denied";
        console.error(
          `[YouTube API] Key #${i + 1} para ${cacheKey} falló (403):`,
          message,
        );
        throw new Error("QUOTA_EXCEEDED");
      }

      throw new Error(`HTTP error ${res.status}`);
    } catch (err) {
      lastError = err;
      console.warn(
        `[YouTube API] Error con Key #${i + 1} para ${cacheKey}. Saltando a la siguiente...`,
      );
      continue;
    }
  }

  console.error(`[YouTube API] Todas las claves para ${cacheKey} fallaron.`);
  throw lastError;
}

async function getData(
  baseUrl: string,
  cacheKey: string,
  fallbackData: any,
  revalidateTime: number = 3600,
) {
  if (!CHANNEL_ID) {
    console.warn(
      `YouTube Channel ID not configured for ${cacheKey}, using fallback data.`,
    );
    return fallbackData;
  }

  try {
    return await fetchWithRotation(baseUrl, cacheKey, revalidateTime);
  } catch (error) {
    console.error(
      `Error final al obtener datos de YouTube para ${cacheKey}:`,
      error,
    );
    return fallbackData;
  }
}

export const getLiveStream = cache(async (): Promise<LiveStream> => {
  return await getLiveStreamService();
});

export const getChannelStats = cache(async (): Promise<YouTubeChannel> => {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}`;
  const data = await getData(url, "channelStats", { items: [] });

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

const getUploadsPlaylistId = (channelId: string) => {
  if (!channelId.startsWith("UC")) {
    console.warn(
      "Channel ID does not start with 'UC'. Playlist ID conversion might be incorrect.",
    );
    // Return a default or transformed ID for safety, though it might not work.
    return `UU${channelId.substring(2)}`;
  }
  return channelId.replace("UC", "UU");
};

export const getLatestVideos = cache(
  async (maxResults: number = 6): Promise<YouTubeVideo[]> => {
    // Convert Channel ID to Uploads Playlist ID
    const playlistId = getUploadsPlaylistId(CHANNEL_ID!);
    // Fetch more videos initially because some might be filtered out (Shorts)
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${playlistId}&part=snippet&maxResults=15`;

    const data = await getData(url, "latestVideos", { items: [] });

    if (!data.items || data.items.length === 0) {
      console.warn("No videos found in response, serving fallback.");
      return FALLBACK_VIDEOS.slice(0, maxResults);
    }

    // Algunos items de la playlist pueden venir sin snippet/resourceId
    // (vídeos privados o borrados): los filtramos para no romper el build.
    const videoIds = data.items
      .map((item: any) => item?.snippet?.resourceId?.videoId)
      .filter(
        (id: any): id is string => typeof id === "string" && id.length > 0,
      );

    if (videoIds.length === 0) {
      console.warn("No valid video IDs in playlist, serving fallback.");
      return FALLBACK_VIDEOS.slice(0, maxResults);
    }

    // Fetch video details (duration) to filter shorts
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoIds.join(",")}&part=contentDetails,snippet,statistics,liveStreamingDetails`;
    const detailsData = await getData(
      detailsUrl,
      `videoDetails-${videoIds.join("-")}`,
      { items: [] },
    );

    if (!detailsData.items) return FALLBACK_VIDEOS.slice(0, maxResults);

    // YouTube duration format is ISO 8601 (PT1M20S)
    // Shorts are typically under 61 seconds
    const filteredVideos = detailsData.items
      .filter((item: any) => {
        const duration = item.contentDetails?.duration;
        if (!duration) return true; // sin datos de duración → conservar
        // Parse ISO 8601 duration
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!match) return true;
        const hours = parseInt(match[1] || "0");
        const minutes = parseInt(match[2] || "0");
        const seconds = parseInt(match[3] || "0");
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;

        // Exclude videos shorter than 2 minutes (120 seconds) as requested
        // This ensures Shorts and very short clips are filtered out.
        return totalSeconds > 120;
      })
      .filter((item: any) => item?.snippet)
      .map((item: any) => ({
        id: item.id,
        title: item.snippet.title ?? "",
        description: item.snippet.description ?? "",
        thumbnail:
          item.snippet.thumbnails?.maxres?.url ||
          item.snippet.thumbnails?.high?.url ||
          item.snippet.thumbnails?.default?.url ||
          "",
        publishedAt: item.snippet.publishedAt ?? "",
        viewCount: item.statistics?.viewCount || "0",
        channelTitle: item.snippet.channelTitle ?? "",
        isLive:
          !!item.liveStreamingDetails ||
          item.snippet.liveBroadcastContent !== "none",
      }))
      .slice(0, maxResults);

    console.log(
      `Successfully fetched ${filteredVideos.length} non-short videos`,
    );
    return filteredVideos;
  },
);

export const getVideosByIds = cache(
  async (videoIds: string[]): Promise<YouTubeVideo[]> => {
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoIds.join(
      ",",
    )}&part=snippet,statistics,liveStreamingDetails`;

    const data = await getData(url, `videosByIds-${videoIds.join("-")}`, {
      items: [],
    });

    if (!data.items || data.items.length === 0) {
      console.warn(`No videos found for IDs: ${videoIds.join(",")}`);
      return FALLBACK_VIDEOS.slice(0, videoIds.length);
    }

    const videos = data.items
      .filter((item: any) => item?.snippet)
      .map((item: any) => ({
        id: item.id,
        title: item.snippet.title ?? "",
        description: item.snippet.description ?? "",
        thumbnail:
          item.snippet.thumbnails?.high?.url ||
          item.snippet.thumbnails?.default?.url ||
          "",
        publishedAt: item.snippet.publishedAt ?? "",
        viewCount: item.statistics?.viewCount || "0",
        channelTitle: item.snippet.channelTitle ?? "",
        isLive:
          !!item.liveStreamingDetails ||
          item.snippet.liveBroadcastContent !== "none",
      }));

    console.log(`Successfully fetched ${videos.length} videos by ID.`);
    return videos;
  },
);
