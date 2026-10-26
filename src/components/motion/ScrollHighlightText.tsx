"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef, type ElementType } from "react";

type ScrollHighlightTextProps = {
  text: string;
  as?: ElementType;
  className?: string;
  /** Palavras (sem pontuação) que ganham a cor de destaque. */
  highlight?: string[];
  highlightClassName?: string;
};

/**
 * Texto em que cada palavra "acende" conforme a rolagem avança — leitura
 * guiada pelo scroll. O texto real fica disponível para leitores de tela.
 */
export function ScrollHighlightText({
  text,
  as: Tag = "p",
  className,
  highlight = [],
  highlightClassName = "text-vermelho",
}: ScrollHighlightTextProps) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });

  const words = text.split(" ");
  const accents = new Set(highlight.map((word) => word.toLowerCase()));

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, index) => {
        const isAccent = accents.has(word.replace(/[.,;:!?"“”'’()]/g, "").toLowerCase());
        return (
          <Word
            key={`${word}-${index}`}
            progress={scrollYProgress}
            range={[index / words.length, (index + 1) / words.length]}
            className={isAccent ? highlightClassName : undefined}
            disabled={!!reduceMotion}
          >
            {word}
          </Word>
        );
      })}
    </Tag>
  );
}

type WordProps = {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  className?: string;
  disabled: boolean;
};

function Word({ children, progress, range, className, disabled }: WordProps) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span aria-hidden="true" className={`inline-block ${className ?? ""}`} style={disabled ? undefined : { opacity }}>
      {children}
      {" "}
    </motion.span>
  );
}
