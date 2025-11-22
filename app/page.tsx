import Header from "@/All/components/header"
import Image from "next/image"
import Link from "next/link"
import { getChannelStats, getLatestVideos } from "@/lib/youtube-service"
import { YouTubeStats } from "@/All/components/youtube-stats"
import { YouTubeVideos } from "@/All/components/youtube-videos"

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

        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-background border-t border-border">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-balance">La Diferencia PecinoGP</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Análisis Técnicos Profundos",
                  description:
                    "Desglose detallado de estrategias de carrera, configuración de motos y movimientos tácticos de los pilotos.",
                  icon: "⚙️",
                },
                {
                  title: "Directos Comentados en Vivo",
                  description:
                    "Cobertura exclusiva de cada Gran Premio con análisis en tiempo real y comentarios expertos.",
                  icon: "🔴",
                },
                {
                  title: "Cobertura Completa del Campeonato",
                  description: "MotoGP, Moto2, Moto3 y motociclismo mundial en un solo lugar con toda la pasión.",
                  icon: "🏍️",
                },
              ].map((feature, index) => (
                <div key={index} className="bg-secondary p-8 rounded-lg border border-border hover:border-primary transition-colors group text-center">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform mx-auto">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-primary">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
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
            <p className="text-2xl font-bold text-foreground mb-4">PecinoGP</p>
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
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64 21.78,8.27 21.84,9.07C21.91,9.87 21.94,10.56 21.94,11.16L22,12C22,14.19 21.84,15.8 21.56,16.83C21.31,17.73 20.73,18.31 19.83,18.56C19.36,18.69 18.73,18.78 17.93,18.84C17.13,18.91 16.44,18.94 15.84,18.94L15,19C12.81,19 11.2,18.84 10.17,18.56C9.27,18.31 8.69,17.73 8.44,16.83C8.31,16.36 8.22,15.73 8.16,14.93C8.09,14.13 8.06,13.44 8.06,12.84L8,12C8,9.81 8.16,8.2 8.44,7.17C8.69,6.27 9.27,5.69 10.17,5.44C10.64,5.31 11.27,5.22 12.07,5.16C12.87,5.09 13.56,5.06 14.16,5.06L15,5C17.19,5 18.8,5.16 19.83,5.44C20.73,5.69 21.31,6.27 21.56,7.17Z" /></svg>
                </Link>
                <Link href="https://open.spotify.com/show/4asUu5yNVnBAyAnmfq1xDz" aria-label="Spotify" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.19 14.32c-.2.32-.6.43-.92.23-.22-.14-.54-.45-.54-.45s-.02.02-.04.01c-1.21-.74-2.88-1.21-4.73-1.21-1.63 0-3.17.39-4.5.98-.32.14-.68-.02-.82-.34-.14-.32.02-.68.34-.82.02-.01.04-.02.06-.03 1.46-.64 3.1-.98 4.92-.98 2.03 0 3.88.52 5.25 1.35.32.2.43.6.23.92zm1.2-2.53c-.25.4-.75.53-1.15.28-1.42-.87-3.33-1.42-5.24-1.42-1.7 0-3.33.45-4.68 1.23-.4.25-.9.09-1.15-.31-.25-.4-.09-.9.31-1.15.03-.02.06-.03.09-.05 1.54-.88 3.36-1.36 5.43-1.36 2.2 0 4.29.53 5.89 1.53.4.26.53.76.28 1.15zM17.88 11c-.3.48-.9.62-1.38.32-1.64-1-3.8-1.63-6-1.63-1.93 0-3.73.45-5.12 1.25-.48.28-1.08.1-1.36-.38-.28-.48-.1-1.08.38-1.36.02-.01.05-.02.07-.03C5.9 8.3 7.88 7.75 10.5 7.75c2.43 0 4.8.6 6.68 1.75.48.3.62.9.32 1.38z"/></svg>
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
