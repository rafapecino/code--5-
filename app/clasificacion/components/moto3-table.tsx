
const moto3Standings = [
  { pos: 1, driverName: "José Antonio Rueda", teamName: "Red Bull KTM Ajo", points: "365" },
  { pos: 2, driverName: "Ángel Piqueras", teamName: "Leopard Racing", points: "281" },
  { pos: 3, driverName: "Máximo Quiles", teamName: "Red Bull KTM Ajo", points: "274" },
  { pos: 4, driverName: "Álvaro Carpe", teamName: "Rivacold Snipers Team", points: "215" },
  { pos: 5, driverName: "David Muñoz", teamName: "BOE Motorsports", points: "197" },
];

const getTeamColor = (teamName: string) => {
  const lowerTeamName = teamName.toLowerCase();
  if (lowerTeamName.includes("red bull ktm ajo")) return "border-l-blue-800";
  if (lowerTeamName.includes("leopard racing")) return "border-l-cyan-500";
  if (lowerTeamName.includes("rivacold snipers")) return "border-l-green-500";
  if (lowerTeamName.includes("boe motorsports")) return "border-l-red-500";
  return "border-l-gray-600";
};

const getTeamBgColor = (teamName: string) => {
  const lowerTeamName = teamName.toLowerCase();
  if (lowerTeamName.includes("red bull ktm ajo")) return "bg-blue-800";
  if (lowerTeamName.includes("leopard racing")) return "bg-cyan-500";
  if (lowerTeamName.includes("rivacold snipers")) return "bg-green-500";
  if (lowerTeamName.includes("boe motorsports")) return "bg-red-500";
  return "bg-gray-600";
};

const getPositionColor = (position: number) => {
  return "text-foreground";
};

export default function Moto3Table() {
  const leaderPoints = moto3Standings[0]?.points ? Number(moto3Standings[0].points) : 0;

  return (
    <div className="bg-secondary/30 rounded-lg overflow-hidden shadow-lg backdrop-blur-sm">
      <table className="w-full text-left">
        <thead className="bg-secondary/50">
          <tr>
            <th className="p-4 w-16 text-center">Pos.</th>
            <th className="p-4">Piloto</th>
            <th className="p-4 hidden sm:table-cell">Equipo</th>
            <th className="p-4 w-32 text-right">Puntos</th>
          </tr>
        </thead>
        <tbody>
          {moto3Standings.map((piloto) => {
            const pilotPoints = Number(piloto.points);
            const pointsPercentage = leaderPoints > 0 ? (pilotPoints / leaderPoints) * 100 : 0;

            return (
              <tr
                key={piloto.pos}
                className={`border-t border-border/50 transition-colors hover:bg-slate-800/50 ${getTeamColor(
                  piloto.teamName
                )} border-l-4`}
              >
                <td className={`p-4 text-center font-bold text-lg ${getPositionColor(piloto.pos)}`}>
                  {piloto.pos}
                </td>
                <td className="p-4 text-primary font-semibold">{piloto.driverName}</td>
                <td className="p-4 hidden sm:table-cell text-muted-foreground">{piloto.teamName}</td>
                <td className="p-4 text-right">
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-lg">{piloto.points}</span>
                    <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                      <div
                        className={`${getTeamBgColor(piloto.teamName)} h-1.5 rounded-full`}
                        style={{ width: `${pointsPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
