"use client";

import { motion } from "framer-motion";
import type { ElementType, ReactNode } from "react";

import { fadeUp, lineReveal } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

/** Fade + slide-up quando o elemento entra na viewport (uma única vez). */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}

type RevealTextProps = {
  /** Cada item vira uma linha com máscara própria. */
  lines: string[];
  id?: string;
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  /** Índice da linha que recebe `accentClassName`. */
  accentLine?: number;
  accentClassName?: string;
  delay?: number;
  stagger?: number;
};

/**
 * Manchete com linhas que sobem de dentro de uma máscara — o efeito de
 * tipografia característico da referência. O texto completo fica acessível
 * para leitores de tela via `aria-label`.
 */
export function RevealText({
  lines,
  id,
  as: Tag = "h2",
  className,
  lineClassName = "",
  accentLine,
  accentClassName = "text-vermelho",
  delay = 0,
  stagger = 0.08,
}: RevealTextProps) {
  return (
    <Tag id={id} className={className} aria-label={lines.join(" ")}>
      {lines.map((line, index) => (
        <span key={`${line}-${index}`} aria-hidden="true" className="line-mask">
          <motion.span
            className={`block origin-top-left ${lineClassName} ${index === accentLine ? accentClassName : ""}`}
            variants={lineReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            custom={delay + index * stagger}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
