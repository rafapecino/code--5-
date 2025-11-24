"use client"

import { useState } from "react"
import Image from "next/image"
import { YouTubeVideo, formatDate } from "@/lib/youtube-service"

interface YouTubeVideoCardProps {
  video: YouTubeVideo
}

export function YouTubeVideoCard({ video }: YouTubeVideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = () => {
    setIsPlaying(true)
  }

  if (isPlaying) {
    return (
      <div className="card-racing overflow-hidden">
        <div className="relative w-full aspect-video overflow-hidden bg-secondary">
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
          ></iframe>
        </div>
        <div className="p-4">
            <h3 className="font-bold text-lg mb-2 text-foreground line-clamp-2">
              {video.title}
            </h3>
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {video.description}
            </p>
            <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
              <span className="flex items-center gap-1">
                📅 {formatDate(video.publishedAt)}
              </span>
            </div>
          </div>
      </div>
    )
  }

  return (
    <div
      onClick={handlePlay}
      className="card-racing overflow-hidden hover:border-accent transition-colors group cursor-pointer"
    >
      <div className="relative w-full aspect-video overflow-hidden bg-secondary">
        <Image
          src={video.thumbnail || "/placeholder.svg"}
          alt={video.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
          <div className="text-white text-5xl opacity-80 group-hover:opacity-100 transition-opacity">
            ▶️
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-accent transition-colors line-clamp-2">
          {video.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {video.description}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
          <span className="flex items-center gap-1">
            📅 {formatDate(video.publishedAt)}
          </span>
          <span className="text-accent font-semibold">Ver →</span>
        </div>
      </div>
    </div>
  )
}
