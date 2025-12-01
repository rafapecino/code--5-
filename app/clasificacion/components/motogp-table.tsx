"use client";

import { useEffect, useState } from "react";
import { getDriverStandings, DriverStanding } from "@/lib/motogp-service";
import { Skeleton } from "@/All/components/ui/skeleton";

// Helper to get team color for the side border
const getTeamColor = (teamName: string) => {
  const lowerTeamName = teamName.toLowerCase();
  if (lowerTeamName.includes("ducati lenovo")) return "border-l-red-600";
  if (lowerTeamName.includes("prima pramac") || lowerTeamName.includes("pramac racing")) return "border-l-purple-600";
  if (lowerTeamName.includes("monster energy yamaha") || lowerTeamName.includes("yamaha")) return "border-l-blue-800";
  if (lowerTeamName.includes("repsol honda")) return "border-l-orange-600";
  if (lowerTeamName.includes("aprilia racing")) return "border-l-black";
  if (lowerTeamName.includes("red bull ktm factory") || lowerTeamName.includes("red bull ktm tech3")) return "border-l-orange-500";
  if (lowerTeamName.includes("trackhouse racing")) return "border-l-blue-700";
  if (lowerTeamName.includes("pertamina enduro vr46") || lowerTeamName.includes("vr46")) return "border-l-yellow-400";
  if (lowerTeamName.includes("lcr honda")) return "border-l-green-600";
  if (lowerTeamName.includes("gresini racing")) return "border-l-sky-400";
  // Fallbacks for simpler team names
  if (lowerTeamName.includes("ducati")) return "border-l-red-600";
  if (lowerTeamName.includes("honda")) return "border-l-orange-700";
  if (lowerTeamName.includes("ktm")) return "border-l-orange-500";
  if (lowerTeamName.includes("aprilia")) return "border-l-black";
  
  return "border-l-gray-600"; // Default color
};

const getTeamBgColor = (teamName: string) => {
  const lowerTeamName = teamName.toLowerCase();
  if (lowerTeamName.includes("ducati lenovo")) return "bg-red-600";
  if (lowerTeamName.includes("prima pramac") || lowerTeamName.includes("pramac racing")) return "bg-purple-600";
  if (lowerTeamName.includes("monster energy yamaha") || lowerTeamName.includes("yamaha")) return "bg-blue-800";
  if (lowerTeamName.includes("repsol honda")) return "bg-orange-600";
  if (lowerTeamName.includes("aprilia racing")) return "bg-black";
  if (lowerTeamName.includes("red bull ktm factory") || lowerTeamName.includes("red bull ktm tech3")) return "bg-orange-500";
  if (lowerTeamName.includes("trackhouse racing")) return "bg-blue-700";
  if (lowerTeamName.includes("pertamina enduro vr46") || lowerTeamName.includes("vr46")) return "bg-yellow-400";
  if (lowerTeamName.includes("lcr honda")) return "bg-green-600";
  if (lowerTeamName.includes("gresini racing")) return "bg-sky-400";
  // Fallbacks for simpler team names
  if (lowerTeamName.includes("ducati")) return "bg-red-600";
  if (lowerTeamName.includes("honda")) return "bg-orange-700";
  if (lowerTeamName.includes("ktm")) return "bg-orange-500";
  if (lowerTeamName.includes("aprilia")) return "bg-black";
  
  return "bg-gray-600"; // Default color
};

// Helper to get medal colors for top positions
const getPositionColor = (position: number) => {
  return "text-foreground";
};

const TableSkeleton = () => (
    <div className="w-full">
        <div className="p-4 bg-secondary/50">
            <Skeleton className="h-6 w-full" />
        </div>
        {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border-t border-border/50">
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-6 w-16" />
            </div>
        ))}
    </div>
);


export default function MotogpTable() {
  const [pilotos, setPilotos] = useState<DriverStanding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getDriverStandings();
      setPilotos(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
        <div className="bg-secondary/30 rounded-lg overflow-hidden shadow-lg backdrop-blur-sm">
            <TableSkeleton />
        </div>
    );
  }

  const leaderPoints = pilotos.length > 0 && pilotos[0].points ? Number(pilotos[0].points) : 0;

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
          {pilotos.map((piloto) => {
            const pilotPoints = Number(piloto.points);
            const pointsPercentage = leaderPoints > 0 ? (pilotPoints / leaderPoints) * 100 : 0;

            return (
              <tr
                key={piloto.pos}
                className={`border-t border-border/50 transition-colors hover:bg-slate-800/50 ${getTeamColor(
                  piloto.teamName
                )} border-l-4`}
              >
                <td
                  className={`p-4 text-center font-bold text-lg ${getPositionColor(
                    Number(piloto.pos)
                  )}`}
                >
                  {piloto.pos}
                </td>
                <td className="p-4 text-primary font-semibold">
                  {piloto.driverName}
                </td>
                <td className="p-4 hidden sm:table-cell text-muted-foreground">
                  {piloto.teamName}
                </td>
                <td className="p-4 text-right">
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-lg">{piloto.points}</span>
                    <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                      <div
                        className={`${getTeamBgColor(
                          piloto.teamName
                        )} h-1.5 rounded-full`}
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
