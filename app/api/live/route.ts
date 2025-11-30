import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * README:
 * Este endpoint comprueba si un canal de YouTube está en directo.
 * 
 * --- REQUISITOS DE CONFIGURACIÓN ---
 * Para que este endpoint funcione, necesitas añadir las siguientes variables
 * de entorno a tu archivo `.env.local` en la raíz del proyecto:
 *
 * 1. YOUTUBE_API_KEY: Tu clave de API de Google Cloud para la API de YouTube Data v3.
 *    Ejemplo: YOUTUBE_API_KEY="AIzaSyA...your...api...key..."
 *
 * 2. YOUTUBE_CHANNEL_ID: El ID del canal de YouTube que quieres monitorizar.
 *    Ejemplo: YOUTUBE_CHANNEL_ID="UC_z1h_j2c8-2c_3...your...channel...id"
 * 
 * --- FUNCIONAMIENTO ---
 * - Renderizado Dinámico: Gracias a `export const dynamic = 'force-dynamic'`, esta ruta
 *   se ejecuta en cada petición, garantizando datos en tiempo real.
 * 
 * - Manejo de Errores: Si la API de YouTube devuelve un error 403 (cuota excedida),
 *   el endpoint devolverá `{ isLive: false }` y registrará el error en la consola
 *   del servidor, evitando que la aplicación cliente falle.
 * 
 * - Validación: Si las variables de entorno no están configuradas, devolverá
 *   `{ isLive: false }` inmediatamente.
 */
export async function GET() {
  // 1. Validación Previa: Comprobar si las variables de entorno están configuradas.
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

  if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
    console.warn('ADVERTENCIA: YOUTUBE_API_KEY o YOUTUBE_CHANNEL_ID no están configuradas en .env.local. El estado "en vivo" no funcionará.');
    return NextResponse.json({ isLive: false });
  }

  // Se procede a llamar a la API de YouTube en cada petición.
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${YOUTUBE_CHANNEL_ID}&eventType=live&type=video&key=${YOUTUBE_API_KEY}`;

  try {
    const response = await fetch(url, { cache: 'no-store' }); // Usar 'no-store' para confirmar que no hay caché de fetch

    // 3. Manejo de Errores Silencioso (Cuota Excedida)
    if (!response.ok) {
      if (response.status === 403) {
        console.error('Error 403: Se ha excedido la cuota de la API de YouTube. Sirviendo `isLive: false` como fallback.');
        return NextResponse.json({ isLive: false });
      }
      // Para otros errores, lanzamos una excepción para que sea capturada por el catch block.
      throw new Error(`La API de YouTube respondió con el estado: ${response.status}`);
    }

    const data = await response.json();
    
    // La API devuelve un array 'items'. Si tiene elementos, es que hay un directo activo.
    const isCurrentlyLive = data.items && data.items.length > 0;

    return NextResponse.json({ isLive: isCurrentlyLive });

  } catch (error) {
    console.error("Error al intentar contactar con la API de YouTube:", error);
    
    // En caso de cualquier otro error (red, parsing, etc.), devolvemos false para no romper el cliente.
    return NextResponse.json({ isLive: false });
  }
}
