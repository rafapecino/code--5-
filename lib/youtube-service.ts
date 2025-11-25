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
  error?: string
}

export interface LiveStream {
  isLive: boolean
  videoId?: string
}

const FALLBACK_LIVE_STATUS: LiveStream = {
  isLive: false,
}

export async function getLiveStream(): Promise<LiveStream> {
  try {
    if (!YOUTUBE_API_KEY || !CHANNEL_ID) {
      console.warn(
        "YouTube API credentials not configured, using fallback data for live status",
      )
      return FALLBACK_LIVE_STATUS
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&key=${YOUTUBE_API_KEY}`,
      { next: { revalidate: 60 } }, // Revalidate every minute
    )

    if (!response.ok) {
      console.error(
        "Error fetching live stream status:",
        response.status,
        response.statusText,
      )
      return FALLBACK_LIVE_STATUS
    }

    const data = await response.json()

    if (data.items && data.items.length > 0) {
      return {
        isLive: true,
        videoId: data.items[0].id.videoId,
      }
    }

    return { isLive: false }
  } catch (error) {
    console.error("Error fetching YouTube live stream status:", error)
    return FALLBACK_LIVE_STATUS
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
