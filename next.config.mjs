/**
 * Cabeceras de seguridad aplicadas a todas las respuestas.
 *
 * Antes la web solo enviaba HSTS (que lo pone Vercel). Sin estas cabeceras el
 * sitio se podía incrustar en un iframe ajeno para engañar a los visitantes
 * (clickjacking) y el navegador no tenía ninguna instrucción sobre de dónde
 * puede cargar scripts.
 *
 * Nota sobre la CSP: Next y GSAP necesitan 'unsafe-inline' y 'unsafe-eval'
 * para hidratar y animar, así que la política no es todo lo estricta que
 * podría ser. Aun así acota los dominios permitidos, que es lo que corta la
 * inyección de scripts de terceros.
 */
const csp = [
  "default-src 'self'",
  // Google Analytics, AdSense y el reproductor de YouTube.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://pagead2.googlesyndication.com https://www.google-analytics.com https://www.youtube.com https://s.ytimg.com https://vercel.live https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://i.ytimg.com https://yt3.ggpht.com https://flagcdn.com https://*.googleusercontent.com https://www.google-analytics.com https://pagead2.googlesyndication.com",
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://vitals.vercel-insights.com https://va.vercel-scripts.com",
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://googleads.g.doubleclick.net https://vercel.live",
  // Nadie puede meter esta web dentro de un iframe suyo.
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // No anunciamos la versión del framework: es información gratis para quien
  // busca objetivos con una vulnerabilidad concreta.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
