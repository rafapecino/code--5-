import "server-only";
import {
  getVideoUrl,
  getVideoEmbedUrl,
  formatNumber,
  formatDate,
} from "./youtube-format";

// Se re-exportan para no romper a quien ya importaba de aquí desde servidor.
export type {
  YouTubeChannel,
  YouTubeVideo,
  LiveStream,
} from "./youtube-format";
export { getVideoUrl, getVideoEmbedUrl, formatNumber, formatDate };

/**
 * Claves de la API de YouTube. Se prefieren las variables SIN prefijo
 * NEXT_PUBLIC_: cualquier variable NEXT_PUBLIC_ acaba incrustada en el
 * JavaScript que descarga el navegador, y una clave de API no debe salir
 * nunca del servidor. Las NEXT_PUBLIC_ quedan solo como respaldo temporal
 * mientras se renombran en Vercel.
 */
const KEYS = [
  process.env["YOUTUBE_API_KEY"] ?? process.env["NEXT_PUBLIC_YOUTUBE_API_KEY"],
  process.env["YOUTUBE_API_KEY_2"] ??
    process.env["NEXT_PUBLIC_YOUTUBE_API_KEY_2"],
].filter((k): k is string => !!k && k.length > 10);

const CHANNEL_ID =
  process.env.YOUTUBE_CHANNEL_ID ?? process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;

const FALLBACK_LIVE_STATUS: LiveStream = {
  isLive: false,
};

async function fetchWithRotation(baseUrl: string) {
  let lastError: any = new Error("No API keys provided.");

  if (KEYS.length === 0) {
    throw lastError;
  }

  for (let i = 0; i < KEYS.length; i++) {
    const apiKey = KEYS[i];
    const url = `${baseUrl}&key=${apiKey}`;

    try {
      console.log(
        `[YouTube API] Intentando con Key #${i + 1} (${apiKey.substring(0, 4)}...)`,
      );

      const res = await fetch(url, { next: { revalidate: 60 } });

      if (res.ok) {
        return await res.json();
      }

      if (res.status === 403) {
        const errorData = await res.json();
        const message =
          errorData.error?.message || "Quota Exceeded or Access Denied";
        console.error(`[YouTube API] Key #${i + 1} falló (403):`, message);
        throw new Error("QUOTA_EXCEEDED");
      }

      throw new Error(`HTTP error ${res.status}`);
    } catch (err) {
      lastError = err;
      console.warn(
        `[YouTube API] Error con Key #${i + 1}. Saltando a la siguiente...`,
      );
      continue;
    }
  }

  console.error("[YouTube API] Todas las claves fallaron.");
  throw lastError;
}

export async function getLiveStream(): Promise<LiveStream> {
  if (!CHANNEL_ID) {
    console.warn(
      "YouTube Channel ID not configured, using fallback data for live status",
    );
    return FALLBACK_LIVE_STATUS;
  }

  const baseUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video`;

  try {
    const data = await fetchWithRotation(baseUrl);

    if (data.items && data.items.length > 0) {
      return {
        isLive: true,
        videoId: data.items[0].id.videoId,
      };
    }

    return { isLive: false };
  } catch (error) {
    console.error(
      "Error final al obtener el estado en vivo de YouTube:",
      error,
    );
    return FALLBACK_LIVE_STATUS;
  }
}


