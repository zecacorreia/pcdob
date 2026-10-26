"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { LogoSymbol } from "@/components/brand/Logo";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { EASE_OUT_EXPO, lineReveal } from "@/lib/motion";
import { MEMBERSHIP_URLS } from "@/lib/navigation";

const HEADLINE = ["O futuro", "tem partido."];

/** Abertura da página Filie-se: manchete da campanha + CTAs para o PCdoB Digital. */
export function JoinHero() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const symbolRotate = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const symbolScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  return (
    <section
      ref={ref}
      aria-labelledby="join-title"
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink text-paper"
    >
      {/* Fundo */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <motion.div
          className="absolute -right-[35%] top-[8%] w-[120vw] text-vermelho md:-right-[12%] md:top-1/2 md:w-[62vw] md:-translate-y-1/2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: EASE_OUT_EXPO }}
        >
          <motion.div style={reduceMotion ? undefined : { rotate: symbolRotate, scale: symbolScale }}>
            <LogoSymbol className="h-auto w-full" />
          </motion.div>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
        <div className="bg-grain absolute inset-0 opacity-[0.08] mix-blend-overlay" />
      </div>

      <motion.div
        className="container pb-16 pt-36 md:pb-24"
        style={reduceMotion ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <motion.p
          className="mb-6 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.25em] text-paper/70 md:mb-10 md:text-sm"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.2 }}
        >
          <span className="h-px w-10 bg-ouro" aria-hidden="true" />
          Filie-se ao PCdoB
        </motion.p>

        <h1
          id="join-title"
          aria-label={HEADLINE.join(" ")}
          className="font-display text-display-2xl font-black uppercase [font-stretch:115%]"
        >
          {HEADLINE.map((line, index) => (
            <span key={line} aria-hidden="true" className="line-mask">
              <motion.span
                className={`block origin-top-left ${index === 1 ? "text-ouro" : ""}`}
                variants={lineReveal}
                initial="hidden"
                animate="visible"
                custom={0.35 + index * 0.12}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-2 md:items-end">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.9 }}
          >
            <p className="font-display text-xl font-extrabold uppercase leading-tight [font-stretch:105%] md:text-2xl">
              E ele precisa de quem não se cala. <span className="text-vermelho">Vem pro PCdoB.</span>
            </p>
            <p className="mt-4 max-w-md text-base leading-relaxed text-paper/70 md:text-lg">
              Se você sente que tem algo errado nesse sistema, você tá certo. Mas a mudança real não vem sozinha. Ela
              vem com organização.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center gap-3 md:justify-end"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 1.05 }}
          >
            <MagneticButton href={MEMBERSHIP_URLS.join} external>
              Quero me filiar
            </MagneticButton>
            <MagneticButton href={MEMBERSHIP_URLS.updateData} variant="ghost" external>
              Já sou filiado
            </MagneticButton>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
