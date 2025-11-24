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
      style={{ backgroundColor: 'rgb(26, 26, 26)' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-border shadow-lg`}
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
                className="hidden sm:inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-4 sm:px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span className="hidden sm:inline">Ver en YouTube</span>
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
                  className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-4 py-2 rounded-lg transition-all w-full"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  <span>Ver en YouTube</span>
                </a>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
