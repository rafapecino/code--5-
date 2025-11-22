import Header from "@/All/components/header"
import { getLatestVideos } from "@/lib/youtube-service"
import { YouTubeVideos } from "@/All/components/youtube-videos"

export default async function VideosPage() {
  const videos = await getLatestVideos(12)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-20 md:pt-24">
        {/* Page Header */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 border-b border-border">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Todos los Vídeos</h1>
            <p className="text-lg text-muted-foreground">Acceso completo a todos nuestros análisis y coberturas de MotoGP</p>
          </div>
        </section>

        {/* Videos Grid */}
        <section className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            {videos && videos.length > 0 ? (
              <YouTubeVideos videos={videos} />
            ) : (
              <div className="text-center text-muted-foreground py-24">
                <p className="text-xl">No hay vídeos disponibles en este momento</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
