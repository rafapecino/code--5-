"use client"

import { useState } from "react"
import Image from "next/image"
import { YouTubeVideo } from "@/lib/youtube-service"

interface HeroSectionProps {
  video: YouTubeVideo
}

export function HeroSection({ video }: HeroSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = () => {
    setIsPlaying(true)
  }

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <Image
        src={video.thumbnail}
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="absolute z-0 filter blur-sm scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent z-10"></div>

      <div className="relative z-20 container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div className="text-left animate-fade-in-up">
          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-4 leading-tight tracking-tighter">
            Análisis sin filtros desde el Paddock
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-light line-clamp-2">
            {video.title}
          </p>
        </div>

        <div className="w-full animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {isPlaying ? (
            <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
              <iframe
                src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          ) : (
            <div
              onClick={handlePlay}
              className="aspect-video relative rounded-lg overflow-hidden cursor-pointer group shadow-2xl"
            >
              <Image
                src={video.thumbnail || "/placeholder.svg"}
                alt={video.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <div className="w-20 h-20 bg-red-600/80 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4.018 15.143C3.34 15.54 2.5 15.053 2.5 14.28V5.72c0-.773.84-1.26 1.518-.86l8.433 4.28c.69.35.69.93 0 1.28l-8.433 4.723z"/>
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
