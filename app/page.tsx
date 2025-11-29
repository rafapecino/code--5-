import { Footer } from "@/All/components/footer";
import Header from "@/All/components/header"
import Image from "next/image"
import Link from "next/link"
import { getChannelStats, getLatestVideos } from "@/lib/youtube-data"
import { YouTubeStats } from "@/All/components/youtube-stats"
import { YouTubeVideos } from "@/All/components/youtube-videos"
import { Logo } from "@/All/components/logo"
import { Youtube } from "lucide-react"
import { LatestVideo } from "@/All/components/latest-video"

export const revalidate = 3600;

export default async function Home() {
  const channelStats = await getChannelStats()
  const videos = await getLatestVideos(3)

  const getVideoUrl = (videoId: string) => `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-16 md:pt-20 lg:pt-20">
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          <Image
            src="/motogp-race-moment---index-.jpg"
            alt="Fondo de carrera de MotoGP"
            fill
            className="absolute z-0 object-cover"
            priority
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60 z-10"></div>

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
        <Footer />
      </main>
    </div>
  )
}
