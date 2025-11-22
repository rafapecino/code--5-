"use client"

import { YouTubeChannel, formatNumber } from "@/lib/youtube-service"
import { Counter } from "./ui/counter"

interface YouTubeStatsProps {
  stats: YouTubeChannel | null
}

export function YouTubeStats({ stats }: YouTubeStatsProps) {
  // Si no hay stats, mostrar datos por defecto
  const subscriberCount = stats?.subscriberCount || "245000"
  const videoCount = stats?.videoCount || "156"
  const viewCount = stats?.viewCount || "12500000"

  const formatWrapper = (value: number) => formatNumber(value.toString());

  return (
    <div className="bg-background/80 backdrop-blur-sm border-2 border-primary rounded-lg p-8 inline-block">
      <div className="text-5xl md:text-6xl font-bold text-accent mb-2">
        <Counter from={0} to={Number(subscriberCount)} format={formatWrapper} />
      </div>
      <p className="text-xl text-foreground font-semibold mb-4">Suscriptores</p>
      <div className="flex gap-6 text-sm text-muted-foreground">
        <div>
          <div className="font-bold text-foreground">
            <Counter from={0} to={Number(videoCount)} />
          </div>
          <div>Vídeos</div>
        </div>
        <div>
          <div className="font-bold text-foreground">
            <Counter from={0} to={Number(viewCount)} format={formatWrapper} />
          </div>
          <div>Vistas</div>
        </div>
      </div>
    </div>
  )
}
