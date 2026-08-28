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
import { useEffect, useState, type ReactNode } from "react";
import { HelpCircle, Trash2, MessageCircleReply, LogOut, Check, X } from "lucide-react";
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
  /** Respuesta de Manuel Pecino, si ya la ha publicado. */
  answer?: string | null;
  answeredAt?: string | null;
}

/**
 * Bloque de participación de El Paddock.
 *
 * Reparto en escritorio: a la izquierda lo que el usuario *hace* (la encuesta
 * que llega por `aside` y el formulario), fijo con sticky mientras lee; a la
 * derecha, en el doble de ancho, lo que la comunidad *ha dicho*. Antes ambas
 * mitades eran iguales y las preguntas quedaban en una tira de texto de unos
 * 280 px, que es lo que se veía mal.
 */
export function QAndA({ aside }: { aside?: ReactNode }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  /* Token de administración: habilita el borrado manual de preguntas. */
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  /** Pregunta cuyo borrado está pendiente de confirmar. */
  const [confirmandoId, setConfirmandoId] = useState<number | null>(null);
  /** Pregunta que se está respondiendo, y el texto en curso. */
  const [respondiendoId, setRespondiendoId] = useState<number | null>(null);
  const [borrador, setBorrador] = useState("");
  const [guardando, setGuardando] = useState(false);

  /*
   * El modo admin se activa una sola vez entrando con ?admin=TOKEN. El token
   * se guarda en el navegador y se limpia de la URL para no dejarlo en el
   * historial ni en lo que se comparta. Quien no lo tenga no ve nada distinto:
   * el servidor vuelve a comprobarlo en cada borrado, así que ocultar el botón
   * no es la medida de seguridad, solo la parte visible.
   */
  useEffect(() => {
    const KEY = "pecinogp_admin_token";
    const fromUrl = new URLSearchParams(window.location.search).get("admin");
    if (fromUrl) {
      localStorage.setItem(KEY, fromUrl);
      setAdminToken(fromUrl);
      const url = new URL(window.location.href);
      url.searchParams.delete("admin");
      window.history.replaceState({}, "", url);
      return;
    }
    setAdminToken(localStorage.getItem(KEY));
  }, []);

  function salirDeAdmin() {
    localStorage.removeItem("pecinogp_admin_token");
    setAdminToken(null);
    setConfirmandoId(null);
    setRespondiendoId(null);
    toast.success("Has salido del modo administración.");
  }

  function abrirRespuesta(q: Question) {
    setRespondiendoId(q.id);
    setBorrador(q.answer ?? "");
  }

  async function guardarRespuesta(id: number) {
    if (!adminToken) return;
    setGuardando(true);
    try {
      const res = await fetch(`/api/questions?id=${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": adminToken,
        },
        body: JSON.stringify({ answer: borrador }),
      });
      if (res.ok) {
        const { answer } = await res.json();
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === id
              ? { ...q, answer, answeredAt: answer ? new Date().toISOString() : null }
              : q,
          ),
        );
        setRespondiendoId(null);
        toast.success(answer ? "Respuesta publicada." : "Respuesta retirada.");
      } else if (res.status === 401) {
        toast.error("Token de administración no válido.");
      } else {
        toast.error("No se pudo guardar la respuesta.");
      }
    } catch {
      toast.error("No se pudo guardar la respuesta.");
    } finally {
      setGuardando(false);
    }
  }

  async function deleteQuestion(id: number) {
    if (!adminToken) return;
    setDeletingId(id);
    setConfirmandoId(null);
    try {
      const res = await fetch(`/api/questions?id=${id}`, {
        method: "DELETE",
        headers: { "x-admin-token": adminToken },
      });
      if (res.ok) {
        setQuestions((prev) => prev.filter((q) => q.id !== id));
        toast.success("Pregunta borrada.");
      } else if (res.status === 401) {
        toast.error("Token de administración no válido.");
      } else {
        toast.error("No se pudo borrar la pregunta.");
      }
    } catch {
      toast.error("No se pudo borrar la pregunta.");
    } finally {
      setDeletingId(null);
    }
  }

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
          }`,
        );
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado. Inténtalo de nuevo más tarde.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3 lg:gap-10">
      {/* Columna de acciones: encuesta + formulario, fijos al hacer scroll. */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full space-y-8 self-start lg:sticky lg:top-28 lg:col-span-1"
      >
        {aside}
        <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[28px] md:rounded-[32px] border border-white/10 p-6 md:p-8 shadow-2xl">
          <h3 className="text-xl md:text-2xl font-black text-white italic tracking-tighter uppercase mb-6 md:mb-8">
            Envía tu pregunta
          </h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2 block">
                      Tu nombre (Opcional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Juan Pérez"
                        {...field}
                        className="bg-white/5 border-white/10 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-xl h-12 text-white placeholder:text-white/20 transition-all font-bold italic"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-[10px] font-bold" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2 block">
                      Tu pregunta
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Escribe aquí tu pregunta para Manuel Pecino..."
                        className="bg-white/5 border-white/10 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-2xl p-5 text-white placeholder:text-white/20 transition-all resize-none shadow-inner"
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-[10px] font-medium text-white/20 italic mt-2">
                      Se filtra automáticamente el lenguaje ofensivo. Sé
                      respetuoso.
                    </FormDescription>
                    <FormMessage className="text-red-500 text-[10px] font-bold" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black italic uppercase tracking-widest py-4 md:py-6 rounded-xl md:rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(220,38,38,0.3)]"
              >
                {isSubmitting ? "ENVIANDO..." : "ENVIAR PREGUNTA"}
              </Button>

              {/* Aviso RGPD en el punto de recogida (art. 13 RGPD / capa básica) */}
              <p className="text-[10px] leading-relaxed text-white/30 mt-4">
                Al enviar, tu nombre (si lo indicas) y tu pregunta se
                almacenarán y podrán publicarse para moderación y participación
                en la comunidad. Responsable:{" "}
                <span className="text-white/50 font-semibold">
                  MPC Network SL
                </span>
                . Puedes ejercer tus derechos y consultar los detalles en la{" "}
                <a
                  href="/politica-privacidad"
                  className="text-red-500 hover:text-red-400 underline"
                >
                  Política de Privacidad
                </a>
                .
              </p>
            </form>
          </Form>
        </div>
      </motion.div>

      {/* Columna del debate: el doble de ancha, para que las preguntas se lean. */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="bg-white/[0.03] backdrop-blur-3xl rounded-[28px] md:rounded-[32px] border border-white/10 p-6 md:p-10 shadow-2xl flex flex-col lg:col-span-2"
      >
        <div className="flex items-baseline justify-between gap-3 mb-6 md:mb-8">
          <h3 className="text-xl md:text-2xl font-black text-white italic tracking-tighter uppercase">
            Debate Comunitario
          </h3>
          <div className="flex shrink-0 items-center gap-3">
            {/* Aviso de que el modo administración está activo en este navegador. */}
            {adminToken && (
              <span className="inline-flex items-center gap-2 rounded-full border border-red-600/40 bg-red-600/10 py-1 pl-2.5 pr-1 text-[9px] font-black uppercase tracking-widest text-red-400">
                Modo admin
                {/* Cierra la sesión de administración en este navegador: útil
                    si se ha entrado desde un ordenador compartido. */}
                <button
                  type="button"
                  onClick={salirDeAdmin}
                  title="Salir del modo administración"
                  aria-label="Salir del modo administración"
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full transition-colors hover:bg-red-600/30 hover:text-white"
                >
                  <LogOut size={11} />
                </button>
              </span>
            )}
            {questions.length > 0 && (
              <span className="text-[10px] font-black uppercase tracking-widest text-white/30">
                {questions.length}{" "}
                {questions.length === 1 ? "pregunta" : "preguntas"}
              </span>
            )}
          </div>
        </div>
        {questions.length > 0 ? (
          /* Una sola columna a todo el ancho de la tarjeta (~700 px): son
             párrafos de texto y se leen mejor en una línea larga que partidos
             en dos columnas estrechas. */
          <div className="space-y-5">
            <AnimatePresence>
              {questions.map((q) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="relative overflow-hidden bg-white/[0.04] border border-white/8 p-6 md:p-7 rounded-[24px] hover:border-red-600/30 hover:bg-white/[0.06] transition-colors"
                >
                  {/* Comilla decorativa de fondo */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-5 right-3 text-7xl font-black italic text-white/[0.04] select-none leading-none"
                  >
                    &rdquo;
                  </span>
                  <div className="relative flex items-center gap-2 mb-3">
                    <div className="w-1 h-3.5 bg-red-600 rounded-full" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-500 italic">
                      {q.userName || "Fan PecinoGP"}
                    </span>
                    {/* Controles de administración. */}
                    {adminToken && (
                      <div className="ml-auto flex items-center gap-2">
                        {confirmandoId === q.id ? (
                          /* Confirmación en dos pasos: un toque accidental en
                             el móvil ya no borra nada. */
                          <>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
                              ¿Borrar?
                            </span>
                            <button
                              type="button"
                              onClick={() => deleteQuestion(q.id)}
                              disabled={deletingId === q.id}
                              aria-label="Confirmar el borrado"
                              className="inline-flex h-8 items-center gap-1 rounded-full bg-red-600 px-3 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-red-500 disabled:opacity-40"
                            >
                              <Check size={13} /> Sí
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmandoId(null)}
                              aria-label="Cancelar el borrado"
                              className="inline-flex h-8 items-center gap-1 rounded-full border border-white/15 px-3 text-[10px] font-black uppercase tracking-widest text-white/60 transition-colors hover:bg-white/10"
                            >
                              <X size={13} /> No
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => abrirRespuesta(q)}
                              aria-label={`Responder a ${q.userName || "Fan PecinoGP"}`}
                              title={q.answer ? "Editar la respuesta" : "Responder como Manuel Pecino"}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/40 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white"
                            >
                              <MessageCircleReply size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmandoId(q.id)}
                              aria-label={`Borrar la pregunta de ${q.userName || "Fan PecinoGP"}`}
                              title="Borrar esta pregunta"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/40 transition-colors hover:border-red-600 hover:bg-red-600/15 hover:text-red-400"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="relative text-gray-200 font-medium leading-relaxed italic text-[15px] md:text-base whitespace-pre-line break-words">
                    &ldquo;{q.question}&rdquo;
                  </p>

                  {/* Respuesta de Manuel, visible para todo el mundo. */}
                  {q.answer && respondiendoId !== q.id && (
                    <div className="relative mt-5 rounded-2xl border-l-2 border-red-600 bg-red-600/[0.07] p-4 md:p-5">
                      <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-red-500 italic">
                        Responde Manuel Pecino
                      </span>
                      <p className="text-[15px] font-medium leading-relaxed text-white/90 whitespace-pre-line break-words">
                        {q.answer}
                      </p>
                    </div>
                  )}

                  {/* Editor de respuesta, solo en modo administración. */}
                  {adminToken && respondiendoId === q.id && (
                    <div className="relative mt-5 rounded-2xl border border-white/10 bg-black/40 p-4">
                      <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-white/50">
                        Responder como Manuel Pecino
                      </span>
                      <Textarea
                        value={borrador}
                        onChange={(e) => setBorrador(e.target.value)}
                        rows={4}
                        maxLength={1000}
                        placeholder="Escribe la respuesta..."
                        className="resize-none rounded-xl border-white/10 bg-white/5 p-4 text-white placeholder:text-white/20 focus:border-red-600 focus:ring-1 focus:ring-red-600"
                      />
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Button
                          type="button"
                          onClick={() => guardarRespuesta(q.id)}
                          disabled={guardando}
                          className="h-9 rounded-xl bg-red-600 px-5 text-[10px] font-black uppercase tracking-widest italic text-white hover:bg-red-500"
                        >
                          {guardando ? "Guardando..." : "Publicar respuesta"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setRespondiendoId(null)}
                          className="h-9 rounded-xl border-white/15 bg-transparent px-5 text-[10px] font-black uppercase tracking-widest italic text-white/60 hover:bg-white/10"
                        >
                          Cancelar
                        </Button>
                        {q.answer && (
                          <button
                            type="button"
                            onClick={() => {
                              setBorrador("");
                              guardarRespuesta(q.id);
                            }}
                            className="ml-auto text-[10px] font-black uppercase tracking-widest text-white/40 underline transition-colors hover:text-red-400"
                          >
                            Quitar respuesta
                          </button>
                        )}
                      </div>
                      <p className="mt-2 text-[10px] text-white/25">
                        {borrador.length}/1000
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-16">
            <HelpCircle className="mx-auto h-20 w-20 text-white/10 mb-6" />
            <p className="text-white/40 font-bold italic tracking-wider max-w-[240px] mx-auto text-sm leading-relaxed">
              ¡ABRE EL DEBATE! TU PREGUNTA PODRÍA SALIR EN EL PRÓXIMO VÍDEO.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
