import Header from "@/All/components/header"

export default function SobreNosotrosPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-20 md:pt-24">
        {/* Page Header */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 border-b border-border">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Sobre Nosotros</h1>
            <p className="text-lg text-muted-foreground">Conoce más sobre nuestro canal y misión</p>
          </div>
        </section>

        {/* Content */}
        <section className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              <div className="card-racing">
                <h2 className="text-2xl font-bold mb-6 text-accent">Misión</h2>
                <p className="text-foreground leading-relaxed">
                  Nuestro objetivo es proporcionar análisis detallado y cobertura profesional de los eventos de
                  carreras, combinando datos en tiempo real con insights profundos para nuestra comunidad de
                  aficionados.
                </p>
              </div>

              <div className="card-racing">
                <h2 className="text-2xl font-bold mb-6 text-accent">Quiénes Somos</h2>
                <p className="text-foreground leading-relaxed">
                  Un equipo de periodistas, analistas y productores especializados en deportes de motor. Con más de 10
                  años de experiencia, hemos construido una comunidad de más de 245k suscriptores que confían en
                  nosotros para obtener las mejores análisis y coberturas.
                </p>
              </div>

              <div className="card-racing">
                <h2 className="text-2xl font-bold mb-6 text-accent">Nuestros Valores</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { title: "Precisión", description: "Datos exactos y verificados" },
                    { title: "Transparencia", description: "Información clara y honesta" },
                    { title: "Pasión", description: "Amor por el deporte motor" },
                  ].map((value, index) => (
                    <div key={index} className="bg-secondary rounded-lg p-4 text-center">
                      <h3 className="font-bold text-accent mb-2">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
