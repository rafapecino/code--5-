"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

interface PollOption {
  id: number;
  text: string;
  votes: number;
}

interface Poll {
  id: number;
  question: string;
  options: PollOption[];
}

export function QuickPoll() {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [voted, setVoted] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchPoll() {
    try {
      const response = await fetch("/api/polls");
      if (response.ok) {
        const data = await response.json();
        
        // --- CORRECCIÓN IMPORTANTE ---
        // La API devuelve un array, así que cogemos la primera encuesta (data[0])
        // Si data ya fuera un objeto, lo usamos directamente.
        const activePoll = Array.isArray(data) ? data[0] : data;
        
        setPoll(activePoll);

        // Comprobamos si ya votó en esta encuesta específica
        if (activePoll) {
          const storedVote = localStorage.getItem(`poll_${activePoll.id}_voted`);
          if (storedVote) {
            setVoted(parseInt(storedVote, 10));
          }
        }
      }
    } catch (error) {
      console.error("Error fetching poll:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPoll();
  }, []);

  const handleVote = async (optionId: number) => {
    if (!poll) return;

    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pollId: poll.id, optionId }),
      });

      if (response.ok) {
        // Al votar, la API suele devolver el objeto actualizado.
        // Nos aseguramos de leerlo correctamente.
        const responseData = await response.json();
        
        // A veces la API de voto devuelve solo éxito, a veces la encuesta entera.
        // Si devuelve éxito, recargamos todo para ver los porcentajes nuevos.
        if (responseData.success) {
             fetchPoll(); // Recargar datos frescos de la DB
        } else {
             // Si la API devolvió la encuesta actualizada directamente
             setPoll(responseData);
        }

        setVoted(optionId);
        localStorage.setItem(`poll_${poll.id}_voted`, optionId.toString());
        toast.success("¡Gracias por tu voto!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "No se pudo registrar el voto.");
        if (response.status === 403) {
          // Si el servidor dice "ya votaste", actualizamos la UI
          setVoted(optionId);
          localStorage.setItem(`poll_${poll.id}_voted`, optionId.toString());
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error inesperado.");
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="h-8 bg-muted rounded w-3/4 animate-pulse"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-10 bg-muted rounded w-full animate-pulse"></div>
          <div className="h-10 bg-muted rounded w-full animate-pulse"></div>
          <div className="h-10 bg-muted rounded w-full animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  if (!poll) {
    return null; 
  }

  // Protección extra: si poll.options es undefined, usamos array vacío para que no explote el reduce
  const options = poll.options || [];
  const totalVotes = options.reduce((acc, option) => acc + (option.votes || 0), 0);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">{poll.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <AnimatePresence>
            {options.map((option) => {
              const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {voted ? (
                    <div className="relative w-full h-12 border rounded-md flex items-center justify-between px-4 overflow-hidden">
                      <motion.div
                        className="absolute top-0 left-0 h-full bg-primary/20"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                      <span className="relative z-10 font-medium">{option.text}</span>
                      <span className="relative z-10 font-bold">{percentage.toFixed(1)}%</span>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full h-12 justify-center"
                      onClick={() => handleVote(option.id)}
                    >
                      {option.text}
                    </Button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        {voted && totalVotes > 0 && (
          <p className="text-sm text-muted-foreground text-center mt-4">
            Total de {totalVotes} votos
          </p>
        )}
      </CardContent>
    </Card>
  );
}
