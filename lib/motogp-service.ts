// MotoGP Data Service - Integración con TheSportsDB API

const MOTOGP_API_KEY = "123" // Tu clave de API
const MOTOGP_LEAGUE_ID = "4400" // ID para MotoGP
const CURRENT_SEASON = "2026" // Temporada actual

export interface DriverStanding {
  pos: string
  driverName: string
  teamName: string
  points: string
  wins: string
  podiums: string
}

// Datos de fallback para desarrollo si la API falla
const FALLBACK_STANDINGS: DriverStanding[] = [
  { pos: "1", driverName: "M. Marquez", teamName: "Ducati", points: "545", wins: "11", podiums: "15" },
  { pos: "2", driverName: "A. Marquez", teamName: "Gresini Racing", points: "467", wins: "3", podiums: "12" },
  { pos: "3", driverName: "M. Bezzecchi", teamName: "Aprilia", points: "353", wins: "3", podiums: "9" },
  { pos: "4", driverName: "P. Acosta", teamName: "Red Bull KTM Factory Racing", points: "307", wins: "0", podiums: "5" },
  { pos: "5", driverName: "F. Bagnaia", teamName: "Ducati", points: "288", wins: "2", podiums: "8" },
]

export async function getDriverStandings(): Promise<DriverStanding[]> {
  // API no funciona, usamos datos de fallback como solicitó el usuario.
  return FALLBACK_STANDINGS;
}
