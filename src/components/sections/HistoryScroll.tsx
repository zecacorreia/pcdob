"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { LogoSymbol } from "@/components/brand/Logo";
import { Reveal, RevealText } from "@/components/motion/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { historyMilestones, type HistoryMilestone } from "@/data/history";
import { EASE_IN_OUT_QUART, EASE_OUT_EXPO } from "@/lib/motion";

type HistoryScrollProps = {
  milestones?: HistoryMilestone[];
  /** Botão do painel final. Na própria /o-partido aponta para o Filie-se. */
  cta?: { label: string; href: string };
};

/**
 * Timeline com scroll horizontal "preso" (pinned):
 *
 * - Desktop (md+): a seção fica fixa na tela e a rolagem vertical move a
 *   trilha de marcos na horizontal. A altura da seção é calculada a partir
 *   da largura da trilha, então a velocidade é 1:1 com a rolagem.
 * - Mobile ou `prefers-reduced-motion`: vira uma timeline vertical comum,
 *   com os marcos revelados conforme entram na tela.
 *
 * É um único DOM nos dois modos — só as classes e o `transform` mudam.
 */
export function HistoryScroll({
  milestones = historyMilestones,
  cta = { label: "Conheça o partido", href: "/o-partido" },
}: HistoryScrollProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const reduceMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const pinned = isDesktop && !reduceMotion;

  // Quanto a trilha precisa andar para mostrar o último marco.
  const [distance, setDistance] = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !pinned) return;
    const measure = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pinned]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const x = useTransform(smoothProgress, (value) => -value * distance);
  // O símbolo de fundo anda mais devagar que a trilha: profundidade (parallax).
  const symbolX = useTransform(smoothProgress, [0, 1], ["0%", "-30%"]);
  const symbolRotate = useTransform(smoothProgress, [0, 1], [0, 40]);

  // Índice do marco em destaque para o contador "03 / 07".
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (!pinned) return;
    const index = Math.min(milestones.length - 1, Math.max(0, Math.round(value * (milestones.length + 1)) - 1));
    setActive(index);
  });

  return (
    <section
      ref={sectionRef}
      id="partido"
      aria-labelledby="history-title"
      className="relative bg-ink text-paper"
      style={pinned && distance ? { height: `calc(${distance}px + 100svh)` } : undefined}
    >
      <div className={pinned ? "sticky top-0 flex h-[100svh] flex-col overflow-hidden" : "relative overflow-hidden"}>
        {/* Símbolo gigante ao fundo */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[25%] right-[-30%] w-[110vw] text-vermelho/10 md:right-[-10%] md:w-[65vw]"
          style={pinned ? { x: symbolX, rotate: symbolRotate } : undefined}
        >
          <LogoSymbol className="h-auto w-full" />
        </motion.div>
        <div aria-hidden="true" className="bg-grain pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay" />

        {/* Barra superior: rótulo + contador (apenas no modo fixo) */}
        {pinned && (
          <div className="container relative z-10 flex items-center justify-between pt-28 text-xs font-semibold uppercase tracking-[0.25em] text-paper/60">
            <span className="flex items-center gap-3">
              <span className="h-px w-10 bg-ouro" aria-hidden="true" />
              Nossa história
            </span>
            <span aria-hidden="true" className="flex items-center gap-2 tabular-nums">
              <span className="relative inline-block h-[1.2em] overflow-hidden text-paper">
                <motion.span
                  key={active}
                  className="block"
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                >
                  {String(active + 1).padStart(2, "0")}
                </motion.span>
              </span>
              / {String(milestones.length).padStart(2, "0")}
            </span>
          </div>
        )}

        <motion.ol
          ref={trackRef}
          style={pinned ? { x } : undefined}
          className={
            pinned
              ? "relative z-10 flex w-max flex-1 items-center gap-0 pl-[max(2rem,calc((100vw-1600px)/2+3rem))]"
              : "container relative z-10 flex flex-col py-24"
          }
        >
          {/* Painel de abertura */}
          <li className={pinned ? "flex w-[min(80vw,52rem)] shrink-0 flex-col justify-center pr-[8vw]" : "mb-16"}>
            {!pinned && (
              <Reveal>
                <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-paper/60">
                  <span className="h-px w-10 bg-ouro" aria-hidden="true" />
                  Nossa história
                </p>
              </Reveal>
            )}
            <RevealText
              lines={["Mais de", "um século", "de luta"]}
              accentLine={2}
              accentClassName="text-vermelho"
              className="font-display text-display-xl font-black uppercase [font-stretch:115%]"
            />
            <Reveal delay={0.2} className="mt-8 max-w-md">
              <p className="text-base leading-relaxed text-paper/70 md:text-lg">
                Desde 1922 o PCdoB está presente nos grandes momentos da vida nacional — da luta operária à resistência
                contra a ditadura, da redemocratização à construção de um Brasil soberano.
              </p>
              {pinned && (
                <p aria-hidden="true" className="mt-10 flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.25em] text-ouro">
                  Role para avançar
                  <motion.span
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: EASE_IN_OUT_QUART }}
                  >
                    →
                  </motion.span>
                </p>
              )}
            </Reveal>
          </li>

          {milestones.map((milestone, index) => (
            <Milestone
              key={milestone.year}
              milestone={milestone}
              index={index}
              total={milestones.length}
              pinned={pinned}
              isActive={pinned && index === active}
            />
          ))}

          {/* Painel de fechamento */}
          <li
            className={
              pinned
                ? "flex w-[min(80vw,40rem)] shrink-0 flex-col justify-center pl-[6vw] pr-[10vw]"
                : "mt-8 border-l border-paper/15 pl-8"
            }
          >
            <Reveal>
              <p className="font-display text-display-md font-extrabold uppercase [font-stretch:110%]">
                A história continua <span className="text-ouro">com você.</span>
              </p>
              <div className="mt-8">
                <MagneticButton href={cta.href}>{cta.label}</MagneticButton>
              </div>
            </Reveal>
          </li>
        </motion.ol>

        {/* Barra de progresso */}
        {pinned && (
          <div className="container relative z-10 pb-10">
            <div className="h-px w-full bg-paper/15">
              <motion.div className="h-full origin-left bg-ouro" style={{ scaleX: smoothProgress }} />
            </div>
            <ol aria-hidden="true" className="mt-4 flex justify-between text-[11px] font-semibold tabular-nums tracking-[0.15em] text-paper/40">
              {milestones.map((milestone, index) => (
                <li key={milestone.year} className={`transition-colors duration-300 ${index === active ? "text-ouro" : ""}`}>
                  {milestone.year}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

type MilestoneProps = {
  milestone: HistoryMilestone;
  index: number;
  total: number;
  pinned: boolean;
  isActive: boolean;
};

function Milestone({ milestone, index, total, pinned, isActive }: MilestoneProps) {
  const counter = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  return (
    <li
      className={
        pinned
          ? "group relative flex h-full w-[min(70vw,34rem)] shrink-0 flex-col justify-center border-l border-paper/15 px-10 lg:w-[min(42vw,38rem)] lg:px-14"
          : "relative border-l border-paper/15 pb-16 pl-8"
      }
    >
      {/* Marcador na linha do tempo */}
      <span
        aria-hidden="true"
        className={`absolute h-3 w-3 -translate-x-1/2 rounded-full border transition-colors duration-500 ${
          pinned ? "left-0 top-1/2 -translate-y-1/2" : "left-0 top-2"
        } ${isActive ? "border-ouro bg-ouro" : "border-paper/40 bg-ink"}`}
      />

      <motion.div
        initial={{ opacity: 0, y: pinned ? 0 : 40, x: pinned ? 60 : 0 }}
        whileInView={{ opacity: 1, y: 0, x: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1, ease: EASE_OUT_EXPO }}
      >
        <div className="mb-6 flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.22em]">
          <span className="rounded-full border border-paper/20 px-3 py-1.5 text-paper/80">{milestone.tag}</span>
          <span className="tabular-nums text-paper/40">{counter}</span>
        </div>

        <Year value={milestone.year} />

        <h3 className="mt-6 max-w-sm font-display text-2xl font-extrabold uppercase leading-[0.95] [font-stretch:105%] md:text-3xl">
          {milestone.title}
        </h3>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-paper/65 md:text-base">{milestone.text}</p>
      </motion.div>
    </li>
  );
}

/** Ano em contorno que é "preenchido" da esquerda para a direita ao aparecer. */
function Year({ value }: { value: string }) {
  return (
    // A observação fica no <p>: o próprio span recortado por clip-path pode
    // não ser considerado "visível" pelo IntersectionObserver.
    <motion.p
      className="relative font-display text-[clamp(5rem,13vw,12rem)] font-black leading-[0.8] tracking-[-0.04em] [font-stretch:115%]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
    >
      <span className="text-outline text-paper/40">{value}</span>
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 text-vermelho"
        variants={{
          hidden: { clipPath: "inset(0% 100% 0% 0%)" },
          visible: {
            clipPath: "inset(0% 0% 0% 0%)",
            transition: { duration: 1.4, ease: EASE_IN_OUT_QUART, delay: 0.2 },
          },
        }}
      >
        {value}
      </motion.span>
    </motion.p>
  );
}

/** `false` no servidor e no primeiro render; atualiza após montar. */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}
