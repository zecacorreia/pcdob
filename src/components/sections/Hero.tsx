"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { LogoSymbol } from "@/components/brand/Logo";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { EASE_OUT_EXPO, lineReveal } from "@/lib/motion";

type HeroMedia =
  | { type: "video"; src: string; poster?: string }
  | { type: "image"; src: string; alt: string };

type Cta = { label: string; href: string };

export type HeroProps = {
  eyebrow?: string;
  /** Cada item é uma linha da manchete. */
  headline?: string[];
  /** Índice da linha destacada em amarelo. */
  accentLine?: number;
  description?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  /** Vídeo ou imagem de fundo. Sem mídia, usa o fundo gráfico da marca. */
  media?: HeroMedia;
  /** Palavras do letreiro rolante na base da seção. */
  marquee?: string[];
};

const DEFAULTS = {
  eyebrow: "Partido Comunista do Brasil — desde 1922",
  headline: ["O futuro", "se constrói", "na luta."],
  accentLine: 2,
  description:
    "Há mais de um século ao lado do povo brasileiro, por soberania nacional, democracia, direitos e um novo projeto de desenvolvimento rumo ao socialismo.",
  primaryCta: { label: "Filie-se", href: "/filie-se" },
  secondaryCta: { label: "Nossa história", href: "#partido" },
  marquee: ["Soberania nacional", "Democracia", "Trabalho e direitos", "Desenvolvimento", "Socialismo"],
} satisfies Required<Omit<HeroProps, "media">>;

export function Hero({
  eyebrow = DEFAULTS.eyebrow,
  headline = DEFAULTS.headline,
  accentLine = DEFAULTS.accentLine,
  description = DEFAULTS.description,
  primaryCta = DEFAULTS.primaryCta,
  secondaryCta = DEFAULTS.secondaryCta,
  marquee = DEFAULTS.marquee,
  media,
}: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // Parallax: conforme a seção sai da tela, o texto desce e desaparece
  // enquanto o fundo aproxima levemente — dá profundidade sem pesar.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const symbolRotate = useTransform(scrollYProgress, [0, 1], [-12, 18]);

  const parallax = !reduceMotion;
  const introDelay = 0.2;

  return (
    <section
      ref={sectionRef}
      id="inicio"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-paper"
    >
      {/* ---------- Fundo ---------- */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={parallax ? { scale: mediaScale } : undefined}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, ease: EASE_OUT_EXPO }}
      >
        {media?.type === "video" && (
          <video
            className="h-full w-full object-cover opacity-60"
            src={media.src}
            poster={media.poster}
            autoPlay={!reduceMotion}
            muted
            loop
            playsInline
            preload="metadata"
          />
        )}
        {media?.type === "image" && (
          <Image src={media.src} alt={media.alt} fill priority sizes="100vw" className="object-cover opacity-60" />
        )}
        {!media && (
          <motion.div
            className="absolute -right-[20%] top-1/2 w-[110vw] -translate-y-1/2 text-vermelho/25 md:-right-[8%] md:w-[70vw]"
            style={parallax ? { rotate: symbolRotate } : undefined}
          >
            <LogoSymbol className="h-auto w-full" />
          </motion.div>
        )}

        {/* Camadas de cor: mantém legibilidade sobre qualquer mídia. */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(215,20,26,0.55),transparent_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/70" />
        <div className="bg-grain absolute inset-0 opacity-[0.08] mix-blend-overlay" />
      </motion.div>

      {/* ---------- Conteúdo ---------- */}
      <motion.div
        className="container flex flex-1 flex-col justify-end pb-16 pt-32 md:pb-20"
        style={parallax ? { y: textY, opacity: textOpacity } : undefined}
      >
        <motion.p
          className="mb-6 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.25em] text-paper/70 md:mb-10 md:text-sm"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: introDelay }}
        >
          <span className="h-px w-10 bg-ouro" aria-hidden="true" />
          {eyebrow}
        </motion.p>

        <h1
          id="hero-title"
          aria-label={headline.join(" ")}
          className="font-display text-display-2xl font-black uppercase [font-stretch:115%]"
        >
          {headline.map((line, index) => (
            <span key={`${line}-${index}`} aria-hidden="true" className="line-mask">
              <motion.span
                className={`block origin-top-left ${index === accentLine ? "text-ouro" : ""}`}
                variants={lineReveal}
                initial="hidden"
                animate="visible"
                custom={introDelay + 0.15 + index * 0.12}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-end md:justify-between">
          <motion.p
            className="max-w-md text-base leading-relaxed text-paper/75 md:text-lg"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: introDelay + 0.7 }}
          >
            {description}
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: introDelay + 0.85 }}
          >
            <MagneticButton href={primaryCta.href}>{primaryCta.label}</MagneticButton>
            <MagneticButton href={secondaryCta.href} variant="ghost">
              {secondaryCta.label}
            </MagneticButton>
          </motion.div>
        </div>
      </motion.div>

      {/* ---------- Indicador de scroll ---------- */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-24 right-5 hidden flex-col items-center gap-3 md:right-8 md:flex xl:right-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: introDelay + 1.2, duration: 1 }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-paper/50 [writing-mode:vertical-rl]">Role</span>
        <span className="relative h-14 w-px overflow-hidden bg-paper/15">
          <span className="absolute inset-0 animate-scroll-line bg-ouro motion-reduce:animate-none" />
        </span>
      </motion.div>

      {/* ---------- Letreiro ---------- */}
      <div className="relative border-t border-paper/10 bg-vermelho py-3 text-ink md:py-4">
        <div className="flex w-max animate-marquee motion-reduce:animate-none">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1}
              className="flex shrink-0 items-center font-display text-lg font-extrabold uppercase md:text-2xl"
            >
              {/* Repetido para cobrir telas largas sem "buraco" no loop. */}
              {[...marquee, ...marquee].map((word, index) => (
                <li key={`${word}-${index}`} className="flex items-center whitespace-nowrap">
                  <span className="px-6 md:px-10">{word}</span>
                  <LogoSymbol className="h-4 w-4 text-ouro md:h-5 md:w-5" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
