"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Logo } from "./logo"
import { getLiveStream, LiveStream } from "@/lib/youtube-service"

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/analisis-gp", label: "Análisis GP" },
  { href: "/calendario", label: "Calendario" },
  { href: "/clasificacion", label: "Clasificación" },
  { href: "/el-paddock", label: "El Paddock" },
]

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [liveInfo, setLiveInfo] = useState<LiveStream>({isLive: false});
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0
      setScrolled(isScrolled)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    async function fetchLiveStatus() {
      const status = await getLiveStream();
      setLiveInfo(status);
    }
    fetchLiveStatus();
    const interval = setInterval(fetchLiveStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-border shadow-lg ${
        scrolled ? "bg-slate-800/50 backdrop-blur-sm" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="shrink-0 group transition-opacity duration-300 hover:opacity-90">
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-white hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="flex items-center gap-2 sm:gap-4">
            {liveInfo.isLive ? (
               <a
                href={`https://www.youtube.com/watch?v=${liveInfo.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 sm:px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105 animate-pulse"
              >
                <span className="w-3 h-3 bg-white rounded-full"></span>
                <span className="hidden sm:inline">EN DIRECTO</span>
              </a>
            ) : (
              <a
                href="https://www.youtube.com/channel/UCSvr3yH2NkqlAHfuRDphz4g"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 sm:px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105"
              >
                <svg
                  className="w-6 h-auto"
                  viewBox="0 0 28 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M27.3733 3.033C27.0433 1.841 26.0913 0.889 24.9 0.559C22.7163 0 14.0003 0 14.0003 0C14.0003 0 5.28433 0 3.10033 0.559C1.90833 0.889 0.957333 1.841 0.627333 3.033C0.0683334 5.217 0 9.8 0 9.8S0.0683334 14.383 0.627333 16.567C0.957333 17.759 1.90833 18.711 3.10033 19.041C5.28433 19.6 14.0003 19.6 14.0003 19.6C14.0003 19.6 22.7163 19.6 24.9003 19.041C26.0923 18.711 27.0433 17.759 27.3733 16.567C27.9323 14.383 28.0003 9.8 28.0003 9.8S27.9323 5.217 27.3733 3.033ZM11.2003 14V5.6L18.4803 9.8L11.2003 14Z"
                  fill="white"
                  />
                </svg>
                <span className="hidden sm:inline">YouTube</span>
              </a>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-border bg-background">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 py-3 border-t border-border">
              {liveInfo.isLive ? (
                <a
                  href={`https://www.youtube.com/watch?v=${liveInfo.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg transition-all w-full animate-pulse"
                >
                  <span className="w-3 h-3 bg-white rounded-full"></span>
                  <span>EN DIRECTO</span>
                </a>
              ) : (
                <a
                  href="https://www.youtube.com/channel/UCSvr3yH2NkqlAHfuRDphz4g"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg transition-all w-full"
                >
                  <svg
                    className="w-6 h-auto"
                    viewBox="0 0 28 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M27.3733 3.033C27.0433 1.841 26.0913 0.889 24.9 0.559C22.7163 0 14.0003 0 14.0003 0C14.0003 0 5.28433 0 3.10033 0.559C1.90833 0.889 0.957333 1.841 0.627333 3.033C0.0683334 5.217 0 9.8 0 9.8S0.0683334 14.383 0.627333 16.567C0.957333 17.759 1.90833 18.711 3.10033 19.041C5.28433 19.6 14.0003 19.6 14.0003 19.6C14.0003 19.6 22.7163 19.6 24.9003 19.041C26.0923 18.711 27.0433 17.759 27.3733 16.567C27.9323 14.383 28.0003 9.8 28.0003 9.8S27.9323 5.217 27.3733 3.033ZM11.2003 14V5.6L18.4803 9.8L11.2003 14Z"
                    fill="white"
                    />
                  </svg>
                  <span>YouTube</span>
                </a>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
