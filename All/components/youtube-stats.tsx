"use client"

import { YouTubeChannel, formatNumber } from "@/lib/youtube-format"
import { Counter } from "./ui/counter"
import { Users, PlaySquare, Eye, LucideIcon } from "lucide-react"

interface YouTubeStatsProps {
  stats: YouTubeChannel | null
}

export function YouTubeStats({ stats }: YouTubeStatsProps) {
  const subscriberCount = stats?.subscriberCount || "245000"
  const videoCount = stats?.videoCount || "156"
  const viewCount = stats?.viewCount || "12500000"

  const formatWrapper = (value: number) => formatNumber(value.toString());

  const StatItem = ({ icon: Icon, label, value, main = false, format = false }: { icon: LucideIcon, label: string, value: string, main?: boolean, format?: boolean }) => (
    <div className={`flex flex-col ${main ? 'items-center mb-8' : 'items-start flex-1'}`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-4 h-4 ${main ? 'text-red-600' : 'text-gray-500'}`} />
        <span className={`uppercase tracking-widest font-black ${main ? 'text-xs text-red-500' : 'text-[10px] text-gray-400'}`}>
          {label}
        </span>
      </div>
      <div className={`${main ? 'text-6xl md:text-8xl' : 'text-2xl md:text-3xl'} font-black italic tracking-tighter text-white`}>
        <Counter from={0} to={Number(value)} format={format ? formatWrapper : undefined} />
      </div>
    </div>
  );

  return (
    <div className="relative group overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-10 md:p-16 flex flex-col items-center w-full max-w-4xl shadow-2xl">
        <StatItem icon={Users} label="Suscriptores" value={subscriberCount} main format />
        
        <div className="w-full h-px bg-white/5 mb-8" />

        <div className="flex w-full gap-8 md:gap-20">
          <StatItem icon={PlaySquare} label="Vídeos" value={videoCount} />
          <StatItem icon={Eye} label="Vistas Totales" value={viewCount} format />
        </div>
      </div>
    </div>
  )
}
