"use client";
import { Footer } from "@/All/components/footer";
import Header from "@/All/components/header";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type {
  YouTubeChannel,
  YouTubeVideo,
  LiveStream,
} from "@/lib/youtube-format";
import { YouTubeStats } from "@/All/components/youtube-stats";
import { FeaturedStack } from "@/All/components/featured-stack";
import { LatestVideo } from "@/All/components/latest-video";
import { Magnetic } from "@/All/components/magnetic";
import { ScatterText } from "@/All/components/motion/scatter-text";
import { MaskReveal } from "@/All/components/motion/mask-reveal";
import { LiquidButton } from "@/All/components/motion/liquid-button";
import { motion } from "framer-motion";
import { Play, ChevronRight, Youtube, Star, ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import dynamic from "next/dynamic";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ThreeBackground = dynamic(
  () => import("@/All/components/three-background"),
  { ssr: false },
);

export default function Home() {
  const [data, setData] = useState<{
    channelStats: YouTubeChannel | null;
    latestVideo: YouTubeVideo[];
    featuredVideos: YouTubeVideo[];
    liveStatus: LiveStream | null;
  }>({
    channelStats: null,
    latestVideo: [],
    featuredVideos: [],
    liveStatus: null,
  });
  const [loading, setLoading] = useState(true);

  // Refs para el hero cinematográfico controlado por GSAP/ScrollTrigger.
  const heroRef = useRef<HTMLElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);
  const heroHeadlineRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroOverlayRef = useRef<HTMLDivElement>(null);
  const heroButtonsRef = useRef<HTMLDivElement>(null);
  const heroCardRef = useRef<HTMLDivElement>(null);

  // Refs para el bloque "Último análisis disponible".
  const latestRef = useRef<HTMLDivElement>(null);
  const latestCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const featuredIds = ["EhRz4obCadU", "b15kGQHfMwI", "eCPrCjpQC2c"];
        const [ytRes, liveRes] = await Promise.all([
          fetch(`/api/youtube?max=1&featured=${featuredIds.join(",")}`).then(
            (r) => r.json(),
          ),
          fetch("/api/live").then((r) => r.json()),
        ]);

        setData({
          channelStats: ytRes.stats || null,
          latestVideo: ytRes.latestVideos || [],
          featuredVideos: ytRes.featuredVideos || [],
          liveStatus: liveRes || null,
        });
      } catch (err) {
        console.error("Error fetching home data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getVideoUrl = (videoId: string) =>
    `https://www.youtube.com/watch?v=${videoId}`;

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

  // --- HERO CINEMATOGRÁFICO (GSAP) ---
  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduce) return;

      // La entrada del titular (letras dispersas que se ensamblan) la gestiona
      // <ScatterText/>; aquí solo nos ocupamos del comportamiento con scroll.

      // Pin + scrub: el hero se fija y la escena hace zoom/parallax con el scroll.
      // Solo en escritorio para no entorpecer el scroll táctil en móvil.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "+=130%",
            scrub: 1,
            pin: true,
          },
        });
        // El fondo sigue haciendo zoom.
        tl.to(heroBgRef.current, { scale: 1.6, yPercent: 16, ease: "none" }, 0);
        // El contenido se eleva y "se vacía".
        tl.to(heroContentRef.current, { yPercent: -22, ease: "none" }, 0);
        // El titular se va volando hacia arriba al hacer scroll.
        // (Se anima el bloque entero, NO las letras: animarlas chocaría con la
        //  entrada letra a letra y las dejaría ocultas.)
        tl.to(
          heroHeadlineRef.current,
          { yPercent: -120, autoAlpha: 0, ease: "power1.in" },
          0,
        );
        // Los botones también se van hacia arriba y se desvanecen.
        tl.to(
          heroButtonsRef.current,
          { yPercent: -90, autoAlpha: 0, ease: "power1.in" },
          0.05,
        );
        // La cajita de stats se aleja (encoge), sube y se desvanece.
        tl.to(
          heroCardRef.current,
          { yPercent: -60, scale: 0.94, autoAlpha: 0, ease: "power1.in" },
          0.1,
        );
        // Todo el hero se funde a negro de forma deliberada (no transparente).
        tl.to(
          heroOverlayRef.current,
          { opacity: 0.94, ease: "power2.in" },
          0.2,
        );
      });

      return () => mm.revert();
    },
    { scope: heroRef },
  );

  // --- ÚLTIMO ANÁLISIS: sube y escala ligado al scroll (scrub) ---
  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduce || !latestCardRef.current) return;

      gsap.fromTo(
        latestCardRef.current,
        { y: 110, scale: 0.9 },
        {
          y: 0,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: latestRef.current,
            start: "top bottom",
            end: "center center",
            scrub: 1,
          },
        },
      );
    },
    { scope: latestRef },
  );

  return (
    // overflow-x-clip (y no -hidden) a propósito: "hidden" convertiría este
    // div en contenedor de scroll y rompería el position:sticky de la baraja
    // de vídeos destacados. "clip" recorta igual sin crear scrollport.
    <div className="min-h-screen bg-black text-foreground overflow-x-clip selection:bg-red-600 selection:text-white">
      <Header />

      <main className="">
        {/* --- CINEMATIC HERO --- */}
        <section
          ref={heroRef}
          className="relative h-screen flex items-center justify-center overflow-hidden"
        >
          <div ref={heroBgRef} className="absolute inset-0 z-0 scale-125">
            <Image
              src="/motogp-race-moment---index-.jpg"
              alt="Fondo de carrera de MotoGP"
              fill
              className="object-cover opacity-60 contrast-125 saturate-150"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60"></div>
          </div>

          <div
            ref={heroContentRef}
            className="relative z-20 w-full flex items-center justify-center"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-7xl mx-auto px-4 text-center md:text-left grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-32 items-center pt-24 md:pt-40"
            >
              <div className="flex flex-col items-center md:items-start text-center md:text-left pb-12 md:pb-24">
                <motion.div variants={itemVariants} className="relative z-10">
                  {data.liveStatus?.isLive && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-5 py-2 mb-10 shadow-2xl"
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                      </span>
                      <span className="text-white/80 text-xs font-bold tracking-widest uppercase italic">
                        ¡Estamos en directo ahora!
                      </span>
                      <div className="flex items-center gap-1 text-red-500 font-black text-[10px] animate-bounce">
                        SINTONIZAR ARRIBA{" "}
                        <ArrowUpRight size={14} className="rotate-[-15deg]" />
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* Las letras arrancan dispersas y se ensamblan de golpe. */}
                <div ref={heroHeadlineRef} className="relative mb-12">
                  <ScatterText
                    spread={260}
                    delay={0.35}
                    className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-white italic tracking-tighter leading-[0.85]"
                    style={{
                      filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.8))",
                    }}
                  >
                    PASIÓN <br />{" "}
                    <span className="text-red-600">AL LÍMITE</span>
                  </ScatterText>
                </div>

                {/* Removiendo párrafo solicitado */}
                <div
                  ref={heroButtonsRef}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full sm:w-auto relative z-30"
                >
                  <Magnetic strength={0.4} className="w-full">
                    <Link
                      href={
                        data.latestVideo.length > 0
                          ? getVideoUrl(data.latestVideo[0].id)
                          : "#"
                      }
                      className="group relative inline-flex w-full h-full items-center justify-center bg-gradient-to-r from-red-600 to-red-700 text-white font-black py-4 md:py-6 px-8 rounded-2xl text-lg md:text-xl overflow-hidden transition-all duration-500 hover:scale-110 active:scale-95 shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:shadow-[0_0_60px_rgba(220,38,38,0.6)] border border-white/10"
                    >
                      <div className="absolute inset-x-0 inset-y-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                      <span className="relative z-10 flex items-center gap-2 md:gap-3 italic tracking-tighter uppercase drop-shadow-lg whitespace-nowrap">
                        <Play className="fill-white" size={24} /> Ver último
                        vídeo
                      </span>
                    </Link>
                  </Magnetic>
                  <Magnetic className="w-full">
                    <Link
                      href="/analisis-gp"
                      className="group relative inline-flex w-full h-full items-center justify-center bg-white/5 backdrop-blur-xl border border-white/10 text-white font-black py-4 md:py-6 px-8 rounded-2xl text-lg md:text-xl overflow-hidden transition-all duration-500 hover:scale-110 active:scale-95 hover:bg-white/10 group/btn"
                    >
                      <span className="relative z-10 flex items-center gap-2 md:gap-3 italic tracking-tighter uppercase whitespace-nowrap">
                        Todos los vídeos{" "}
                        <ChevronRight
                          size={24}
                          className="group-hover/btn:translate-x-2 transition-transform duration-300"
                        />
                      </span>
                    </Link>
                  </Magnetic>
                </div>
              </div>

              {/* Columna Derecha: Estadísticas (solo escritorio) */}
              <motion.div
                variants={itemVariants}
                className="hidden lg:block relative h-[500px] w-full"
              >
                <div
                  ref={heroCardRef}
                  className="relative h-full w-full bg-white/[0.01] backdrop-blur-xl rounded-[32px] border border-white/5 p-12 shadow-2xl overflow-hidden group"
                >
                  {/* Fondo 3D con parallax de ratón + reactivo al scroll */}
                  <ThreeBackground
                    density={420}
                    size={0.5}
                    opacity={0.95}
                    scrollReactive
                  />

                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-10">
                        <div className="relative flex items-center gap-2 translate-y-0 group-hover:-translate-y-1 transition-transform">
                          <div className="w-8 h-1 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,1)]" />
                          <span className="text-red-500 font-black uppercase tracking-[0.4em] text-[10px] whitespace-nowrap">
                            Archivo PecinoGP
                          </span>
                        </div>
                        {/* --- LIVE STATUS BUTTON --- */}
                        <Link
                          href={
                            data.liveStatus?.isLive
                              ? `https://www.youtube.com/watch?v=${data.liveStatus.videoId}`
                              : "https://www.youtube.com/@PecinoGP/streams"
                          }
                          target="_blank"
                          className={`group/live flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
                            data.liveStatus?.isLive
                              ? "bg-red-600 border-red-500 text-white animate-pulse shadow-[0_0_30px_rgba(220,38,38,0.8)] scale-110"
                              : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                          }`}
                        >
                          <div
                            className={`w-2.5 h-2.5 rounded-full ${data.liveStatus?.isLive ? "bg-white shadow-[0_0_15px_white]" : "bg-white/20"}`}
                          />
                          <span className="text-[10px] font-black uppercase tracking-widest italic pt-0.5">
                            {data.liveStatus?.isLive
                              ? "EN DIRECTO"
                              : "CANAL DE DIRECTOS"}
                          </span>
                        </Link>
                      </div>

                      {data.channelStats && (
                        <div className="space-y-12">
                          <div className="flex flex-col group/item">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-1">
                              Fanáticos Reales
                            </span>
                            <div className="flex items-baseline gap-2">
                              <span className="text-7xl md:text-9xl font-black text-white italic tracking-tighter leading-none [text-shadow:0_15px_30px_rgba(0,0,0,0.5)]">
                                {Math.floor(
                                  Number(data.channelStats.subscriberCount) /
                                    1000,
                                )}
                                K
                              </span>
                            </div>
                            <div className="w-full bg-white/10 h-1.5 mt-6 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: "88%" }}
                                transition={{ duration: 2, ease: "circOut" }}
                                className="h-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {data.channelStats && (
                      <div className="grid grid-cols-2 gap-10 pt-10 border-t border-white/10">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">
                            Contenido
                          </span>
                          <span className="text-4xl font-black text-white italic tracking-tighter">
                            {data.channelStats.videoCount}{" "}
                            <span className="text-xs text-red-500 not-italic ml-1">
                              VÍDEOS
                            </span>
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">
                            Impacto
                          </span>
                          <span className="text-4xl font-black text-white italic tracking-tighter">
                            {Math.floor(
                              Number(data.channelStats.viewCount) / 1000000,
                            )}
                            M{" "}
                            <span className="text-xs text-red-500 not-italic ml-1">
                              VISITAS
                            </span>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Velo de fundido a negro controlado por el scroll del hero */}
          <div
            ref={heroOverlayRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 z-30 bg-black opacity-0"
          />
        </section>

        {/* --- LATEST VIDEO --- */}
        <section
          ref={latestRef}
          className="px-4 py-24 md:py-32 overflow-hidden"
        >
          <div className="max-w-6xl mx-auto flex flex-col items-center">
            <div ref={latestCardRef} className="w-full relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 blur-[120px] -z-10" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-600/10 blur-[120px] -z-10" />
              <LatestVideo latestVideo={data.latestVideo[0] || null} />
            </div>
          </div>
        </section>

        {/* --- FEATURED VIDEOS --- */}
        <section className="px-4 sm:px-6 lg:px-8 py-24 md:py-32 bg-secondary/10 border-y border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  className="flex items-center gap-2 mb-2"
                >
                  <div className="w-8 h-1 bg-red-600 rounded-full" />
                  <span className="text-red-500 font-black uppercase tracking-[0.2em] text-[10px]">
                    Contenido a pie de pista
                  </span>
                </motion.div>
                <MaskReveal className="text-4xl md:text-6xl font-black text-white italic tracking-tighter">
                  LO MEJOR DE <span className="text-red-600">ESTE AÑO</span>
                </MaskReveal>
              </div>
              <Magnetic>
                <Link
                  href="/analisis-gp"
                  className="group flex items-center gap-3 bg-white/5 border border-white/10 text-white font-black py-3 px-8 rounded-xl hover:bg-red-600 transition-all tracking-wider text-sm uppercase italic"
                >
                  VER TODOS LOS VÍDEOS{" "}
                  <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </Magnetic>
            </div>

            {loading ? (
              <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-[340px] bg-white/5 animate-pulse rounded-[28px]"
                  />
                ))}
              </div>
            ) : (
              /* Baraja apilada por scroll: cada análisis se queda pegado
                 arriba y el siguiente lo cubre. */
              <FeaturedStack
                videos={data.featuredVideos}
                specialVideoId={
                  data.featuredVideos.length > 0
                    ? data.featuredVideos[0].id
                    : null
                }
                specialLabel="MÁS DESTACADO"
              />
            )}
          </div>
        </section>

        {/* --- COLABORA CON NOSOTROS --- */}
        <section className="px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-transparent" />
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-600/30 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Resplandor rojo que respira detrás del título */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0.3, scale: 0.9 }}
            animate={{ opacity: [0.3, 0.55, 0.3], scale: [0.9, 1.05, 0.9] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-600/20 blur-[140px] -z-0"
          />

          {/* Líneas de velocidad animadas */}
          <motion.div
            aria-hidden
            initial={{ x: "-100%", opacity: 0 }}
            whileInView={{ x: "0%", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute left-0 top-1/3 w-1/4 h-px bg-gradient-to-r from-red-600/60 to-transparent"
          />
          <motion.div
            aria-hidden
            initial={{ x: "100%", opacity: 0 }}
            whileInView={{ x: "0%", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute right-0 bottom-1/3 w-1/4 h-px bg-gradient-to-l from-red-600/60 to-transparent"
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="max-w-5xl mx-auto relative z-10 text-center"
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center gap-2 mb-6"
            >
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 32 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="h-1 bg-red-600 rounded-full"
              />
              <span className="text-red-500 font-black uppercase tracking-[0.4em] text-[10px]">
                Trabaja con nosotros
              </span>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 32 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="h-1 bg-red-600 rounded-full"
              />
            </motion.div>

            {/* Revelado por máscara línea a línea (cada renglón sube desde
                detrás de un recorte). */}
            <MaskReveal
              className="text-5xl sm:text-6xl md:text-8xl font-black text-white italic tracking-tighter leading-[0.85] mb-8"
              style={{ filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.8))" }}
            >
              ¿TIENES ALGO <br />
              <span className="text-red-600">QUE PROPONERNOS?</span>
            </MaskReveal>

            <motion.p
              variants={itemVariants}
              className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl font-medium italic mb-12"
            >
              Marcas, equipos, creadores y medios: estamos abiertos a
              colaboraciones que sumen al paddock digital. Escríbenos y
              hablamos.
            </motion.p>

            <motion.div variants={itemVariants}>
              {/* Botón "metal líquido": gradiente cónico girando dentro y
                  halo que persigue al cursor. */}
              <Magnetic strength={0.4}>
                <LiquidButton href="/contacto">
                  Contacta con nosotros
                  <ChevronRight
                    size={22}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </LiquidButton>
              </Magnetic>
            </motion.div>
          </motion.div>
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
