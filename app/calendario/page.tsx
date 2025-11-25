import Header from "@/All/components/header"

export default function CalendarioPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-20 md:pt-24">
        {/* Page Header */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 border-b border-border">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Calendario 2026</h1>
            <p className="text-lg text-muted-foreground">El calendario completo de la temporada de MotoGP, Moto2 y Moto3.</p>
          </div>
        </section>

        {/* Content */}
        <section className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-secondary p-8 rounded-lg text-center">
              <h2 className="text-2xl font-bold mb-4 text-primary">Próximamente</h2>
              <p className="text-muted-foreground">
                Estamos trabajando en un calendario interactivo para la temporada. Vuelve pronto para ver:
              </p>
              <ul className="mt-6 space-y-2 text-left inline-block">
                <li>📅 Fechas y horarios de todas las carreras.</li>
                <li>📍 Información detallada de cada circuito.</li>
                <li>🏆 Resultados de las carreras pasadas.</li>
                <li> countdown para el próximo Gran Premio.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
