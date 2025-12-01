import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "PecinoGP - Análisis de MotoGP",
  description: "Tu comunidad de análisis técnicos, directos y cobertura exclusiva del campeonato mundial de MotoGP.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
