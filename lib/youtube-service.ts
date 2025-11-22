// YouTube Data Service - Integración con YouTube Data API v3

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
const CHANNEL_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID

export interface YouTubeChannel {
  subscriberCount: string
  viewCount: string
  videoCount: string
}

export interface YouTubeVideo {
  id: string
  title: string
  description: string
  thumbnail: string
  publishedAt: string
  viewCount: string
  channelTitle: string
}

// Datos de fallback para desarrollo sin API
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
  {
    id: "9bZkp7q19f0",
    title: "Championship Analysis - 2024 Season",
    description: "Desglose completo del campeonato 2024",
    thumbnail: "/racing-championship-analysis.jpg",
    publishedAt: "2024-11-12",
    viewCount: "98500",
    channelTitle: "PecinoGP",
  },
  {
    id: "jNQXAC9IVRw",
    title: "Behind the Scenes: Team Garage Tour",
    description: "Recorrido exclusivo por el garaje del equipo",
    thumbnail: "/racing-team-garage.jpg",
    publishedAt: "2024-11-11",
    viewCount: "156000",
    channelTitle: "PecinoGP",
  },
]

export async function getChannelStats(): Promise<YouTubeChannel> {
  try {
    if (!YOUTUBE_API_KEY || !CHANNEL_ID) {
      console.warn("YouTube API credentials not configured, using fallback data")
      return FALLBACK_STATS
    }

    console.log("Fetching YouTube stats for channel:", CHANNEL_ID)

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${YOUTUBE_API_KEY}`,
      { next: { revalidate: 3600 } }
    )

    if (!response.ok) {
      console.error("Error fetching channel stats:", response.status, response.statusText)
      return FALLBACK_STATS
    }

    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      console.error("No channel data found in response")
      return FALLBACK_STATS
    }

    const channel = data.items[0]

    const stats = {
      subscriberCount: channel.statistics.subscriberCount || "0",
      viewCount: channel.statistics.viewCount || "0",
      videoCount: channel.statistics.videoCount || "0",
    }

    console.log("Successfully fetched YouTube stats:", stats)
    return stats
  } catch (error) {
    console.error("Error fetching YouTube channel stats:", error)
    return FALLBACK_STATS
  }
}

export async function getLatestVideos(maxResults: number = 6): Promise<YouTubeVideo[]> {
  try {
    if (!YOUTUBE_API_KEY || !CHANNEL_ID) {
      console.warn("YouTube API credentials not configured, using fallback data")
      return FALLBACK_VIDEOS.slice(0, maxResults)
    }

    console.log("Fetching latest videos for channel:", CHANNEL_ID)

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=date&maxResults=${maxResults}&type=video`,
      { next: { revalidate: 3600 } }
    )

    if (!response.ok) {
      console.error("Error fetching videos:", response.status, response.statusText)
      return FALLBACK_VIDEOS.slice(0, maxResults)
    }

    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      console.warn("No videos found in response")
      return FALLBACK_VIDEOS.slice(0, maxResults)
    }

    const videos = data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url || "",
      publishedAt: item.snippet.publishedAt,
      viewCount: "0",
      channelTitle: item.snippet.channelTitle,
    }))

    console.log(`Successfully fetched ${videos.length} videos`)
    return videos
  } catch (error) {
    console.error("Error fetching YouTube videos:", error)
    return FALLBACK_VIDEOS.slice(0, maxResults)
  }
}

export function getVideoUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`
}

export function getVideoEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`
}

export function formatNumber(num: string): string {
  const n = parseInt(num)
  if (n >= 1000000) {
    return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M"
  }
  if (n >= 1000) {
    return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K"
  }
  return n.toString()
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
