import Header from "@/All/components/header"

export default function ProximoGPPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-20 md:pt-24">
        {/* Page Header */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 border-b border-border">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Próximo Gran Premio</h1>
            <p className="text-lg text-muted-foreground">Información y análisis del próximo evento de MotoGP</p>
          </div>
        </section>

        {/* Content */}
        <section className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="card-racing text-center py-16">
              <h2 className="text-2xl font-bold mb-4 text-accent">Próximamente</h2>
              <p className="text-muted-foreground">
                Estamos preparando información detallada sobre el próximo Gran Premio. Vuelve pronto para conocer:
              </p>
              <ul className="mt-6 space-y-2 text-left inline-block">
                <li>🏁 Ubicación y fecha de la carrera</li>
                <li>🏍️ Análisis de los pilotos participantes</li>
                <li>📊 Estadísticas y récords del circuito</li>
                <li>🎙️ Previsiones y predicciones de expertos</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
