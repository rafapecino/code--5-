"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Users } from "lucide-react";

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
        
        const activePoll = Array.isArray(data) ? data[0] : data;
        
        setPoll(activePoll);

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
        const responseData = await response.json();
        
        if (responseData.success) {
             fetchPoll();
        } else {
             setPoll(responseData);
        }

        setVoted(optionId);
        localStorage.setItem(`poll_${poll.id}_voted`, optionId.toString());
        toast.success("¡Gracias por tu voto!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "No se pudo registrar el voto.");
        if (response.status === 403) {
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

  const options = poll.options || [];
  const totalVotes = options.reduce((acc, option) => acc + (option.votes || 0), 0);
  const winner = options.reduce((prev, current) => (prev.votes > current.votes) ? prev : current);

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
              const isWinner = option.id === winner.id;

              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {voted ? (
                    <div className={`relative w-full h-12 border rounded-md flex items-center justify-between px-4 overflow-hidden ${isWinner ? "shadow-[0_0_15px_rgba(59,130,246,0.5)]" : ""}`}>
                      <motion.div
                        className="absolute top-0 left-0 h-full bg-primary/20"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                      <span className="relative z-10 font-medium">{option.text}</span>
                      <span className={`relative z-10 font-bold ${isWinner ? "text-lg" : ""}`}>{percentage.toFixed(1)}%</span>
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
          <div className="flex items-center justify-center text-sm text-muted-foreground mt-4 font-bold">
            <Users className="mr-2 h-4 w-4" />
            Total de {totalVotes} votos
          </div>
        )}
      </CardContent>
    </Card>
  );
}
