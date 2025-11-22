import Header from "@/All/components/header"
import { getDriverStandings } from "@/lib/motogp-service"

export default async function ClasificacionPage() {
  const pilotos = await getDriverStandings()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-20 md:pt-24">
        {/* Page Header */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 border-b border-border">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Clasificación del Campeonato</h1>
          </div>
        </section>

        {/* Standings Table */}
        <section className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Clasificación de Pilotos</h2>
            <div className="bg-secondary rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="p-4">Pos.</th>
                    <th className="p-4">Piloto</th>
                    <th className="p-4 hidden sm:table-cell">Equipo</th>
                    <th className="p-4 text-right">Puntos</th>
                  </tr>
                </thead>
                <tbody>
                  {pilotos.map((piloto) => (
                    <tr key={piloto.pos} className="border-t border-border">
                      <td className="p-4 font-bold">{piloto.pos}</td>
                      <td className="p-4 text-primary font-semibold">{piloto.driverName}</td>
                      <td className="p-4 hidden sm:table-cell text-muted-foreground">{piloto.teamName}</td>
                      <td className="p-4 text-right font-mono">{piloto.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
                        
                        </div>
                      </div>
                    </section>
                  </main>
                </div>
              )
            }
