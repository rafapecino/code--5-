
import Link from "next/link";
import { Logo } from "./logo";


export function Footer() {
  return (
    <footer className="px-4 sm:px-6 lg:px-8 py-16 border-t border-border bg-secondary">
      <div className="max-w-7xl mx-auto text-center">
        <Logo size="sm" />
        <div className="flex justify-center gap-x-6 gap-y-4 flex-wrap mb-8 text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
          <Link href="/analisis-gp" className="hover:text-primary transition-colors">Análisis GP</Link>
          <Link href="/calendario" className="hover:text-primary transition-colors">Calendario</Link>
          <Link href="/clasificacion" className="hover:text-primary transition-colors">Clasificación</Link>
          <Link href="/el-paddock" className="hover:text-primary transition-colors">El Paddock</Link>
          <Link href="/privacy-policy" className="hover:text-primary transition-colors">Política de Privacidad</Link>
          <Link href="/terms" className="hover:text-primary transition-colors">Términos</Link>
        </div>
        {/* Placeholder for social icons */}
        <div className="flex justify-center gap-6 mb-8">
            <Link href="https://www.youtube.com/@pecinogp" aria-label="YouTube" className="text-muted-foreground hover:text-primary transition-colors">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 28 20"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M27.3733 3.033C27.0433 1.841 26.0913 0.889 24.9 0.559C22.7163 0 14.0003 0 14.0003 0C14.0003 0 5.28433 0 3.10033 0.559C1.90833 0.889 0.957333 1.841 0.627333 3.033C0.0683334 5.217 0 9.8 0 9.8S0.0683334 14.383 0.627333 16.567C0.957333 17.759 1.90833 18.711 3.10033 19.041C5.28433 19.6 14.0003 19.6 14.0003 19.6C14.0003 19.6 22.7163 19.6 24.9003 19.041C26.0923 18.711 27.0433 17.759 27.3733 16.567C27.9323 14.383 28.0003 9.8 28.0003 9.8S27.9323 5.217 27.3733 3.033ZM11.2003 14V5.6L18.4803 9.8L11.2003 14Z"
                  />
                </svg>
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
  )
}
