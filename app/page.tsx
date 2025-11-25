import Header from "@/All/components/header"
import Image from "next/image"
import Link from "next/link"
import { getChannelStats, getLatestVideos } from "@/lib/youtube-data"
import { YouTubeStats } from "@/All/components/youtube-stats"
import { YouTubeVideos } from "@/All/components/youtube-videos"
import { Logo } from "@/All/components/logo"
import { Youtube } from "lucide-react"
import { LatestVideo } from "@/All/components/latest-video"

export default async function Home() {
  const channelStats = await getChannelStats()
  const videos = await getLatestVideos(3)

  const getVideoUrl = (videoId: string) => `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-16 md:pt-20 lg:pt-20">
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* 1. Video de Fondo (o imagen estática como fallback) */}
          {/* Descomenta el video si tienes un clip corto y optimizado en /public/videos/hero-loop.mp4 */}
          {/* <video
            playsInline
            autoPlay
            muted
            loop
            className="absolute z-0 w-auto min-w-full min-h-full max-w-none"
          >
            <source src="/videos/hero-loop.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video> */}
          
          {/* Fallback con imagen y mejor posicionamiento */}
          <Image
            src="/motogp-race-moment---index-.jpg"
            alt="Piloto de MotoGP en plena carrera"
            layout="fill"
            objectFit="cover"
            objectPosition="center 40%" // Ajusta el encuadre para no cortar la acción
            className="absolute z-0"
            priority
          />

          {/* 2. Gradiente de Contraste Mejorado */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/70 to-transparent z-10"></div>

          {/* 3. Contenido del Hero con Tipografía y Estructura Optimizada */}
          <div className="relative z-20 max-w-4xl mx-auto px-4 text-center flex flex-col items-center justify-center animate-fade-in-up">
            <h1 
              className="text-4xl md:text-6xl font-bold text-white mb-4"
            >
              Análisis y Pasión por MotoGP
            </h1>
            <p 
              className="text-lg md:text-xl text-[#F5F5F5]/90 max-w-2xl mx-auto mb-10"
            >
              Análisis técnicos profundos, directos comentados y cobertura exclusiva del campeonato mundial.
            </p>

            {/* 4. CTAs con Diseño Coherente */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href={getVideoUrl(videos[0].id)}
                className="inline-block bg-[#E60000] text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-red-700 transition-transform hover:scale-105"
              >
                Ver Último Análisis
              </Link>
              <Link
                href="/analisis-gp"
                className="inline-block bg-transparent border-2 border-[#F5F5F5] text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-white hover:text-[#1A1A1A] transition-colors"
              >
                Todos los Análisis
              </Link>
            </div>

            <div className="mt-12">
              <YouTubeStats stats={channelStats} />
            </div>
          </div>
        </section>

        <section className="flex justify-center px-4 py-20 border-t sm:px-6 lg:px-8 bg-background border-border">
            <div className="w-full max-w-2xl">
                <LatestVideo latestVideo={videos[0] || null} />
            </div>
        </section>

        {/* Latest Content Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 border-t border-border bg-secondary/20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-balance">Últimos Análisis y Vídeos</h2>
              <Link href="/analisis-gp" className="border border-primary text-primary font-semibold py-2 px-4 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors">
                Ver Todos los Análisis
              </Link>
            </div>

            {videos && videos.length > 0 ? (
              <YouTubeVideos videos={videos} />
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <p>No hay vídeos disponibles en este momento</p>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="px-4 sm:px-6 lg:px-8 py-16 border-t border-border bg-secondary">
          <div className="max-w-7xl mx-auto text-center">
            <Logo size="sm" />
            <div className="flex justify-center gap-x-6 gap-y-4 flex-wrap mb-8 text-muted-foreground">
              <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
              <Link href="/analisis-gp" className="hover:text-primary transition-colors">Análisis GP</Link>
              <Link href="/calendario" className="hover:text-primary transition-colors">Calendario</Link>
              <Link href="/clasificacion" className="hover:text-primary transition-colors">Clasificación</Link>
              <Link href="/el-paddock" className="hover:text-primary transition-colors">El Paddock</Link>
            </div>
            {/* Placeholder for social icons */}
            <div className="flex justify-center gap-6 mb-8">
                <Link href="https://www.youtube.com/@pecinogp" aria-label="YouTube" className="text-muted-foreground hover:text-primary transition-colors">
                    <Youtube className="h-6 w-6" />
                </Link>
                <Link href="https://open.spotify.com/show/4asUu5yNVnBAyAnmfq1xDz" aria-label="Spotify" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg fill="currentColor" className="h-6 w-6" viewBox="0 0 16 16"> <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.669 11.538a.5.5 0 0 1-.686.165c-1.879-1.147-4.243-1.407-7.028-.77a.499.499 0 0 1-.222-.973c3.048-.696 5.662-.397 7.77.892a.5.5 0 0 1 .166.686m.979-2.178a.624.624 0 0 1-.858.205c-2.15-1.321-5.428-1.704-7.972-.932a.625.625 0 0 1-.362-1.194c2.905-.881 6.517-.454 8.986 1.063a.624.624 0 0 1 .206.858m.084-2.268C10.154 5.56 5.9 5.419 3.438 6.166a.748.748 0 1 1-.434-1.432c2.825-.857 7.523-.692 10.492 1.07a.747.747 0 1 1-.764 1.288"/> </svg>
                </Link>
                <Link href="https://www.instagram.com/pecinogp/" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.2,5.2 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.2,5.2 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" /></svg>
                </Link>
            </div>
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} PecinoGP. Todos los derechos reservados.
            </p>
            <p className="mt-2 text-xs text-muted-foreground/50">
              Construido con Next.js, TypeScript y Tailwind CSS
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}
