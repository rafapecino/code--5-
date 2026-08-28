"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { YouTubeVideo, getVideoUrl, formatDate } from "@/lib/youtube-format";
import { Star, Play, Calendar, Youtube } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface YouTubeVideosProps {
  videos: YouTubeVideo[];
  specialVideoId?: string | null;
  specialLabel?: string;
  showSeeMore?: boolean;
}

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function YouTubeVideos({
  videos,
  specialVideoId,
  specialLabel = "EDICIÓN ESPECIAL",
  showSeeMore = false,
}: YouTubeVideosProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid || prefersReduced()) return;

      // Entrada rápida por tarjeta (once + refresh) para que nunca queden oscuras.
      const cards = gsap.utils.toArray<HTMLElement>(".yt-card", grid);
      cards.forEach((card) => {
        gsap.from(card, {
          opacity: 0,
          y: 28,
          duration: 0.45,
          ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 92%", once: true },
        });
      });

      // Insignia: flotación + leve giro 3D (efecto medalla) en bucle.
      const coin = grid.querySelector<HTMLElement>(".yt-badge-coin");
      if (coin) {
        gsap.to(coin, {
          y: -12,
          duration: 2.2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
        gsap.to(coin, {
          rotateY: 16,
          duration: 3,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          transformPerspective: 700,
          transformOrigin: "center",
        });
      }

      ScrollTrigger.refresh();
    },
    { scope: gridRef, dependencies: [videos.length] },
  );

  // --- Tilt 3D siguiendo al cursor ---
  const handleTilt = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (prefersReduced()) return;
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(card, {
      rotateY: px * 12,
      rotateX: -py * 12,
      scale: 1.04,
      y: -8,
      transformPerspective: 900,
      transformOrigin: "center",
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const resetTilt = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, {
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      y: 0,
      duration: 0.6,
      ease: "power3.out",
    });
  };

  const renderVideoCard = (video: YouTubeVideo) => {
    const isSpecial = video.id === specialVideoId;
    return (
      <Link
        key={video.id}
        href={getVideoUrl(video.id)}
        target="_blank"
        rel="noopener noreferrer"
        onMouseMove={handleTilt}
        onMouseLeave={resetTilt}
        // El cursor personalizado se abre y muestra esta etiqueta encima.
        data-cursor-label="Ver"
        className={`yt-card group relative flex flex-col bg-white/5 backdrop-blur-xl border rounded-[24px] md:rounded-[32px] overflow-hidden transition-shadow duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.7)] will-change-transform ${
          isSpecial
            ? "border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.2)] ring-1 ring-inset ring-red-600/20"
            : "border-white/10 hover:border-white/30"
        }`}
      >
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={video.thumbnail || "/placeholder.svg"}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          {isSpecial && (
            <div
              className={`${specialLabel === "MÁS RECIENTE" ? "bg-red-600" : "bg-yellow-500"} text-white px-3 py-1.5 rounded-full text-[10px] font-black flex items-center gap-1.5 shadow-xl animate-pulse absolute top-4 right-4 z-20`}
            >
              <Star size={12} fill="currentColor" />
              <span>{specialLabel}</span>
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.6)] scale-50 group-hover:scale-100 transition-transform duration-500">
              <Play
                className="fill-white text-white translate-x-0.5"
                size={24}
              />
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 flex flex-col flex-grow">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={12} className="text-red-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              {formatDate(video.publishedAt)}
            </span>
            <div className="ml-auto flex items-center gap-1">
              {video.isLive ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
                  </span>
                  <span className="text-[9px] font-black text-red-500 uppercase tracking-wider">
                    En directo
                  </span>
                </>
              ) : (
                <>
                  <Youtube size={12} className="text-gray-500" />
                  <span className="text-[9px] font-black text-gray-500 uppercase">
                    Vídeo
                  </span>
                </>
              )}
            </div>
          </div>

          <h3 className="text-lg md:text-xl font-black italic tracking-tighter text-white mb-4 group-hover:text-red-500 transition-colors line-clamp-2 leading-tight uppercase">
            {video.title}
          </h3>

          <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">
              Ver ahora
            </span>
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-600 transition-all">
              <Play
                size={12}
                className="fill-white text-white opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>
      </Link>
    );
  };

  const seeMoreCard = (
    <Link
      key="see-more"
      href="https://www.youtube.com/@PecinoGP"
      target="_blank"
      rel="noopener noreferrer"
      className="yt-card group relative flex flex-col items-center justify-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] md:rounded-[32px] overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:border-yellow-500/40 hover:bg-white/10"
    >
      <div className="text-center p-8">
        <div className="yt-badge-coin w-48 h-48 relative mb-6 mx-auto">
          {/* Halo dorado que late detrás de la moneda */}
          <div className="absolute inset-6 rounded-full bg-yellow-500/20 blur-2xl animate-pulse" />
          <Image
            src="/insignia-member.png"
            alt="PecinoGP Member"
            fill
            className="object-contain relative z-10 drop-shadow-[0_0_20px_rgba(234,179,8,0.45)] transition-transform duration-700 group-hover:scale-110 group-hover:rotate-[8deg]"
          />
        </div>
        <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase group-hover:text-yellow-400 transition-colors">
          Ver más
        </h3>
      </div>
    </Link>
  );

  // Construimos las celdas: la insignia va al final (última posición).
  const cells: React.ReactNode[] = videos.map(renderVideoCard);
  if (showSeeMore) {
    cells.push(seeMoreCard);
  }

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10"
    >
      {cells}
    </div>
  );
}
