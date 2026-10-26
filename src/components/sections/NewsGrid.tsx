"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring, type Variants } from "framer-motion";
import type { MouseEvent } from "react";

import { LogoSymbol } from "@/components/brand/Logo";
import { Reveal, RevealText } from "@/components/motion/Reveal";
import { formatDate } from "@/lib/format";
import { EASE_IN_OUT_QUART, EASE_OUT_EXPO, fadeUp } from "@/lib/motion";
import type { NewsItem } from "@/types/news";

type NewsGridProps = {
  items: NewsItem[];
  eyebrow?: string;
  title?: string[];
  /** Sem valor, o link "Ver todas" não aparece. */
  viewAllHref?: string;
  /** `false` na página /noticias, que tem cabeçalho próprio. */
  showHeader?: boolean;
  sectionId?: string;
};

type CardVariant = "feature" | "standard" | "wide";

/**
 * Composição assimétrica em 12 colunas (desktop), repetida a cada 5 itens:
 *
 *   ┌───────────────┬──────────┐
 *   │               │    1     │
 *   │       0       ├──────────┤
 *   │               │    2     │
 *   ├──────────┬────┴──────────┤
 *   │    3     │       4       │
 *   └──────────┴───────────────┘
 */
const LAYOUT: { variant: CardVariant; className: string }[] = [
  { variant: "feature", className: "md:col-span-6 lg:col-span-7 lg:row-span-2 min-h-[30rem] lg:min-h-[46rem]" },
  { variant: "standard", className: "md:col-span-3 lg:col-span-5 min-h-[22rem]" },
  { variant: "standard", className: "md:col-span-3 lg:col-span-5 min-h-[22rem]" },
  { variant: "standard", className: "md:col-span-3 lg:col-span-5 min-h-[22rem]" },
  { variant: "wide", className: "md:col-span-3 lg:col-span-7 min-h-[22rem]" },
];

export function NewsGrid({
  items,
  eyebrow = "Notícias",
  title = ["Em", "destaque"],
  viewAllHref,
  showHeader = true,
  sectionId = "noticias",
}: NewsGridProps) {
  if (items.length === 0) return null;
  const titleId = `${sectionId}-title`;

  return (
    <section
      id={sectionId}
      {...(showHeader ? { "aria-labelledby": titleId } : { "aria-label": "Lista de notícias" })}
      className={`bg-paper text-ink ${showHeader ? "py-24 md:py-36" : "pb-24 md:pb-36"}`}
    >
      <div className="container">
        {showHeader && (
          <header className="mb-12 flex flex-col gap-8 md:mb-20 md:flex-row md:items-end md:justify-between">
            <div>
              <Reveal>
                <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-vermelho md:text-sm">
                  <span className="h-px w-10 bg-vermelho" aria-hidden="true" />
                  {eyebrow}
                </p>
              </Reveal>
              <RevealText
                id={titleId}
                lines={title}
                className="font-display text-display-xl font-black uppercase [font-stretch:115%]"
                accentLine={title.length - 1}
              />
            </div>

            {viewAllHref && (
              <Reveal delay={0.2}>
                <Link
                  href={viewAllHref}
                  className="group inline-flex items-center gap-4 text-sm font-semibold uppercase tracking-[0.18em] outline-none focus-visible:underline"
                >
                  <span className="bg-gradient-to-r from-current to-current bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 ease-out-expo group-hover:bg-[length:100%_1px]">
                    Ver todas as notícias
                  </span>
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-ink/20 transition-colors duration-300 group-hover:border-vermelho group-hover:bg-vermelho group-hover:text-paper">
                    <ArrowIcon className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:-rotate-45" />
                  </span>
                </Link>
              </Reveal>
            )}
          </header>
        )}

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-5 lg:grid-cols-12 lg:grid-flow-dense">
          {items.map((item, index) => {
            const layout = LAYOUT[index % LAYOUT.length];
            return (
              <motion.li
                key={item.id}
                className={`flex ${layout.className}`}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                // Pequeno atraso em cascata, reiniciado a cada "linha" do grid.
                custom={(index % 3) * 0.08}
              >
                <NewsCard item={item} variant={layout.variant} priority={index === 0} />
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Card                                     */
/* -------------------------------------------------------------------------- */

const MotionLink = motion.create(Link);

/** Estados propagados do link para os filhos (hover e foco por teclado). */
const card = {
  image: {
    rest: { scale: 1.02, filter: "grayscale(35%)" },
    hover: { scale: 1.1, filter: "grayscale(0%)", transition: { duration: 1.2, ease: EASE_OUT_EXPO } },
  },
  wash: {
    // Cortina vermelha que sobe pela imagem.
    rest: { clipPath: "inset(100% 0% 0% 0%)" },
    hover: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 0.7, ease: EASE_IN_OUT_QUART } },
  },
  arrow: {
    rest: { rotate: 0, backgroundColor: "rgba(246,242,236,0)", color: "#F6F2EC" },
    hover: {
      rotate: -45,
      backgroundColor: "#FFD400",
      color: "#110A0A",
      transition: { duration: 0.5, ease: EASE_OUT_EXPO },
    },
  },
  meta: {
    rest: { y: 0 },
    hover: { y: -6, transition: { duration: 0.6, ease: EASE_OUT_EXPO } },
  },
} satisfies Record<string, Variants>;

type NewsCardProps = {
  item: NewsItem;
  variant: CardVariant;
  priority?: boolean;
};

function NewsCard({ item, variant, priority }: NewsCardProps) {
  const reduceMotion = useReducedMotion();

  // Etiqueta "Ler" que segue o cursor dentro do card (apenas mouse).
  const cursorX = useSpring(useMotionValue(0), { stiffness: 300, damping: 28 });
  const cursorY = useSpring(useMotionValue(0), { stiffness: 300, damping: 28 });

  function handlePointerMove(event: MouseEvent<HTMLAnchorElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    cursorX.set(event.clientX - rect.left);
    cursorY.set(event.clientY - rect.top);
  }

  const isFeature = variant === "feature";
  const isExternal = item.href.startsWith("http");

  return (
    <MotionLink
      href={item.href}
      {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
      initial="rest"
      animate="rest"
      whileHover={reduceMotion ? undefined : "hover"}
      whileFocus={reduceMotion ? undefined : "hover"}
      onMouseMove={handlePointerMove}
      className="group relative flex w-full flex-col justify-end overflow-hidden rounded-2xl bg-ink text-paper outline-none focus-visible:ring-4 focus-visible:ring-vermelho/60 md:rounded-3xl md:[cursor:none]"
    >
      {/* Mídia */}
      <div className="absolute inset-0" aria-hidden="true">
        {item.image ? (
          <motion.div className="absolute inset-0" variants={card.image}>
            <Image
              src={item.image.src}
              alt=""
              fill
              priority={priority}
              sizes={
                isFeature
                  ? "(min-width: 1024px) 58vw, 100vw"
                  : "(min-width: 1024px) 42vw, (min-width: 768px) 50vw, 100vw"
              }
              className="object-cover"
            />
          </motion.div>
        ) : (
          <BrandPlaceholder />
        )}
        <motion.div className="absolute inset-0 bg-vermelho mix-blend-multiply" variants={card.wash} />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
      </div>

      {/* Etiqueta que segue o cursor */}
      <motion.span
        aria-hidden="true"
        style={{ x: cursorX, y: cursorY }}
        className="pointer-events-none absolute left-0 top-0 z-20 hidden md:block"
      >
        <span className="flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 scale-0 items-center justify-center rounded-full bg-ouro text-xs font-bold uppercase tracking-[0.2em] text-ink transition-transform duration-500 ease-out-expo group-hover:scale-100">
          Ler
        </span>
      </motion.span>

      {/* Conteúdo */}
      <motion.div className="relative z-10 flex flex-col gap-5 p-6 md:p-8 lg:p-10" variants={card.meta}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em]">
            <span className="rounded-full bg-paper/10 px-3 py-1.5 backdrop-blur-md">{item.category}</span>
            <time dateTime={item.date} className="text-paper/70">
              {formatDate(item.date)}
            </time>
          </div>
          <motion.span
            aria-hidden="true"
            variants={card.arrow}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-paper/30 md:h-12 md:w-12"
          >
            <ArrowIcon className="h-4 w-4" />
          </motion.span>
        </div>

        <h3
          className={`font-display font-extrabold uppercase leading-[0.95] [font-stretch:105%] ${
            isFeature
              ? "text-3xl md:text-5xl lg:text-6xl"
              : variant === "wide"
                ? "text-2xl md:text-3xl lg:text-4xl"
                : "text-2xl md:text-3xl"
          }`}
        >
          <span className="bg-gradient-to-r from-ouro to-ouro bg-[length:0%_3px] bg-left-bottom bg-no-repeat transition-[background-size] duration-700 ease-out-expo group-hover:bg-[length:100%_3px] group-focus-visible:bg-[length:100%_3px]">
            {item.title}
          </span>
        </h3>

        {isFeature && item.excerpt && (
          <p className="line-clamp-2 max-w-xl text-sm leading-relaxed text-paper/70 md:text-base">{item.excerpt}</p>
        )}
      </motion.div>
    </MotionLink>
  );
}

/** Fundo da marca para notícias sem imagem destacada. */
function BrandPlaceholder() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-vermelho-700 via-vermelho-900 to-ink">
      <LogoSymbol className="absolute -right-[12%] -top-[10%] h-auto w-[75%] text-ink/25" />
      <div className="bg-grain absolute inset-0 opacity-[0.1] mix-blend-overlay" />
    </div>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M1 8h14M9 2l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  );
}
