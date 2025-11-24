import Header from "@/All/components/header"
import Image from "next/image"
import Link from "next/link"
import { getChannelStats, getLatestVideos } from "@/lib/youtube-service"
import { YouTubeVideos } from "@/All/components/youtube-videos"
import { Logo } from "@/All/components/logo"
import { HeroSection } from "@/All/components/hero-section"

export default async function Home() {
  const channelStats = await getChannelStats()
  const videos = await getLatestVideos(3)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-16 md:pt-20 lg:pt-20">
        <HeroSection video={videos[0]} />

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
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64 21.78,8.27 21.84,9.07C21.91,9.87 21.94,10.56 21.94,11.16L22,12C22,14.19 21.84,15.8 21.56,16.83C21.31,17.73 20.73,18.31 19.83,18.56C19.36,18.69 18.73,18.78 17.93,18.84C17.13,18.91 16.44,18.94 15.84,18.94L15,19C12.81,19 11.2,18.84 10.17,18.56C9.27,18.31 8.69,17.73 8.44,16.83C8.31,16.36 8.22,15.73 8.16,14.93C8.09,14.13 8.06,13.44 8.06,12.84L8,12C8,9.81 8.16,8.2 8.44,7.17C8.69,6.27 9.27,5.69 10.17,5.44C10.64,5.31 11.27,5.22 12.07,5.16C12.87,5.09 13.56,5.06 14.16,5.06L15,5C17.19,5 18.8,5.16 19.83,5.44C20.73,5.69 21.31,6.27 21.56,7.17Z" /></svg>
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