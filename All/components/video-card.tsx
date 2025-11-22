import Image from "next/image"
import Link from "next/link"
import type { Video } from "@/lib/youtube-service"

interface VideoCardProps {
  video: Video
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <Link href={`https://youtube.com/watch?v=${video.id}`} target="_blank">
      <div className="group cursor-pointer">
        <div className="relative w-full bg-secondary rounded-lg overflow-hidden mb-3 aspect-video">
          <Image
            src={video.thumbnail || "/placeholder.svg"}
            alt={video.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white font-semibold">
            {video.duration}
          </div>
        </div>

        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 text-sm">
          {video.title}
        </h3>

        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>{video.viewCount.toLocaleString()} vistas</span>
          <span>{video.publishedAt}</span>
        </div>
      </div>
    </Link>
  )
}
