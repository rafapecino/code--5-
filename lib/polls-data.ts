/**
 * Encuestas abiertas. Es la única fuente de verdad: la usan tanto
 * `/api/polls` (para mostrarlas y contar votos) como `/api/vote` (para
 * validar que la opción votada existe de verdad).
 *
 * Para cerrar una encuesta y abrir otra, sube el `id`: los votos viven en la
 * tabla `votes` referenciados por `poll_id`, así que el recuento arranca de
 * cero y los votos antiguos se conservan como histórico.
 *
 * Historial:
 *   id 1 — cerrada (Márquez / Bagnaia / Martín / Acosta), 457 votos.
 */
export const ENCUESTAS_ACTIVAS = [
  {
    id: 2,
    question: "¿Quién ganará el campeonato 2026?",
    options: [
      { id: 1, text: "Jorge Martín", votes: 0 },
      { id: 2, text: "Ai Ogura", votes: 0 },
      { id: 3, text: "Marc Márquez", votes: 0 },
      { id: 4, text: "Di Giannantonio", votes: 0 },
      { id: 5, text: "Raúl Fernández", votes: 0 },
    ],
  },
] as const;
