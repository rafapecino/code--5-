import Header from "@/All/components/header";
import { QAndA } from "@/All/components/q-and-a";
import { QuickPoll } from "@/All/components/quick-poll";

export default function ElPaddockPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-20 md:pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-primary mb-4">
              El Paddock Interactivo
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Tu espacio para participar, preguntar y opinar. Envía tus preguntas para el próximo programa y vota en la encuesta de la semana.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <QAndA />
            </div>
            <div className="lg:col-span-1">
              <QuickPoll />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
