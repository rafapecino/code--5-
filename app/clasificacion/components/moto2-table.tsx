
const moto2Standings = [
  { pos: 1, driverName: "Diogo Moreira", teamName: "Italtrans Racing Team", points: "286" },
  { pos: 2, driverName: "Manuel González", teamName: "QJMOTOR Gresini Moto2", points: "257" },
  { pos: 3, driverName: "Barry Baltus", teamName: "Fieten Olie Racing GP", points: "232" },
  { pos: 4, driverName: "Arón Canet", teamName: "Fantic Racing", points: "227" },
  { pos: 5, driverName: "Jake Dixon", teamName: "CFMOTO Inde Aspar Team", points: "224" },
];

const getTeamColor = (teamName: string) => {
  const lowerTeamName = teamName.toLowerCase();
  if (lowerTeamName.includes("italtrans")) return "border-l-blue-400";
  if (lowerTeamName.includes("gresini")) return "border-l-red-500";
  if (lowerTeamName.includes("fieten olie")) return "border-l-yellow-500";
  if (lowerTeamName.includes("fantic")) return "border-l-red-600";
  if (lowerTeamName.includes("cfmoto")) return "border-l-green-500";
  return "border-l-gray-600";
};

const getTeamBgColor = (teamName: string) => {
  const lowerTeamName = teamName.toLowerCase();
  if (lowerTeamName.includes("italtrans")) return "bg-blue-400";
  if (lowerTeamName.includes("gresini")) return "bg-red-500";
  if (lowerTeamName.includes("fieten olie")) return "bg-yellow-500";
  if (lowerTeamName.includes("fantic")) return "bg-red-600";
  if (lowerTeamName.includes("cfmoto")) return "bg-green-500";
  return "bg-gray-600";
};

const getPositionColor = (position: number) => {
  return "text-foreground";
};

export default function Moto2Table() {
  const leaderPoints = moto2Standings[0]?.points ? Number(moto2Standings[0].points) : 0;

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
          {moto2Standings.map((piloto) => {
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
