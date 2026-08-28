"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Play, Star } from "lucide-react";
import { YouTubeVideo, getVideoUrl, formatDate } from "@/lib/youtube-format";
import { StickyStack } from "@/All/components/motion/sticky-stack";
import { GlowCard } from "@/All/components/motion/glow-card";

/**
 * Vídeos destacados presentados como baraja apilada por scroll: cada análisis
 * ocupa un panel ancho que se queda pegado arriba mientras el siguiente lo
 * cubre. Sustituye a la rejilla de tres columnas en la portada porque le da
 * mucho más protagonismo a cada vídeo.
 *
 * En pantallas por debajo de lg el apilado se desactiva (lo hace
 * <StickyStack/>) y los paneles quedan en una columna normal.
 */
export function FeaturedStack({
  videos,
  /** Vídeo que lleva la insignia de destacado. */
  specialVideoId,
  specialLabel = "EDICIÓN ESPECIAL",
}: {
  videos: YouTubeVideo[];
  specialVideoId?: string | null;
  specialLabel?: string;
}) {
  if (videos.length === 0) return null;

  return (
    <StickyStack className="space-y-8 lg:space-y-24" offset={28}>
      {videos.map((video, i) => {
        const isSpecial = video.id === specialVideoId;
        return (
          <GlowCard
            key={video.id}
            intensity={isSpecial ? "strong" : "soft"}
            className="overflow-hidden"
          >
            <Link
              href={getVideoUrl(video.id)}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-label="Ver"
              className="group grid grid-cols-1 gap-0 overflow-hidden rounded-[28px] bg-[#0a0a0a] md:grid-cols-2"
            >
              <div className="relative aspect-video overflow-hidden md:aspect-auto md:min-h-[340px]">
                <Image
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-gradient-to-r" />

                {isSpecial && (
                  <span className="absolute left-5 top-5 z-10 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 text-[10px] font-black text-white shadow-xl">
                    <Star size={12} fill="currentColor" />
                    {specialLabel}
                  </span>
                )}

                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="flex h-20 w-20 scale-50 items-center justify-center rounded-full bg-red-600 shadow-[0_0_40px_rgba(220,38,38,0.7)] transition-transform duration-500 group-hover:scale-100">
                    <Play
                      className="translate-x-0.5 fill-white text-white"
                      size={28}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center p-8 md:p-12">
                <div className="mb-5 flex items-center gap-3">
                  {/* El número de orden ancla visualmente cada panel dentro
                      de la baraja. */}
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="h-px w-8 bg-red-600/60" />
                  <Calendar size={12} className="text-white/40" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                    {formatDate(video.publishedAt)}
                  </span>
                </div>

                <h3 className="mb-6 text-2xl font-black uppercase italic leading-tight tracking-tighter text-white transition-colors group-hover:text-red-500 md:text-4xl">
                  {video.title}
                </h3>

                <span className="inline-flex items-center gap-3 text-xs font-black uppercase italic tracking-widest text-white/50 transition-colors group-hover:text-white">
                  Ver el análisis
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 transition-all group-hover:border-red-600 group-hover:bg-red-600">
                    <Play size={12} className="fill-white text-white" />
                  </span>
                </span>
              </div>
            </Link>
          </GlowCard>
        );
      })}
    </StickyStack>
  );
}
