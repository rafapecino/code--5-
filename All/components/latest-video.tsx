"use client";

import { useState } from "react";
import Image from "next/image";
import { YouTubeVideo } from "@/lib/youtube-format";
import { decodeHtmlEntities } from "@/lib/utils";
import { Play } from "lucide-react";

export function LatestVideo({
  latestVideo,
}: {
  latestVideo: YouTubeVideo | null;
}) {
  const [playing, setPlaying] = useState(false);

  if (!latestVideo || latestVideo.error) {
    return (
      <div className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-12 text-center shadow-2xl">
        <h2 className="text-2xl font-black italic text-red-600 mb-4 uppercase tracking-tighter">
          Error al Cargar Contenido
        </h2>
        <p className="text-gray-400 font-medium">
          {latestVideo?.description ||
            "No se pudo conectar con el canal de YouTube."}
        </p>
      </div>
    );
  }

  const title = decodeHtmlEntities(latestVideo.title);

  return (
    <div className="w-full group">
      <div className="flex items-center gap-3 mb-6 px-2">
        <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-red-500 italic">
          Último Análisis Disponible
        </h2>
      </div>

      <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-6 md:p-10 shadow-2xl transition-all duration-500 group-hover:border-red-600/30">
        <div className="relative w-full overflow-hidden rounded-[32px] aspect-video shadow-2xl group-hover:shadow-red-600/10 transition-shadow duration-500">
          {playing ? (
            // El iframe (y sus cookies) solo se carga tras la acción del usuario.
            // Usamos youtube-nocookie.com (dominio de privacidad mejorada).
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${latestVideo.id}?autoplay=1&rel=0`}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          ) : (
            // Fachada (facade): miniatura estática + botón de play. Sin cookies
            // de terceros hasta que el usuario pulse. Cumple LSSI-CE art. 22.
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`Reproducir: ${title}`}
              className="group/play absolute inset-0 w-full h-full cursor-pointer"
            >
              <Image
                src={latestVideo.thumbnail || "/placeholder.svg"}
                alt={title}
                fill
                priority
                className="object-cover grayscale-[0.2] transition-all group-hover/play:grayscale-0"
              />
              <span className="absolute inset-0 bg-black/40 group-hover/play:bg-black/30 transition-colors" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex items-center justify-center w-20 h-20 rounded-full bg-red-600 shadow-[0_0_40px_rgba(220,38,38,0.6)] transition-transform duration-300 group-hover/play:scale-110">
                  <Play
                    className="fill-white text-white translate-x-0.5"
                    size={34}
                  />
                </span>
              </span>
            </button>
          )}

          <div className="absolute inset-0 pointer-events-none border-[12px] border-black/20 rounded-[32px] z-10" />
        </div>

        <div className="mt-10 flex flex-col items-center text-center">
          <h3 className="text-2xl md:text-4xl font-black italic tracking-tighter text-white leading-tight mb-4 group-hover:text-red-500 transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <Play size={14} className="fill-gray-500" /> PECINOGP MOTOGP2026
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
