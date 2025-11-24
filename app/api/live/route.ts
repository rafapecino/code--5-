
import { NextResponse } from 'next/server';

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
 * - Cache en Memoria: El resultado se guarda en caché durante 10 minutos para minimizar
 *   el consumo de la cuota de la API de YouTube. Peticiones sucesivas dentro de este
 *   periodo devolverán el valor cacheado sin llamar a la API.
 * 
 * - Manejo de Errores: Si la API de YouTube devuelve un error 403 (cuota excedida),
 *   el endpoint devolverá `{ isLive: false }` y registrará el error en la consola
 *   del servidor, evitando que la aplicación cliente falle.
 * 
 * - Validación: Si las variables de entorno no están configuradas, devolverá
 *   `{ isLive: false }` inmediatamente.
 */

// Interfaz para definir la estructura de nuestra caché
interface Cache {
  isLive: boolean;
  timestamp: number;
}

// Caché en memoria a nivel de módulo. Se mantiene mientras el proceso del servidor esté vivo.
let cache: Cache = {
  isLive: false,
  timestamp: 0,
};

// Duración de la caché en milisegundos (10 minutos)
const CACHE_DURATION = 10 * 60 * 1000;

export async function GET() {
  const now = Date.now();
  
  // 1. Validación Previa: Comprobar si las variables de entorno están configuradas.
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

  if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
    console.warn('ADVERTENCIA: YOUTUBE_API_KEY o YOUTUBE_CHANNEL_ID no están configuradas en .env.local. El estado "en vivo" no funcionará.');
    return NextResponse.json({ isLive: false });
  }

  // 2. Implementar Caché en Memoria: Si la caché es reciente, devolver el dato guardado.
  if (now - cache.timestamp < CACHE_DURATION) {
    // El dato cacheado es válido, lo devolvemos sin llamar a la API.
    return NextResponse.json({ isLive: cache.isLive });
  }

  // Si la caché ha expirado, procedemos a llamar a la API de YouTube.
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${YOUTUBE_CHANNEL_ID}&eventType=live&type=video&key=${YOUTUBE_API_KEY}`;

  try {
    const response = await fetch(url, { next: { revalidate: 0 } }); // No usar la caché de fetch

    // 3. Manejo de Errores Silencioso (Cuota Excedida)
    if (!response.ok) {
      if (response.status === 403) {
        console.error('Error 403: Se ha excedido la cuota de la API de YouTube. Sirviendo `isLive: false` como fallback y cacheando el resultado para evitar más llamadas.');
        // Actualizamos la caché para no volver a intentarlo hasta que expire el tiempo
        cache = { isLive: false, timestamp: now };
        return NextResponse.json({ isLive: false });
      }
      // Para otros errores, lanzamos una excepción para que sea capturada por el catch block.
      throw new Error(`La API de YouTube respondió con el estado: ${response.status}`);
    }

    const data = await response.json();
    
    // La API devuelve un array 'items'. Si tiene elementos, es que hay un directo activo.
    const isCurrentlyLive = data.items && data.items.length > 0;

    // Actualizamos la caché con el nuevo resultado y la marca de tiempo.
    cache = { isLive: isCurrentlyLive, timestamp: now };

    return NextResponse.json({ isLive: isCurrentlyLive });

  } catch (error) {
    console.error("Error al intentar contactar con la API de YouTube:", error);
    
    // En caso de cualquier otro error (red, parsing, etc.), devolvemos false para no romper el cliente.
    // También actualizamos la caché para evitar reintentos fallidos constantes.
    cache = { isLive: false, timestamp: now };
    
    return NextResponse.json({ isLive: false });
  }
}
