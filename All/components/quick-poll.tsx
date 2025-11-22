"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Counter } from "./ui/counter";
import { CheckCircle } from "lucide-react";

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

const optionColors = [
  "bg-blue-500/20",
  "bg-green-500/20",
  "bg-yellow-500/20",
  "bg-purple-500/20",
  "bg-red-500/20",
  "bg-indigo-500/20",
];

const optionTextColors = [
  "text-blue-500",
  "text-green-500",
  "text-yellow-500",
  "text-purple-500",
  "text-red-500",
  "text-indigo-500",
];

export function QuickPoll() {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [voted, setVoted] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchPoll() {
    try {
      const response = await fetch("/api/polls");
      if (response.ok) {
        const data = await response.json();
        setPoll(data);
        const storedVote = localStorage.getItem(`poll_${data.id}_voted`);
        if (storedVote) {
          setVoted(parseInt(storedVote, 10));
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
    if (!poll || voted) return;

    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pollId: poll.id, optionId }),
      });

      if (response.ok) {
        const updatedPoll = await response.json();
        setPoll(updatedPoll);
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
      toast.error("Ocurrió un error inesperado.");
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="h-8 bg-muted/50 rounded w-3/4 animate-pulse mx-auto"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-12 bg-muted/50 rounded-lg w-full animate-pulse"></div>
          <div className="h-12 bg-muted/50 rounded-lg w-full animate-pulse"></div>
          <div className="h-12 bg-muted/50 rounded-lg w-full animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  if (!poll) {
    return null;
  }

  const totalVotes = poll.options.reduce((acc, option) => acc + option.votes, 0);

  return (
    <Card className="w-full max-w-md mx-auto bg-card/50 backdrop-blur-sm border-border/20">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold text-primary">
          {poll.question}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <AnimatePresence>
            {poll.options.map((option, index) => {
              const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
              const isVotedOption = voted === option.id;

              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {voted ? (
                    <div className="relative w-full h-14 border border-border/30 rounded-lg flex items-center justify-between px-4 overflow-hidden transition-all duration-300">
                      <motion.div
                        className={`absolute top-0 left-0 h-full ${optionColors[index % optionColors.length]}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                      />
                      <div className="relative z-10 flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${optionTextColors[index % optionTextColors.length]}`}>
                            {option.text}
                          </span>
                          {isVotedOption && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            </motion.div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 font-bold text-lg">
                          <Counter from={0} to={percentage} format={(v) => `${v.toFixed(1)}`} />
                          <span>%</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full h-14 justify-center text-lg border-border/30 hover:bg-primary/10"
                        onClick={() => handleVote(option.id)}
                      >
                        {option.text}
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        {voted && totalVotes > 0 && (
          <p className="text-sm text-muted-foreground text-center mt-5">
            Total de <span className="font-bold text-foreground">{totalVotes}</span> votos
          </p>
        )}
      </CardContent>
    </Card>
  );
}
