"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import anime from "animejs";
import Header from "@/All/components/header";
import { Footer } from "@/All/components/footer";
import { SplitHeadline } from "@/All/components/split-headline";
import { StatBadge } from "@/All/components/stat-badge";
import { Reveal } from "@/All/components/reveal";
import { ScrollHint } from "@/All/components/scroll-hint";
import { HeroUnderline } from "@/All/components/hero-underline";
import { Magnetic } from "@/All/components/magnetic";
import type { InstagramStats } from "@/lib/instagram-data";
import type { YouTubeChannel, YouTubeVideo } from "@/lib/youtube-format";
import { decodeHtmlEntities } from "@/lib/utils";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  MotionConfig,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  Users,
  Film,
  Globe,
  Play,
  ChevronRight,
  ArrowUpRight,
  Calendar,
  TrendingUp,
  Heart,
  Image as ImageIcon,
  BarChart2,
  Instagram,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const ThreeBackground = dynamic(
  () => import("@/All/components/three-background"),
  { ssr: false },
);

/* ─── DATOS REALES (YouTube Studio · jun 2025–jun 2026) ─────────────────── */

// Top vídeos por visualizaciones de los últimos 28 días (en miles).
const TOP_VIDEOS = [
  { name: "Pedro Acosta estalla", views: 58.3 },
  { name: "Entrevista Gino Borsoi", views: 44.2 },
  { name: "A un paso de la tragedia", views: 42.2 },
  { name: "Gregorio Lavilla: MotoGP 850", views: 38.4 },
  { name: "Aprilia amarga a Ducati", views: 38.2 },
  { name: "¿Qué está pasando en MGP?", views: 28.2 },
];

// Reparto de tiempo de visualización por dispositivo (últimos 28 días, %).
const DEVICES = [
  { name: "Móvil", pct: 54.4 },
  { name: "TV", pct: 24.7 },
  { name: "Ordenador", pct: 13.7 },
  { name: "Tablet", pct: 7.0 },
];

// Audiencia por país según visualizaciones del último año (real, YT Studio).
const COUNTRIES = [
  { code: "es", name: "España", pct: 40.1 },
  { code: "ve", name: "Venezuela", pct: 33.5 },
  { code: "co", name: "Colombia", pct: 4.9 },
  { code: "ar", name: "Argentina", pct: 4.7 },
  { code: "mx", name: "México", pct: 4.0 },
  { code: "us", name: "EE. UU.", pct: 1.8 },
  { code: "ot", name: "Otros", pct: 11.0 },
];

/* ─── DATOS REALES INSTAGRAM (@pecinogp · últimos 30 días) ──────────────── */

// Top Reels por visualizaciones del último mes (en miles).
const TOP_REELS = [
  { name: "Reel #1", views: 16.1 },
  { name: "Reel #2", views: 15.5 },
  { name: "Reel #3", views: 13.4 },
  { name: "Reel #4", views: 9.2 },
  { name: "Reel #5", views: 6.8 },
];

// De dónde viene el alcance (% de cuentas alcanzadas, últimos 30 días).
const IG_AUDIENCE = [
  { name: "No seguidores", pct: 77.6 },
  { name: "Seguidores", pct: 22.4 },
];

/* ─── TOOLTIP CUSTOM ───────────────────────────────────────────────────── */
function CustomTooltip({
  active,
  payload,
  label,
  unit = "",
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
  unit?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-black/90 border border-white/10 rounded-xl px-4 py-3 shadow-2xl backdrop-blur-xl text-xs">
      <p className="text-white/50 font-black uppercase tracking-widest mb-2">
        {label}
      </p>
      {payload.map((p) => (
        <p key={p.name} className="font-black" style={{ color: p.color }}>
          {p.value.toLocaleString("es-ES")}
          {unit}
        </p>
      ))}
    </div>
  );
}

/* ─── PRESETS DE ANIMACIÓN ─────────────────────────────────────────────── */
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

// Contenedor de KPIs: orquesta la entrada en cascada de sus hijos.
const kpiGrid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

// Cada KPI: sube, escala y se enfoca al entrar.
const kpiItem = {
  hidden: { opacity: 0, y: 26, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

// Tarjetas de gráficas: entrada al scroll con retardo configurable.
const cardIn = (delay = 0) => ({
  initial: { opacity: 0, y: 32, scale: 0.97 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.65, delay, ease: EASE_OUT },
  whileHover: {
    y: -5,
    transition: { type: "spring" as const, stiffness: 300, damping: 22 },
  },
});

/* ─── VALOR ANIMADO (odómetro por carácter) ────────────────────────────── */
function AnimatedValue({ value }: { value: string }) {
  return (
    // pr/-mr compensan el voladizo de la cursiva para que el clip no corte
    // el último carácter (la K de 68,5K) ni el primero.
    <span
      className="inline-flex overflow-hidden pr-[0.18em] -mr-[0.18em] pl-[0.06em] -ml-[0.06em]"
      aria-label={value}
    >
      {value.split("").map((c, i) => (
        <motion.span
          key={`${i}-${c}`}
          aria-hidden
          initial={{ y: "1.1em", opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.55,
            delay: 0.25 + i * 0.05,
            ease: EASE_OUT,
          }}
          className="inline-block will-change-transform"
        >
          {c === " " ? " " : c}
        </motion.span>
      ))}
    </span>
  );
}

/* ─── PORCENTAJE TELEMETRÍA (anime.js count-up) ────────────────────────── */
function TelemetryPercent({ pct }: { pct: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fmt = (v: number) =>
      `${v.toLocaleString("es-ES", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })}%`;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      el.textContent = fmt(pct);
      return;
    }

    el.textContent = fmt(0);
    let anim: ReturnType<typeof anime> | null = null;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const obj = { v: 0 };
        anim = anime({
          targets: obj,
          v: pct,
          duration: 1400,
          easing: "easeOutExpo",
          update: () => {
            el.textContent = fmt(obj.v);
          },
        });
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      anim?.pause();
    };
  }, [pct]);

  return <span ref={ref} className="tabular-nums" />;
}

/* ─── MINI STAT CARD ───────────────────────────────────────────────────── */
function MiniStat({
  label,
  value,
  delta,
  color = "red",
}: {
  label: string;
  value: string;
  delta?: string;
  color?: "red" | "purple";
}) {
  return (
    <motion.div
      variants={kpiItem}
      whileHover={{
        y: -5,
        scale: 1.02,
        transition: { type: "spring", stiffness: 320, damping: 20 },
      }}
      className="group relative flex flex-col gap-1 p-5 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-white/15 transition-colors overflow-hidden"
    >
      {/* Sheen sutil al hover */}
      <div
        className={`pointer-events-none absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
          color === "purple" ? "bg-purple-500/15" : "bg-red-600/15"
        }`}
      />
      <p className="relative z-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
        {label}
      </p>
      <p
        className={`relative z-10 text-2xl md:text-3xl font-black italic tracking-tighter ${
          color === "purple" ? "text-purple-400" : "text-white"
        }`}
      >
        <AnimatedValue value={value} />
      </p>
      {delta && (
        <p
          className={`relative z-10 text-[11px] font-bold ${color === "purple" ? "text-purple-400/70" : "text-red-500/80"}`}
        >
          {delta}
        </p>
      )}
    </motion.div>
  );
}

/* ─── PAGE ─────────────────────────────────────────────────────────────── */
export default function MiCanalPage() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);

  const [stats, setStats] = useState<YouTubeChannel | null>(null);
  const [latest, setLatest] = useState<YouTubeVideo[]>([]);
  const [ig, setIg] = useState<InstagramStats | null>(null);
  const [activeTab, setActiveTab] = useState<"youtube" | "instagram">(
    "youtube",
  );
  const [chartMounted, setChartMounted] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/youtube?max=3").then((r) => r.json());
        setStats(res.stats || null);
        setLatest(res.latestVideos || []);
      } catch (err) {
        console.error("Error cargando datos del canal:", err);
      }
    }
    load();
    // Estadísticas de Instagram (Graph API; cae a fallback si no hay token).
    fetch("/api/instagram")
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) setIg(data as InstagramStats);
      })
      .catch(() => {});
    // Pequeño retraso para que los charts se monten suavemente
    const t = setTimeout(() => setChartMounted(true), 300);
    return () => clearTimeout(t);
  }, []);

  const views = stats ? Number(stats.viewCount) : 18800000;
  const subs = stats ? Number(stats.subscriberCount) : 68400;
  const videoCount = stats ? Number(stats.videoCount) : 1234;

  // Instagram: valores reales (o los últimos conocidos como respaldo).
  const igFollowers = ig?.followers ?? 4345;
  const igViews = ig?.views ?? 140665;
  const igReach = ig?.reach ?? 49983;
  const igInteractions = ig?.interactions ?? 6622;
  const igEngagement = ig?.engagement ?? 4.7;
  const compactK = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1).replace(".", ",")}K` : String(n);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-black text-foreground overflow-x-hidden selection:bg-red-600 selection:text-white">
        <Header />

        <main>
          {/* ─── HERO ─── */}
          <section className="relative min-h-[88vh] py-20 flex items-center justify-center overflow-hidden">
            <motion.div
              style={{ y: y1 }}
              className="absolute inset-0 z-0 scale-110"
            >
              <Image
                src="/hero-stats-bg.png"
                alt="Estadísticas del canal PecinoGP"
                fill
                className="object-cover opacity-30 grayscale saturate-0"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
            </motion.div>

            <ThreeBackground className="z-[1] opacity-70" density={700} />

            <div className="relative z-20 max-w-7xl mx-auto px-4 text-center">
              <SplitHeadline
                className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-white italic tracking-tighter leading-[0.85] mb-8"
                style={{ filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.8))" }}
              >
                EL <span className="text-red-600">CANAL</span>
              </SplitHeadline>

              {/* Racing line dibujada a trazo bajo el titular */}
              <HeroUnderline />

              <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl font-medium italic">
                Años de pasión por MotoGP convertidos en números. Esto es lo que
                la comunidad de PecinoGP ha construido.
              </p>
            </div>

            <ScrollHint />
          </section>

          {/* ═══════════════════════════════════════════════════════════════
            DASHBOARD DE CRECIMIENTO
        ═══════════════════════════════════════════════════════════════ */}
          <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            {/* Glow fondo con respiración ambiental */}
            <motion.div
              aria-hidden
              animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.08, 1] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-600/5 blur-[120px] rounded-full"
            />

            <div className="max-w-7xl mx-auto">
              {/* Cabecera + tabs */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-1 bg-red-600 rounded-full" />
                    {/* Punto "en vivo" parpadeante */}
                    <span className="relative flex h-2 w-2">
                      <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
                    </span>
                    <span className="text-red-500 font-black uppercase tracking-[0.2em] text-[10px]">
                      Analíticas en tiempo real
                    </span>
                  </div>
                  <Reveal y={30}>
                    <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter">
                      EL CANAL <span className="text-red-600">EN NÚMEROS</span>
                    </h2>
                  </Reveal>
                </div>

                {/* Tab switcher con píldora deslizante */}
                <div className="flex gap-2 p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 self-start md:self-auto">
                  <motion.button
                    onClick={() => setActiveTab("youtube")}
                    whileTap={{ scale: 0.95 }}
                    className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-colors duration-300 ${
                      activeTab === "youtube"
                        ? "text-white"
                        : "text-white/40 hover:text-white/70"
                    }`}
                  >
                    {activeTab === "youtube" && (
                      <motion.span
                        layoutId="dashTabPill"
                        className="absolute inset-0 rounded-xl bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                        transition={{
                          type: "spring",
                          bounce: 0.22,
                          duration: 0.55,
                        }}
                      />
                    )}
                    {/* YouTube icon */}
                    <svg
                      className="relative z-10 w-4 h-3"
                      viewBox="0 0 28 20"
                      fill="currentColor"
                    >
                      <path d="M27.37 3.03C27.04 1.84 26.09.89 24.9.56 22.72 0 14 0 14 0S5.28 0 3.1.56C1.91.89.96 1.84.63 3.03.07 5.22 0 9.8 0 9.8s.07 4.58.63 6.77c.33 1.19 1.28 2.14 2.47 2.47C5.28 19.6 14 19.6 14 19.6s8.72 0 10.9-.56c1.19-.33 2.14-1.28 2.47-2.47C27.93 14.38 28 9.8 28 9.8s-.07-4.58-.63-6.77zM11.2 14V5.6l7.28 4.2L11.2 14z" />
                    </svg>
                    <span className="relative z-10">YouTube</span>
                  </motion.button>
                  <motion.button
                    onClick={() => setActiveTab("instagram")}
                    whileTap={{ scale: 0.95 }}
                    className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-colors duration-300 ${
                      activeTab === "instagram"
                        ? "text-white"
                        : "text-white/40 hover:text-white/70"
                    }`}
                  >
                    {activeTab === "instagram" && (
                      <motion.span
                        layoutId="dashTabPill"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                        transition={{
                          type: "spring",
                          bounce: 0.22,
                          duration: 0.55,
                        }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <Instagram size={14} />
                      Instagram
                    </span>
                  </motion.button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "youtube" ? (
                  <motion.div
                    key="youtube"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* KPIs YouTube (datos reales · YouTube Studio) */}
                    <motion.div
                      variants={kpiGrid}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: "-40px" }}
                      className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
                    >
                      <MiniStat
                        label="Suscriptores"
                        value={`${(subs / 1000).toFixed(1)}K`}
                        delta="↑ +783 en 28 días"
                        color="red"
                      />
                      <MiniStat
                        label="Visualizaciones"
                        value={`${(views / 1_000_000).toFixed(1)}M`}
                        delta="histórico del canal"
                        color="red"
                      />
                      <MiniStat
                        label="Vistas (último año)"
                        value="6,75M"
                        delta="↑ 1,26M h de visión"
                        color="red"
                      />
                      <MiniStat
                        label="Audiencia mensual"
                        value="134K"
                        delta="usuarios únicos / 28 d"
                        color="red"
                      />
                    </motion.div>

                    {/* Charts grid YouTube */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Top vídeos del mes (real) */}
                      <motion.div
                        {...cardIn(0)}
                        className="p-6 md:p-8 rounded-[28px] bg-white/[0.03] border border-white/8 hover:border-red-600/20 transition-colors duration-300 will-change-transform"
                      >
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2.5 rounded-xl bg-red-600/10 border border-red-600/20">
                            <Eye size={16} className="text-red-500" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-white italic tracking-tight">
                              Top vídeos del mes
                            </p>
                            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                              Visualizaciones · últimos 28 días · en miles
                            </p>
                          </div>
                        </div>
                        {chartMounted && (
                          <ResponsiveContainer width="100%" height={220}>
                            <BarChart
                              layout="vertical"
                              data={TOP_VIDEOS}
                              margin={{ top: 0, right: 12, bottom: 0, left: 0 }}
                            >
                              <defs>
                                <linearGradient
                                  id="topGrad"
                                  x1="0"
                                  y1="0"
                                  x2="1"
                                  y2="0"
                                >
                                  <stop
                                    offset="0%"
                                    stopColor="#7f1d1d"
                                    stopOpacity={0.7}
                                  />
                                  <stop
                                    offset="100%"
                                    stopColor="#dc2626"
                                    stopOpacity={0.95}
                                  />
                                </linearGradient>
                              </defs>
                              <XAxis type="number" hide />
                              <YAxis
                                type="category"
                                dataKey="name"
                                width={140}
                                tick={{
                                  fill: "rgba(255,255,255,0.55)",
                                  fontSize: 10,
                                  fontWeight: 700,
                                }}
                                axisLine={false}
                                tickLine={false}
                              />
                              <Tooltip
                                content={<CustomTooltip unit="K vistas" />}
                                cursor={{ fill: "rgba(255,255,255,0.04)" }}
                              />
                              <Bar
                                dataKey="views"
                                fill="url(#topGrad)"
                                radius={[0, 6, 6, 0]}
                                maxBarSize={18}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </motion.div>

                      {/* Audiencia por dispositivo (real) */}
                      <motion.div
                        {...cardIn(0.12)}
                        className="p-6 md:p-8 rounded-[28px] bg-white/[0.03] border border-white/8 hover:border-red-600/20 transition-colors duration-300 will-change-transform"
                      >
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2.5 rounded-xl bg-red-600/10 border border-red-600/20">
                            <Users size={16} className="text-red-500" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-white italic tracking-tight">
                              Audiencia por dispositivo
                            </p>
                            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                              Tiempo de visión · últimos 28 días · %
                            </p>
                          </div>
                        </div>
                        {chartMounted && (
                          <ResponsiveContainer width="100%" height={220}>
                            <BarChart
                              data={DEVICES}
                              margin={{
                                top: 5,
                                right: 5,
                                bottom: 0,
                                left: -20,
                              }}
                            >
                              <defs>
                                <linearGradient
                                  id="devGrad"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="5%"
                                    stopColor="#dc2626"
                                    stopOpacity={0.95}
                                  />
                                  <stop
                                    offset="95%"
                                    stopColor="#7f1d1d"
                                    stopOpacity={0.6}
                                  />
                                </linearGradient>
                              </defs>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="rgba(255,255,255,0.04)"
                              />
                              <XAxis
                                dataKey="name"
                                tick={{
                                  fill: "rgba(255,255,255,0.5)",
                                  fontSize: 10,
                                  fontWeight: 700,
                                }}
                                axisLine={false}
                                tickLine={false}
                              />
                              <YAxis
                                tick={{
                                  fill: "rgba(255,255,255,0.3)",
                                  fontSize: 10,
                                }}
                                axisLine={false}
                                tickLine={false}
                                unit="%"
                              />
                              <Tooltip
                                content={<CustomTooltip unit="%" />}
                                cursor={{ fill: "rgba(255,255,255,0.04)" }}
                              />
                              <Bar
                                dataKey="pct"
                                fill="url(#devGrad)"
                                radius={[6, 6, 0, 0]}
                                maxBarSize={48}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="instagram"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* KPIs Instagram (Graph API en tiempo real · últimos 28 días) */}
                    <motion.div
                      variants={kpiGrid}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: "-40px" }}
                      className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
                    >
                      <MiniStat
                        label="Seguidores"
                        value={igFollowers.toLocaleString("es-ES")}
                        delta={ig?.live ? "en tiempo real" : "comunidad fiel"}
                        color="purple"
                      />
                      <MiniStat
                        label="Visualizaciones"
                        value={compactK(igViews)}
                        delta="últimos 28 días"
                        color="purple"
                      />
                      <MiniStat
                        label="Cuentas alcanzadas"
                        value={compactK(igReach)}
                        delta="últimos 28 días"
                        color="purple"
                      />
                      <MiniStat
                        label="Interacciones"
                        value={igInteractions.toLocaleString("es-ES")}
                        delta={`↑ ${String(igEngagement).replace(".", ",")}% engagement`}
                        color="purple"
                      />
                    </motion.div>

                    {/* Charts grid Instagram (datos reales) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Top Reels del mes */}
                      <motion.div
                        {...cardIn(0)}
                        className="p-6 md:p-8 rounded-[28px] bg-white/[0.03] border border-white/8 hover:border-purple-600/20 transition-colors duration-300 will-change-transform"
                      >
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2.5 rounded-xl bg-purple-600/10 border border-purple-600/20">
                            <Instagram size={16} className="text-purple-400" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-white italic tracking-tight">
                              Top Reels del mes
                            </p>
                            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                              Visualizaciones · últimos 30 días · en miles
                            </p>
                          </div>
                        </div>
                        {chartMounted && (
                          <ResponsiveContainer width="100%" height={220}>
                            <BarChart
                              layout="vertical"
                              data={TOP_REELS}
                              margin={{ top: 0, right: 12, bottom: 0, left: 0 }}
                            >
                              <defs>
                                <linearGradient
                                  id="reelGrad"
                                  x1="0"
                                  y1="0"
                                  x2="1"
                                  y2="0"
                                >
                                  <stop
                                    offset="0%"
                                    stopColor="#9333ea"
                                    stopOpacity={0.7}
                                  />
                                  <stop
                                    offset="100%"
                                    stopColor="#ec4899"
                                    stopOpacity={0.95}
                                  />
                                </linearGradient>
                              </defs>
                              <XAxis type="number" hide />
                              <YAxis
                                type="category"
                                dataKey="name"
                                width={70}
                                tick={{
                                  fill: "rgba(255,255,255,0.55)",
                                  fontSize: 10,
                                  fontWeight: 700,
                                }}
                                axisLine={false}
                                tickLine={false}
                              />
                              <Tooltip
                                content={<CustomTooltip unit="K vistas" />}
                                cursor={{ fill: "rgba(255,255,255,0.04)" }}
                              />
                              <Bar
                                dataKey="views"
                                fill="url(#reelGrad)"
                                radius={[0, 6, 6, 0]}
                                maxBarSize={22}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </motion.div>

                      {/* De dónde viene el alcance */}
                      <motion.div
                        {...cardIn(0.12)}
                        className="p-6 md:p-8 rounded-[28px] bg-white/[0.03] border border-white/8 hover:border-purple-600/20 transition-colors duration-300 will-change-transform"
                      >
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2.5 rounded-xl bg-pink-600/10 border border-pink-600/20">
                            <TrendingUp size={16} className="text-pink-400" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-white italic tracking-tight">
                              ¿De dónde viene el alcance?
                            </p>
                            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                              Cuentas alcanzadas · últimos 30 días · %
                            </p>
                          </div>
                        </div>
                        {chartMounted && (
                          <ResponsiveContainer width="100%" height={220}>
                            <BarChart
                              data={IG_AUDIENCE}
                              margin={{
                                top: 5,
                                right: 5,
                                bottom: 0,
                                left: -20,
                              }}
                            >
                              <defs>
                                <linearGradient
                                  id="igReachGrad"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="5%"
                                    stopColor="#ec4899"
                                    stopOpacity={0.95}
                                  />
                                  <stop
                                    offset="95%"
                                    stopColor="#9333ea"
                                    stopOpacity={0.6}
                                  />
                                </linearGradient>
                              </defs>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="rgba(255,255,255,0.04)"
                              />
                              <XAxis
                                dataKey="name"
                                tick={{
                                  fill: "rgba(255,255,255,0.5)",
                                  fontSize: 10,
                                  fontWeight: 700,
                                }}
                                axisLine={false}
                                tickLine={false}
                              />
                              <YAxis
                                tick={{
                                  fill: "rgba(255,255,255,0.3)",
                                  fontSize: 10,
                                }}
                                axisLine={false}
                                tickLine={false}
                                unit="%"
                              />
                              <Tooltip
                                content={<CustomTooltip unit="%" />}
                                cursor={{ fill: "rgba(255,255,255,0.04)" }}
                              />
                              <Bar
                                dataKey="pct"
                                fill="url(#igReachGrad)"
                                radius={[6, 6, 0, 0]}
                                maxBarSize={70}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </motion.div>
                    </div>

                    {/* Instagram CTA / info */}
                    <motion.div
                      {...cardIn(0.2)}
                      className="mt-6 p-6 md:p-8 rounded-[28px] bg-gradient-to-r from-purple-900/20 via-pink-900/10 to-transparent border border-purple-600/20 flex flex-col md:flex-row items-center gap-6 md:gap-10 will-change-transform"
                    >
                      <div className="shrink-0 p-4 rounded-2xl bg-gradient-to-br from-purple-600/30 to-pink-600/30 border border-white/10">
                        <Instagram size={32} className="text-white" />
                      </div>
                      <div className="text-center md:text-left">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400/70 mb-1">
                          Síguenos en Instagram
                        </p>
                        <h3 className="text-2xl md:text-3xl font-black text-white italic tracking-tighter">
                          @pecinogp
                        </h3>
                        <p className="text-white/40 text-sm mt-1">
                          Reels, carruseles y stories exclusivos de cada GP
                        </p>
                      </div>
                      <a
                        href="https://www.instagram.com/pecinogp"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto shrink-0 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black italic px-6 py-3 rounded-xl text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                      >
                        Seguir <ArrowUpRight size={16} />
                      </a>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════════════
            AUDIENCIA POR PAÍS
        ═══════════════════════════════════════════════════════════════ */}
          <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="max-w-7xl mx-auto">
              <Reveal y={30} className="mb-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-1 bg-red-600 rounded-full" />
                  <span className="text-red-500 font-black uppercase tracking-[0.2em] text-[10px]">
                    Distribución global
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter">
                  AUDIENCIA <span className="text-red-600">POR PAÍS</span>
                </h2>
                <p className="mt-2 text-[10px] text-white/30 font-bold uppercase tracking-[0.2em]">
                  Visualizaciones · últimos 12 meses
                </p>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-3">
                {COUNTRIES.map((c, i) => (
                  <motion.div
                    key={c.code}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    whileHover={{
                      x: 6,
                      transition: {
                        type: "spring",
                        stiffness: 320,
                        damping: 22,
                      },
                    }}
                    transition={{
                      delay: i * 0.04,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 transition-colors group will-change-transform"
                  >
                    {c.code !== "ot" ? (
                      <img
                        src={`https://flagcdn.com/w40/${c.code}.png`}
                        alt={c.name}
                        className="w-9 h-auto rounded-sm shadow-md ring-1 ring-white/10 shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-6 rounded-sm bg-white/10 flex items-center justify-center shrink-0">
                        <Globe size={14} className="text-white/40" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-black uppercase tracking-wider text-white/60 group-hover:text-white/80 transition-colors">
                          {c.name}
                        </span>
                        <span className="text-[11px] font-black text-red-500 ml-2 shrink-0">
                          <TelemetryPercent pct={c.pct} />
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${c.pct}%` }}
                          viewport={{ once: true }}
                          transition={{
                            delay: i * 0.04 + 0.2,
                            duration: 0.8,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400"
                          style={{ maxWidth: "100%" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── ÚLTIMOS VÍDEOS ─── */}
          <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-secondary/10 border-y border-white/5">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-1 bg-red-600 rounded-full" />
                    <span className="text-red-500 font-black uppercase tracking-[0.2em] text-[10px]">
                      Recién salido del box
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter">
                    ÚLTIMOS <span className="text-red-600">VÍDEOS</span>
                  </h2>
                </div>
                <Magnetic>
                  <Link
                    href="/analisis-gp"
                    className="group flex items-center gap-3 bg-white/5 border border-white/10 text-white font-black py-3 px-8 rounded-xl hover:bg-red-600 transition-all tracking-wider text-sm uppercase italic"
                  >
                    Ver todos los vídeos{" "}
                    <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Magnetic>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {(latest.length > 0
                  ? latest.slice(0, 3)
                  : [null, null, null]
                ).map((video, i) => (
                  <Link
                    key={video?.id ?? i}
                    href="/analisis-gp"
                    className="group relative flex flex-col bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] md:rounded-[32px] overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1.5 hover:border-white/30 hover:shadow-[0_40px_80px_rgba(0,0,0,0.7)]"
                  >
                    <div className="relative aspect-video overflow-hidden bg-white/5">
                      {video ? (
                        <Image
                          src={video.thumbnail || "/placeholder.svg"}
                          alt={video.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="absolute inset-0 animate-pulse bg-white/5" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                      {i === 0 && (
                        <div className="absolute top-4 left-4 z-20 bg-red-600 text-white px-3 py-1.5 rounded-full text-[10px] font-black flex items-center gap-1.5 shadow-xl animate-pulse uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                          Nuevo
                        </div>
                      )}

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.6)] scale-50 group-hover:scale-100 transition-transform duration-500">
                          <Play
                            className="fill-white text-white translate-x-0.5"
                            size={24}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 md:p-8 flex flex-col flex-grow">
                      {video ? (
                        <>
                          <div className="flex items-center gap-2 mb-4">
                            <Calendar size={12} className="text-red-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                              {new Date(video.publishedAt).toLocaleDateString(
                                "es-ES",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          </div>
                          <h3 className="text-lg md:text-xl font-black italic tracking-tighter text-white mb-4 group-hover:text-red-500 transition-colors line-clamp-2 leading-tight uppercase">
                            {decodeHtmlEntities(video.title)}
                          </h3>
                        </>
                      ) : (
                        <div className="space-y-3">
                          <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
                          <div className="h-5 w-full bg-white/10 rounded animate-pulse" />
                        </div>
                      )}

                      <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">
                          Ver en el archivo
                        </span>
                        <ArrowUpRight
                          size={18}
                          className="text-white/30 group-hover:text-red-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </MotionConfig>
  );
}
