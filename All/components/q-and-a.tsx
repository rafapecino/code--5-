"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/All/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/All/components/ui/form";
import { Input } from "@/All/components/ui/input";
import { Textarea } from "@/All/components/ui/textarea";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AnimatePresence, motion } from "framer-motion";

const formSchema = z.object({
  userName: z.string().optional(),
  question: z
    .string()
    .min(10, {
      message: "La pregunta debe tener al menos 10 caracteres.",
    })
    .max(500, {
      message: "La pregunta no puede tener más de 500 caracteres.",
    }),
});

interface Question {
  id: number;
  question: string;
  userName: string;
  createdAt: string;
}

export function QAndA() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      question: "",
    },
  });

  async function fetchQuestions() {
    try {
      const response = await fetch("/api/questions");
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  }

  useEffect(() => {
    fetchQuestions();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast.success("¡Pregunta enviada! Gracias por participar.");
        form.reset();
        fetchQuestions();
      } else {
        const errorData = await response.json();
        toast.error(
          `Error al enviar la pregunta: ${
            errorData.error?.question?._errors[0] || "Inténtalo de nuevo."
          }`
        );
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado. Inténtalo de nuevo más tarde.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Envía tu pregunta</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tu nombre (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Juan Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tu pregunta</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Escribe aquí tu pregunta para Manuel Pecino..."
                          className="resize-none"
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Tu pregunta será revisada antes de ser publicada.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Enviar Pregunta"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Preguntas de la comunidad</CardTitle>
          </CardHeader>
          <CardContent>
            {questions.length > 0 ? (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4">
                <AnimatePresence>
                  {questions.map((q, index) => (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border-b border-border/50 pb-4"
                    >
                      <p className="font-semibold text-primary">
                        {q.userName}
                      </p>
                      <p className="text-muted-foreground">{q.question}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Aún no hay preguntas. ¡Sé el primero en preguntar!
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
