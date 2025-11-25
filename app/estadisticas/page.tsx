import Header from "@/All/components/header"
import { getChannelStats } from "@/lib/youtube-data"

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

export default async function EstadisticasPage() {
  const stats = await getChannelStats()

  const subscriberCount = parseInt(stats.subscriberCount || "0")
  const viewCount = parseInt(stats.viewCount || "0")
  const videoCount = parseInt(stats.videoCount || "0")

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-20 md:pt-24">
        {/* Page Header */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 border-b border-border">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Estadísticas del Canal</h1>
            <p className="text-lg text-muted-foreground">Datos en tiempo real de nuestro crecimiento y alcance</p>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="card-racing">
                <div className="text-5xl font-bold text-accent mb-4">{formatNumber(subscriberCount)}</div>
                <h3 className="text-2xl font-bold mb-2">Suscriptores</h3>
                <p className="text-muted-foreground">Una comunidad en constante crecimiento de apasionados por MotoGP</p>
              </div>

              <div className="card-racing">
                <div className="text-5xl font-bold text-primary mb-4">{formatNumber(viewCount)}</div>
                <h3 className="text-2xl font-bold mb-2">Visualizaciones</h3>
                <p className="text-muted-foreground">Total de vistas acumuladas en todos nuestros contenidos</p>
              </div>

              <div className="card-racing">
                <div className="text-5xl font-bold text-white mb-4">{videoCount}</div>
                <h3 className="text-2xl font-bold mb-2">Vídeos Publicados</h3>
.                <p className="text-muted-foreground">Contenido exhaustivo de análisis y cobertura de carreras</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
