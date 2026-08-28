import "server-only";

/**
 * Limitador de peticiones por IP, en memoria.
 *
 * Sirve para frenar el abuso evidente: inundar el formulario de preguntas,
 * repetir votos en bucle o probar tokens de administración a lo bruto. No es
 * infalible —cada instancia sin servidor tiene su propia memoria y se reinicia
 * en frío—, pero convierte un ataque de un script trivial en algo que ya
 * requiere esfuerzo, y no añade ninguna dependencia ni coste.
 *
 * Para algo más serio haría falta un almacén compartido (Redis/Upstash) o el
 * cortafuegos de Vercel.
 */
type Registro = { golpes: number; reinicioEn: number };

const memoria = new Map<string, Registro>();

/** Evita que el mapa crezca sin límite si llegan muchas IPs distintas. */
function purgar(ahora: number) {
  if (memoria.size < 5000) return;
  for (const [k, v] of memoria) {
    if (v.reinicioEn <= ahora) memoria.delete(k);
  }
}

export function comprobarLimite(
  clave: string,
  maximo: number,
  ventanaSegundos: number,
): { permitido: boolean; reintentarEn: number } {
  const ahora = Date.now();
  purgar(ahora);

  const actual = memoria.get(clave);
  if (!actual || actual.reinicioEn <= ahora) {
    memoria.set(clave, { golpes: 1, reinicioEn: ahora + ventanaSegundos * 1000 });
    return { permitido: true, reintentarEn: 0 };
  }

  actual.golpes += 1;
  if (actual.golpes > maximo) {
    return {
      permitido: false,
      reintentarEn: Math.ceil((actual.reinicioEn - ahora) / 1000),
    };
  }
  return { permitido: true, reintentarEn: 0 };
}

/**
 * IP del visitante. En Vercel llega en x-forwarded-for, donde el primer valor
 * es el cliente real y el resto son proxies intermedios.
 */
export function ipDe(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "desconocida";
}
