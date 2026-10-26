"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";

import { LogoSymbol } from "@/components/brand/Logo";
import { Reveal, RevealText } from "@/components/motion/Reveal";
import { EASE_OUT_EXPO } from "@/lib/motion";
import type { Leader } from "@/types/leader";

type LeadershipsProps = {
  /** Direção nacional — exibida em cards largos no topo. */
  featured: Leader[];
  /** Bancada federal — grid filtrável por estado. */
  deputies: Leader[];
};

const ALL = "Todos";

export function Leaderships({ featured, deputies }: LeadershipsProps) {
  const [uf, setUf] = useState<string>(ALL);

  const states = useMemo(
    () => [ALL, ...Array.from(new Set(deputies.map((deputy) => deputy.uf).filter(Boolean) as string[])).sort()],
    [deputies],
  );
  const visible = uf === ALL ? deputies : deputies.filter((deputy) => deputy.uf === uf);

  return (
    <section id="liderancas" aria-labelledby="leaders-title" className="bg-paper py-24 text-ink md:py-36">
      <div className="container">
        {/* ---------- Cabeçalho ---------- */}
        <header className="mb-14 grid gap-8 md:mb-20 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <Reveal>
              <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-vermelho md:text-sm">
                <span className="h-px w-10 bg-vermelho" aria-hidden="true" />
                Lideranças
              </p>
            </Reveal>
            <RevealText
              id="leaders-title"
              lines={["Quem luta", "por você"]}
              accentLine={1}
              className="font-display text-display-xl font-black uppercase [font-stretch:115%]"
            />
          </div>
          <Reveal delay={0.2} className="max-w-sm">
            <p className="text-base leading-relaxed text-ink/70">
              Mulheres e homens que levam o programa do partido às instituições — no governo, na direção partidária e no
              Congresso Nacional.
            </p>
          </Reveal>
        </header>

        {/* ---------- Direção em destaque ---------- */}
        {featured.length > 0 && (
          <ul className="mb-20 grid gap-4 md:mb-28 md:gap-5">
            {featured.map((leader, index) => (
              <li key={leader.id}>
                <Reveal delay={index * 0.08}>
                  <FeaturedCard leader={leader} />
                </Reveal>
              </li>
            ))}
          </ul>
        )}

        {/* ---------- Bancada federal ---------- */}
        <div className="mb-8 flex flex-col gap-6 border-t border-ink/15 pt-10 md:mb-12 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <h3 className="font-display text-display-md font-extrabold uppercase [font-stretch:110%]">
              Bancada federal
              <span className="ml-3 align-top text-base font-semibold tabular-nums text-vermelho">
                {String(deputies.length).padStart(2, "0")}
              </span>
            </h3>
          </Reveal>

          <Reveal delay={0.1}>
            <div role="group" aria-label="Filtrar por estado" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0">
              {states.map((state) => {
                const active = state === uf;
                return (
                  <button
                    key={state}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setUf(state)}
                    className={`relative shrink-0 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-300 ${
                      active ? "border-ink text-paper" : "border-ink/20 text-ink/70 hover:border-ink hover:text-ink"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="uf-pill"
                        className="absolute inset-0 rounded-full bg-ink"
                        transition={{ type: "spring", stiffness: 400, damping: 34 }}
                      />
                    )}
                    <span className="relative">{state}</span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>

        <DeputiesTrack deputies={visible} resetKey={uf} />

        <p className="mt-8 text-xs text-ink/50">
          Composição e fotos oficiais:{" "}
          <a
            href="https://dadosabertos.camara.leg.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-vermelho"
          >
            Dados Abertos da Câmara dos Deputados
          </a>
          .
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                         Bancada: slider / grid                             */
/* -------------------------------------------------------------------------- */

/**
 * Abaixo de `md`, slider horizontal com scroll-snap nativo (o gesto de
 * arrastar é o do próprio navegador), setas, contador e barra de progresso.
 * De `md` em diante, o mesmo DOM vira grid — só as classes mudam.
 */
function DeputiesTrack({ deputies, resetKey }: { deputies: Leader[]; resetKey: string }) {
  const trackRef = useRef<HTMLUListElement>(null);
  // Card de destino enquanto a rolagem suave acontece: cliques rápidos somam
  // a partir dele, e não da posição intermediária da animação.
  const targetRef = useRef<number | null>(null);
  const [position, setPosition] = useState({ index: 0, atStart: true, atEnd: deputies.length <= 1 });
  const { scrollXProgress } = useScroll({ container: trackRef });

  /** Largura de um passo do slider: um card + o espaço entre cards. */
  function stepWidth(track: HTMLUListElement) {
    const first = track.children[0] as HTMLElement | undefined;
    if (!first) return track.clientWidth;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return first.offsetWidth + gap;
  }

  function updatePosition() {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const step = stepWidth(track);
    const atEnd = track.scrollLeft >= maxScroll - 4;
    // Chegou ao destino (ou ao fim, onde o último card não encosta à esquerda).
    if (targetRef.current !== null && (Math.abs(track.scrollLeft - targetRef.current * step) < 4 || atEnd)) {
      targetRef.current = null;
    }
    setPosition({
      index: Math.min(deputies.length - 1, Math.round(track.scrollLeft / step)),
      atStart: track.scrollLeft <= 4,
      atEnd,
    });
  }

  function go(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const step = stepWidth(track);
    const from = targetRef.current ?? Math.round(track.scrollLeft / step);
    const next = Math.max(0, Math.min(deputies.length - 1, from + direction));
    targetRef.current = next;
    track.scrollTo({ left: next * step, behavior: "smooth" });
  }

  // Trocar o filtro de estado volta o slider para o primeiro card.
  useEffect(() => {
    targetRef.current = null;
    trackRef.current?.scrollTo({ left: 0 });
    updatePosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reage só à troca de filtro/lista
  }, [resetKey, deputies.length]);

  const arrow =
    "grid h-11 w-11 place-items-center rounded-full border border-ink/20 transition-colors duration-300 hover:border-vermelho hover:bg-vermelho hover:text-paper disabled:pointer-events-none disabled:opacity-30";

  return (
    <div>
      <motion.ul
        ref={trackRef}
        layout
        layoutScroll
        onScroll={updatePosition}
        // Arrastar com o dedo cancela o destino dos botões.
        onTouchStart={() => (targetRef.current = null)}
        aria-label="Deputadas e deputados federais"
        className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-1 [scrollbar-width:none] md:mx-0 md:grid md:snap-none md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4 lg:gap-5 [&::-webkit-scrollbar]:hidden"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {deputies.map((deputy, index) => (
            <motion.li
              key={deputy.id}
              layout
              className="w-[72%] shrink-0 snap-start sm:w-[44%] md:w-auto"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: (index % 4) * 0.06 }}
            >
              <DeputyCard leader={deputy} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {/* Controles — só no modo slider */}
      {deputies.length > 1 && (
        <div className="mt-6 flex items-center gap-4 md:hidden">
          <span aria-live="polite" className="w-14 shrink-0 text-xs font-semibold tabular-nums tracking-[0.15em] text-ink/60">
            {String(position.index + 1).padStart(2, "0")} / {String(deputies.length).padStart(2, "0")}
          </span>
          <div aria-hidden="true" className="h-px flex-1 bg-ink/15">
            <motion.div className="h-full origin-left bg-vermelho" style={{ scaleX: scrollXProgress }} />
          </div>
          <button type="button" onClick={() => go(-1)} disabled={position.atStart} aria-label="Parlamentar anterior" className={arrow}>
            <ArrowIcon className="h-4 w-4 rotate-180" />
          </button>
          <button type="button" onClick={() => go(1)} disabled={position.atEnd} aria-label="Próximo parlamentar" className={arrow}>
            <ArrowIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Card destaque                               */
/* -------------------------------------------------------------------------- */

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

function FeaturedCard({ leader }: { leader: Leader }) {
  const content = (
    <>
      {/* Retrato ou monograma */}
      <div className="relative aspect-[4/3] overflow-hidden bg-vermelho md:aspect-auto md:min-h-[26rem]">
        {leader.image ? (
          <Image
            src={leader.image}
            alt=""
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover object-top grayscale transition duration-1000 ease-out-expo group-hover:scale-105 group-hover:grayscale-0"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <LogoSymbol className="absolute -bottom-[15%] -right-[10%] h-auto w-[85%] text-ink/15 transition-transform duration-1000 ease-out-expo group-hover:-rotate-6 group-hover:scale-105" />
            <span className="relative font-display text-[clamp(6rem,16vw,14rem)] font-black leading-none tracking-[-0.05em] text-paper [font-stretch:115%]">
              {initials(leader.name)}
            </span>
          </div>
        )}
      </div>

      <div className="relative flex flex-col justify-between gap-10 p-6 md:p-10 lg:p-14">
        <span className="self-start rounded-full bg-paper/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-ouro">
          Direção nacional
        </span>
        <div>
          <p className="font-display text-display-lg font-black uppercase [font-stretch:115%]">{leader.name}</p>
          <p className="mt-4 text-base text-paper/70 md:text-lg">{leader.role}</p>
        </div>
        {leader.href && (
          <span className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.2em]">
            Conhecer trajetória
            <span className="grid h-11 w-11 place-items-center rounded-full border border-paper/30 transition-all duration-500 ease-out-expo group-hover:-rotate-45 group-hover:border-ouro group-hover:bg-ouro group-hover:text-ink">
              <ArrowIcon className="h-4 w-4" />
            </span>
          </span>
        )}
      </div>
    </>
  );

  const className =
    "group grid overflow-hidden rounded-2xl bg-ink text-paper outline-none focus-visible:ring-4 focus-visible:ring-vermelho/60 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:rounded-3xl";

  return leader.href ? (
    <Link href={leader.href} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Card parlamentar                              */
/* -------------------------------------------------------------------------- */

/**
 * Card retrato com inclinação 3D que segue o cursor, reflexo de luz,
 * foto que ganha cor e painel de informações que sobe no hover/foco.
 */
function DeputyCard({ leader }: { leader: Leader }) {
  const reduceMotion = useReducedMotion();

  // Posição do ponteiro normalizada (-0.5 a 0.5) dentro do card.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const spring = { stiffness: 200, damping: 20, mass: 0.5 };
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [9, -9]), spring);
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-9, 9]), spring);
  const glareX = useTransform(pointerX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(pointerY, [-0.5, 0.5], ["0%", "100%"]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.28), transparent 55%)`;

  function handleMove(event: MouseEvent<HTMLAnchorElement>) {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <motion.a
      href={leader.href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={reduceMotion ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-paper-dim outline-none focus-visible:ring-4 focus-visible:ring-vermelho/60"
      aria-label={`${leader.name}, ${leader.role}${leader.uf ? `, ${leader.uf}` : ""} — ver perfil`}
    >
      {leader.image && (
        <Image
          src={leader.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 48vw"
          className="object-cover object-top grayscale transition duration-700 ease-out-expo group-hover:scale-105 group-hover:grayscale-0 group-focus-visible:grayscale-0"
        />
      )}

      {/* Sigla do estado em contorno */}
      {leader.uf && (
        <span
          aria-hidden="true"
          // As fotos oficiais têm fundo claro: contorno vermelho que se preenche no hover.
          className="text-outline absolute right-3 top-2 font-display text-5xl font-black text-vermelho/70 transition-colors duration-500 [font-stretch:115%] group-hover:text-vermelho group-hover:[-webkit-text-fill-color:currentColor] md:text-6xl"
        >
          {leader.uf}
        </span>
      )}

      {/* Base: gradiente + nome + painel que sobe */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 translate-y-10 p-4 text-paper transition-transform duration-500 ease-out-expo group-hover:translate-y-0 group-focus-visible:translate-y-0 md:p-5">
        <p className="font-display text-lg font-extrabold uppercase leading-[0.95] [font-stretch:105%] md:text-2xl">
          {leader.name}
        </p>
        <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-paper/60">{leader.role}</p>
        <p className="mt-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-ouro opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
          Ver perfil <ArrowIcon className="h-3 w-3 -rotate-45" />
        </p>
      </div>

      {/* Faixa vermelha que cresce no hover */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-vermelho transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
      />

      {!reduceMotion && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: glare }}
        />
      )}
    </motion.a>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M1 8h14M9 2l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  );
}
