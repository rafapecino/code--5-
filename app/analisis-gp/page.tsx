"use client";

import { useEffect, useState } from "react";
import Header from "@/All/components/header";
import type { YouTubeVideo } from "@/lib/youtube-format";
import { YouTubeVideos } from "@/All/components/youtube-videos";
import { motion, useScroll, useTransform } from "framer-motion";
import { Calendar, ChevronRight, Play } from "lucide-react";
import Image from "next/image";
import { Footer } from "@/All/components/footer";
import { SplitHeadline } from "@/All/components/split-headline";
import { Reveal } from "@/All/components/reveal";
import { ScrollHint } from "@/All/components/scroll-hint";
import { HeroUnderline } from "@/All/components/hero-underline";

export default function AnalisisGpPage() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/youtube?max=25").then((r) => r.json());
        setVideos(res.latestVideos || []);
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <div className="min-h-screen bg-black text-foreground overflow-x-hidden selection:bg-red-600 selection:text-white">
      <Header />

      <main>
        {/* --- CINEMATIC HEADER --- */}
        <section className="relative min-h-[88vh] py-20 flex items-center justify-center overflow-hidden">
          <motion.div
            style={{ y: y1 }}
            className="absolute inset-0 z-0 scale-110"
          >
            <Image
              src="/motogp-race-moment---index-.jpg"
              alt="Análisis GP Background"
              fill
              className="object-cover opacity-40 grayscale-[0.2]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-20 max-w-7xl mx-auto px-4 text-center"
          >
            <SplitHeadline
              className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-white italic tracking-tighter leading-[0.95] md:leading-[0.85] mb-8"
              style={{ filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.8))" }}
            >
              VÍDEOS <span className="text-red-600">GP</span>
            </SplitHeadline>

            <HeroUnderline />

            <motion.p
              variants={itemVariants}
              className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl font-medium italic"
            >
              Acceso completo a todos los detalles técnicos, vídeos post-carrera
              y coberturas exclusivas de MotoGP.
            </motion.p>
          </motion.div>

          <ScrollHint />
        </section>

        {/* --- ALL VIDEOS GRID --- */}
        <section className="px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  className="flex items-center gap-2 mb-2"
                >
                  <div className="w-6 h-1 bg-red-600 rounded-full" />
                  <span className="text-red-500 font-black uppercase tracking-[0.2em] text-[10px]">
                    Contenidos 2026/2025
                  </span>
                </motion.div>
                <Reveal y={40}>
                  <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white italic tracking-tighter">
                    TODOS LOS <span className="text-red-600">VÍDEOS</span>
                  </h2>
                </Reveal>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-video bg-white/5 animate-pulse rounded-[32px]"
                  />
                ))}
              </div>
            ) : videos.length > 0 ? (
              /* Pasamos el ID del vídeo más reciente para que tenga el label especial */
              <YouTubeVideos
                videos={videos.slice(0, 11)}
                specialVideoId={videos[0].id}
                specialLabel="MÁS RECIENTE"
                showSeeMore={true}
              />
            ) : (
              <div className="text-center py-24 border border-white/5 rounded-[40px] bg-white/[0.02]">
                <p className="text-gray-500 font-bold italic tracking-wider">
                  NO SE HAN ENCONTRADO VÍDEOS DISPONIBLES.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
