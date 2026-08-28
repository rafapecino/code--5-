/**
 * Tipos y utilidades de YouTube SEGUROS PARA EL NAVEGADOR.
 *
 * Este módulo existe por un motivo de seguridad concreto: `lib/youtube-service`
 * lee las claves de la API en la primera línea, y siete componentes de cliente
 * lo importaban solo para usar `formatDate`, `getVideoUrl` y los tipos. Al
 * importarlo desde el cliente, Next incrustaba la clave en el paquete
 * JavaScript que descarga cualquier visitante.
 *
 * Regla: si un componente lleva "use client", importa de aquí. Nunca de
 * `lib/youtube-service`, que es solo de servidor.
 */

export interface YouTubeChannel {
  subscriberCount: string;
  viewCount: string;
  videoCount: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: string;
  channelTitle: string;
  isLive?: boolean;
  error?: string;
}

export interface LiveStream {
  isLive: boolean;
  videoId?: string;
}

export function getVideoUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function getVideoEmbedUrl(videoId: string): string {
  // Dominio de privacidad mejorada: no fija cookies hasta que se reproduce.
  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}

export function formatNumber(num: string): string {
  const n = parseInt(num);
  if (n >= 1000000) {
    return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (n >= 1000) {
    return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return n.toString();
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
