"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Logo } from "./logo";
import { Magnetic } from "./magnetic";
import { LiveStream } from "@/lib/youtube-format";
import { trackEvent } from "@/lib/analytics";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/pecinogp", label: "PecinoGP" },
  { href: "/campeonato", label: "Campeonato" },
  { href: "/el-paddock", label: "El Paddock" },
  { href: "/membresia", label: "Membresía" },
  { href: "/contacto", label: "Contacto" },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [liveInfo, setLiveInfo] = useState<LiveStream>({ isLive: false });
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Compacto solo si se ha hecho scroll Y no se está pasando el ratón por encima.
  // Al pasar el ratón, el header recupera su tamaño grande de forma fluida.
  const compact = scrolled && !hovered;

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    async function fetchLiveStatus() {
      try {
        const res = await fetch("/api/live");
        if (res.ok) {
          const status: LiveStream = await res.json();
          setLiveInfo(status);
        }
      } catch (error) {
        console.error("Error fetching live status from API route:", error);
      }
    }

    fetchLiveStatus();
    // Polling cada 5 min (era 60s). Combinado con caché de 5 min en /api/live
    // baja el consumo de cuota de YouTube ~250× sin perder utilidad real.
    const interval = setInterval(fetchLiveStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isMobileMenuOpen
          ? "py-3 bg-black"
          : scrolled
            ? `${compact ? "py-3" : "py-6 md:py-14"} bg-black/80 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]`
            : "py-6 md:py-14 bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-12 lg:px-16">
        <div className="flex items-center justify-between transition-all duration-500">
          <div className="flex items-center">
            <Link
              href="/"
              className="shrink-0 active:scale-95 transition-transform duration-300"
            >
              <Logo
                size={compact ? "xs" : "sm"}
                className="md:scale-125 origin-left transition-transform"
              />
            </Link>
            {liveInfo.isLive && (
              <motion.div
                initial={{ scale: 0, x: -10 }}
                animate={{ scale: 1, x: 0, rotate: -3 }}
                className="ml-2 bg-gradient-to-r from-red-600 to-red-800 text-white text-[7px] hidden sm:flex font-black px-2 py-1 rounded shadow-[0_0_15px_rgba(220,38,38,0.5)] border border-white/30 whitespace-nowrap uppercase tracking-tighter italic lg:hidden"
              >
                Estamos en directo
              </motion.div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`group flex items-center justify-center px-1 ${
                  compact ? "-my-3 py-3" : "-my-6 py-6 md:-my-14 md:py-14"
                }`}
              >
                {/* Cajita visible redondeada; el <a> entero (alto del header) es clicable */}
                <span className="relative px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-[0.2em] italic text-white/70 group-hover:text-white group-hover:bg-white/5 transition-colors duration-300">
                  {link.label}
                  <span className="absolute bottom-1 left-5 right-5 h-[2px] bg-red-600 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                </span>
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:block w-px h-6 bg-white/10 mx-2" />
            {liveInfo.isLive ? (
              <Magnetic strength={0.4}>
                <a
                  href={`https://www.youtube.com/watch?v=${liveInfo.videoId}`}
                  onClick={() => trackEvent("youtube_click", { location: "header", variant: "desktop_live" })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-2 bg-gradient-to-br from-red-500 via-red-600 to-red-800 text-white font-black italic px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all duration-500 hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(220,38,38,0.6)] border border-white/30 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  <div className="flex flex-col items-center relative z-10">
                    <span className="text-[6px] sm:text-[8px] uppercase tracking-[0.2em] opacity-90 leading-none mb-0.5 sm:mb-1 shadow-sm">
                      ¡QUÉ SUERTE!
                    </span>
                    <span className="text-[9px] sm:text-[12px] uppercase tracking-tighter font-black leading-none drop-shadow-md">
                      ENTRA YA
                    </span>
                  </div>
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_10px_white] ml-0.5 sm:ml-1" />
                </a>
              </Magnetic>
            ) : (
              <Magnetic strength={0.4}>
                <a
                  href="https://www.youtube.com/channel/UCSvr3yH2NkqlAHfuRDphz4g"
                  onClick={() => trackEvent("youtube_click", { location: "header", variant: "desktop_channel" })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center transition-all duration-300 hover:scale-125 active:scale-95"
                >
                  <Image
                    src="/YouTube_Logo/Digital/01 Full Color/yt_logo_fullcolor_white_digital.png"
                    alt="YouTube Logo"
                    width={80}
                    height={20}
                    className="opacity-60 group-hover:opacity-100 transition-opacity hidden sm:block"
                  />
                  <div className="sm:hidden text-white/60 group-hover:text-red-600 transition-colors">
                    <svg
                      className="w-8 h-8"
                      viewBox="0 0 28 20"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M27.3733 3.033C27.0433 1.841 26.0913 0.889 24.9 0.559C22.7163 0 14.0003 0 14.0003 0C14.0003 0 5.28433 0 3.10033 0.559C1.90833 0.889 0.957333 1.841 0.627333 3.033C0.0683334 5.217 0 9.8 0 9.8S0.0683334 14.383 0.627333 16.567C0.957333 17.759 1.90833 18.711 3.10033 19.041C5.28433 19.6 14.0003 19.6 14.0003 19.6C14.0003 19.6 22.7163 19.6 24.9003 19.041C26.0923 18.711 27.0433 17.759 27.3733 16.567C27.9323 14.383 28.0003 9.8 28.0003 9.8S27.9323 5.217 27.3733 3.033ZM11.2003 14V5.6L18.4803 9.8L11.2003 14Z" />
                    </svg>
                  </div>
                </a>
              </Magnetic>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>{" "}
        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[100] xl:hidden bg-black flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <Logo size="sm" className="opacity-80" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3 bg-white/5 rounded-full text-white/70 hover:text-red-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <nav className="flex-grow flex flex-col justify-center px-10 space-y-8">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className="group flex items-center justify-between text-3xl font-black italic uppercase tracking-tighter text-white/60 hover:text-red-600 transition-all"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute -bottom-1 left-0 w-0 h-1 bg-red-600 transition-all group-hover:w-full" />
                      </span>
                      <ChevronRight
                        className="opacity-0 group-hover:opacity-40 transition-opacity"
                        size={24}
                      />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="p-10 border-t border-white/5 bg-white/[0.02]">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-6 text-center italic">
                  Únete a la Comunidad
                </p>
                <div className="flex flex-col gap-4">
                  {liveInfo.isLive ? (
                    <a
                      href={`https://www.youtube.com/watch?v=${liveInfo.videoId}`}
                      onClick={() => trackEvent("youtube_click", { location: "header", variant: "mobile_live" })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 bg-red-600 text-white font-black italic py-5 rounded-2xl animate-pulse shadow-[0_0_30px_rgba(220,38,38,0.4)]"
                    >
                      <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_10px_white]" />
                      <span>SINTONIZAR EN DIRECTO</span>
                    </a>
                  ) : (
                    <a
                      href="https://www.youtube.com/channel/UCSvr3yH2NkqlAHfuRDphz4g"
                      onClick={() => trackEvent("youtube_click", { location: "header", variant: "mobile_channel" })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-center gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl hover:border-red-600/50 transition-all"
                    >
                      <span className="text-white text-xs font-black uppercase tracking-widest italic group-hover:text-red-500 transition-colors">
                        Visitar Canal de YouTube
                      </span>
                      <svg
                        className="w-10 h-6 text-white/40 group-hover:text-red-600 transition-colors shrink-0"
                        viewBox="0 0 28 20"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M27.3733 3.033C27.0433 1.841 26.0913 0.889 24.9 0.559C22.7163 0 14.0003 0 14.0003 0C14.0003 0 5.28433 0 3.10033 0.559C1.90833 0.889 0.957333 1.841 0.627333 3.033C0.0683334 5.217 0 9.8 0 9.8S0.0683334 14.383 0.627333 16.567C0.957333 17.759 1.90833 18.711 3.10033 19.041C5.28433 19.6 14.0003 19.6 14.0003 19.6C14.0003 19.6 22.7163 19.6 24.9003 19.041C26.0923 18.711 27.0433 17.759 27.3733 16.567C27.9323 14.383 28.0003 9.8 28.0003 9.8S27.9323 5.217 27.3733 3.033ZM11.2003 14V5.6L18.4803 9.8L11.2003 14Z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
