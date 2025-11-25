import { promises as fs } from "fs"
import path from "path"
import { YouTubeChannel, YouTubeVideo } from "./youtube-service"

const CACHE_FILE = path.join(process.cwd(), ".youtube-cache.json")

interface CacheData {
  timestamp: number
  data: any
}

async function readCache(): Promise<CacheData | null> {
  try {
    const content = await fs.readFile(CACHE_FILE, "utf-8")
    return JSON.parse(content)
  } catch (error) {
    return null
  }
}

async function writeCache(data: any): Promise<void> {
  const cacheData: CacheData = {
    timestamp: Date.now(),
    data,
  }
  await fs.writeFile(CACHE_FILE, JSON.stringify(cacheData, null, 2))
}

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
const CHANNEL_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID

const FALLBACK_STATS: YouTubeChannel = {
  subscriberCount: "245000",
  viewCount: "12500000",
  videoCount: "156",
}

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
]

async function getData(
  url: string,
  cacheKey: string,
  fallbackData: any,
  revalidateTime: number = 3600,
) {
  try {
    if (!YOUTUBE_API_KEY || !CHANNEL_ID) {
      console.warn("YouTube API credentials not configured, using fallback data")
      return { data: fallbackData, revalidate: revalidateTime }
    }

    const response = await fetch(url, { next: { revalidate: revalidateTime } })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error(
        `Error fetching ${cacheKey}:`,
        response.status,
        response.statusText,
        errorBody,
      )

      const cached = await readCache()
      const cachedData = cached?.data?.[cacheKey]

      if (response.status === 403) {
        console.warn("YouTube API quota likely exceeded. Serving from cache.")
        if (cachedData) {
          console.log("Serving stale data from cache.")
          return { data: cachedData, revalidate: 172800 }
        }
        console.warn("Cache is empty. Serving fallback data.")
        return { data: fallbackData, revalidate: 172800 }
      }

      if (cachedData) {
        console.log(
          "Serving stale data from cache due to non-403 API error.",
        )
        return { data: cachedData, revalidate: revalidateTime }
      }

      console.warn("Cache is empty. Serving fallback data.")
      return { data: fallbackData, revalidate: revalidateTime }
    }

    const data = await response.json()
    const currentCache = (await readCache()) || { data: {} }
    const updatedCache = {
      ...currentCache.data,
      [cacheKey]: data,
    }
    await writeCache(updatedCache)

    return { data, revalidate: revalidateTime }
  } catch (error) {
    console.error(`Error fetching ${cacheKey}:`, error)
    const cached = await readCache()
    const cachedData = cached?.data?.[cacheKey]
    if (cachedData) {
      console.log("Serving stale data from cache due to fetch error.")
      return { data: cachedData, revalidate: revalidateTime }
    }
    console.warn("Cache is empty. Serving fallback data.")
    return { data: fallbackData, revalidate: revalidateTime }
  }
}

export async function getChannelStats(): Promise<YouTubeChannel> {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${YOUTUBE_API_KEY}`
  const { data } = await getData(url, "channelStats", { items: [FALLBACK_STATS] })

  if (!data.items || data.items.length === 0) {
    console.error("No channel data found in response")
    return FALLBACK_STATS
  }

  const channel = data.items[0]
  const stats = {
    subscriberCount: channel.statistics?.subscriberCount || "0",
    viewCount: channel.statistics?.viewCount || "0",
    videoCount: channel.statistics?.videoCount || "0",
  }

  console.log("Successfully fetched YouTube stats:", stats)
  return stats
}

export async function getLatestVideos(
  maxResults: number = 6,
): Promise<YouTubeVideo[]> {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=date&maxResults=${maxResults}&type=video`
  const { data } = await getData(url, "latestVideos", { items: [] })

  if (!data.items || data.items.length === 0) {
    console.warn("No videos found in response")
    return FALLBACK_VIDEOS.slice(0, maxResults)
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
  }))

  console.log(`Successfully fetched ${videos.length} videos`)
  return videos
}
