"use client"

import Image from "next/image"
import Link from "next/link"
import { YouTubeVideo, getVideoUrl, formatDate } from "@/lib/youtube-format"
import { Star } from "lucide-react"

interface FeaturedVideoCardProps {
  video: YouTubeVideo
}

export function FeaturedVideoCard({ video }: FeaturedVideoCardProps) {
  return (
    <Link
      href={getVideoUrl(video.id)}
      target="_blank"
      rel="noopener noreferrer"
      className="card-racing overflow-hidden hover:border-accent transition-colors group cursor-pointer border-2 border-yellow-500 shadow-2xl shadow-yellow-500/20 mb-12"
    >
      <div className="relative w-full h-64 overflow-hidden bg-secondary">
        <Image
          src={video.thumbnail || "/placeholder.svg"}
          alt={video.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        <div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
          <Star className="w-4 h-4" />
          <span>Vídeo Especial: 1000 Vídeos</span>
        </div>
        <div className="absolute bottom-0 left-0 p-6">
          <h3 className="font-bold text-2xl mb-2 text-white group-hover:text-yellow-400 transition-colors line-clamp-2">
            {video.title}
          </h3>
          <p className="text-gray-300 text-sm mb-3 line-clamp-2">
            {video.description}
          </p>
        </div>
      </div>
      <div className="p-4 bg-gray-900/50">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1">
            📅 {formatDate(video.publishedAt)}
          </span>
          <span className="text-yellow-400 font-semibold text-base">Ver Ahora →</span>
        </div>
      </div>
    </Link>
  )
}